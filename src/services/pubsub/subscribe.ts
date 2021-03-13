import * as http from 'http'
import * as net from 'net'
import { go } from '@blackglory/go'
import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { sse } from 'extra-generator'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { SSE_HEARTBEAT_INTERVAL } from '@env'
import { setDynamicTimeoutLoop } from 'extra-timers'
import WebSocket = require('ws')

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  const wss = new WebSocket.Server({ noServer: true })

  // WebSocket handler
  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage, params: { id: string }) => {
    const unsubscribe = Core.PubSub.subscribe(params.id, value => ws.send(value))
    ws.on('close', () => unsubscribe())
    ws.on('message', () => ws.close())
  })

  // WebSocket upgrade handler
  server.server.on('upgrade', async (req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    const url = req.url!
    const pathnameRegExp = /^\/pubsub\/(?<id>[a-zA-Z0-9\.\-_]{1,256})$/
    const result = getPathname(url).match(pathnameRegExp)
    if (!result) {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      return socket.destroy()
    }

    const id = result.groups!.id
    const token = parseQuerystring<{ token?: string }>(url).token

    try {
      await Core.Blacklist.check(id)
      await Core.Whitelist.check(id)
      await Core.TBAC.checkReadPermission(id, token)
    } catch (e) {
      if (e instanceof Core.Blacklist.Forbidden) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      }
      if (e instanceof Core.Whitelist.Forbidden) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      }
      if (e instanceof Core.TBAC.Unauthorized) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      }
      return socket.destroy()
    }

    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req, { id })

      // Why need stream?
      const connection = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' })
      ws.on('newListener', event => {
        if (event === 'message') connection.resume()
      })

      const GOING_AWAY = 1001
      // Why need close?
      ws.close(GOING_AWAY)
    })
  })

  server.get<{
    Params: { id: string }
    Querystring: { token?: string }
  }>(
    '/pubsub/:id'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      }
    }
    // Server-Sent Events handler
  , (req, reply) => {
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

        const unsubscribe = Core.PubSub.subscribe(id, async data => {
          for (const line of sse({ data })) {
            // `publish` is non-blocking, so it cannot handle back-pressure.
            if (!reply.raw.write(line)) {
              await waitForEventEmitter(reply.raw, 'drain')
            }
          }
        })

        let cancelHeartbeatTimer: (() => void) | null = null
        const heartbeatInterval = SSE_HEARTBEAT_INTERVAL()
        if (SSE_HEARTBEAT_INTERVAL() > 0) {
          cancelHeartbeatTimer = setDynamicTimeoutLoop(heartbeatInterval, async () => {
            for (const line of sse({ event: 'heartbeat', data: '' })) {
              if (!reply.raw.write(line)) {
                await waitForEventEmitter(reply.raw, 'drain')
              }
            }
          })
        }

        req.raw.on('close', () => {
          if (cancelHeartbeatTimer) cancelHeartbeatTimer()
          unsubscribe()
        })
      })
    }
  )
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
