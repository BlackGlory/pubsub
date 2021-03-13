import { go } from '@blackglory/go'
import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { sse } from 'extra-generator'
import { waitForEventEmitter } from '@blackglory/wait-for'
import websocket from 'fastify-websocket'
import { SSE_HEARTBEAT_INTERVAL } from '@env'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(websocket, {
    options: {
      noServer: true
    }
  })

  server.server.on('upgrade', async (req, socket, head) => {
    const url = req.url
    const pathnameRegExp = /^\/pubsub\/(?<id>[a-zA-Z0-9\.\-_]{1,256})$/
    const result = getPathname(url).match(pathnameRegExp)
    if (!result) return socket.destroy()

    const id = result.groups!.id
    const token = parseQuerystring<{ token?: string }>(url).token

    try {
      await Core.Blacklist.check(id)
      await Core.Whitelist.check(id)
      await Core.TBAC.checkReadPermission(id, token)
    } catch {
      return socket.destroy()
    }

    server.websocketServer.handleUpgrade(req, socket, head, async ws => {
      server.websocketServer.emit('connection', ws, req)
    })
  })

  server.route<{
    Params: { id: string }
    Querystring: { token?: string }
  }>({
    method: 'GET'
  , url: '/pubsub/:id'
  , schema: {
      params: { id: idSchema }
    , querystring: { token: tokenSchema }
    }
  // Server-Sent Events
  , handler(req, reply) {
      go(async () => {
        const id = req.params.id
        const token = req.query.token

        try {
          await Core.Blacklist.check(id)
          await Core.Whitelist.check(id)
          await Core.TBAC.checkReadPermission(id, token)
        } catch (e) {
          if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
          throw e
        }

        reply.raw.setHeader('Content-Type', 'text/event-stream')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Cache-Control', 'no-store')
        if (req.headers.origin) {
          reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        }
        reply.raw.flushHeaders()

        const unsubscribe = Core.PubSub.subscribe(id, async value => {
          for (const data of sse(value)) {
            // `publish` is non-blocking, so it cannot handle back-pressure.
            if (!reply.raw.write(data)) {
              await waitForEventEmitter(reply.raw, 'drain')
            }
          }
        })

        let heartbeatTimer: NodeJS.Timeout | null = null
        if (SSE_HEARTBEAT_INTERVAL() > 0) {
          heartbeatTimer = setInterval(() => {
            reply.raw.write(
              'event: heartbeat' + '\n'
            + 'data: ' + '\n'
            + '\n'
            )
          }, SSE_HEARTBEAT_INTERVAL())
        }

        req.raw.on('close', () => {
          if (heartbeatTimer) clearInterval(heartbeatTimer)
          unsubscribe()
        })
      })
    }
  // WebSocket
  // @ts-ignore Do not want to waste time to fight the terrible types of fastify.
  , wsHandler(conn, req) {
      // @ts-ignore
      const id = req.params.id

      const unsubscribe = Core.PubSub.subscribe(id, value => conn.socket.send(value))
      conn.socket.on('close', () => unsubscribe())
      conn.socket.on('message', () => conn.socket.close())
    }
  })
}

function getPathname(url: string): string {
  const urlObject = new URL(url, 'http://localhost/')
  return urlObject.pathname
}

function parseQuerystring<T extends NodeJS.Dict<string | string[]>>(url: string): T {
  const urlObject = new URL(url, 'http://localhost/')
  const result = Object.fromEntries(urlObject.searchParams.entries()) as T
  return result
}
