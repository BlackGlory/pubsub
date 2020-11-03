import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import websocket from 'fastify-websocket'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(websocket, {
    options: {
      // pain, see https://github.com/fastify/fastify-websocket/issues/70
      async verifyClient(info, next) {
        const url = info.req.url!
        const pathnameRegExp = /^\/pubsub\/(?<id>[a-zA-Z0-9\.\-_]{1,256})$/
        const result = getPathname(url).match(pathnameRegExp)
        if (!result) return next(false)

        const id = result.groups!.id
        const token = parseQuerystring<{ token?: string }>(url).token

        try {
          await Core.Blacklist.check(id)
          await Core.Whitelist.check(id)
          await Core.TBAC.checkReadPermission(id, token)
        } catch {
          return next(false)
        }
        return next(true)
      }
    }
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
      ;(async () => {
        const id = req.params.id
        const token = req.query.token

        try {
          await Core.Blacklist.check(id)
          await Core.Whitelist.check(id)
          await Core.TBAC.checkReadPermission(id, token)
        } catch (e) {
          if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
          if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
          if (e instanceof Error) return reply.status(400).send(e.message)
          throw e
        }

        reply.raw.setHeader('Content-Type', 'text/event-stream')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Cache-Control', 'no-store')
        if (req.headers.origin) {
          reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        }
        reply.raw.flushHeaders()

        const unsubscribe = Core.PubSub.subscribe(id, value => reply.raw.write(`data: ${value}\n\n`))
        req.raw.on('close', () => unsubscribe())
      })()
    }
  // WebSocket
  // @ts-ignore Do not want to waste time to fight the terrible types of fastify.
  , wsHandler(conn, req, params: Params) {
      const id = params.id

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
