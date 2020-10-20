import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import {
  LIST_BASED_ACCESS_CONTROL
, RBAC
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
} from '@config'
import DAO from '@dao'
import type { PubSub } from '@src/core/pubsub'
import websocket from 'fastify-websocket'

export const routes: FastifyPluginAsync<{
  pubsub: PubSub<string>
}> = async function routes(server, { pubsub }) {
  server.register(websocket)
  server.route<{
    Params: { id: string }
    Querystring: { token?: string }
  }>({
    method: 'GET'
  , url: '/pubsub/:id'
  , schema: {
      params: { id: idSchema }
    , querystring: { token: tokenSchema }
    , response: {
        200: { type: 'null' }
      }
    }
  // Server-Sent Events
  , handler(req, reply) {
      ;(async () => {
        const id = req.params.id
        const token = req.query.token

        if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
          if (await DAO.inBlacklist(id)) return reply.status(403).send()
        } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
          if (!await DAO.inWhitelist(id)) return reply.status(403).send()
        }

        if (TOKEN_BASED_ACCESS_CONTROL()) {
          if (await DAO.hasDequeueTokens(id)) {
            if (token) {
              if (!await DAO.matchDequeueToken({ token, id })) return reply.status(401).send()
            } else {
              return reply.status(401).send()
            }
          } else {
            if (DISABLE_NO_TOKENS()) {
              if (!await DAO.hasEnqueueTokens(id)) return reply.status(403).send()
            }
          }
        }

        reply.raw.setHeader('Content-Type','text/event-stream')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Cache-Control', 'no-store')
        if (req.headers.origin) {
          reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        }
        reply.raw.flushHeaders()

        const observable = pubsub.observe(req.params.id)
        const subscription = observable.subscribe(value => {
          reply.raw.write(`data: ${value}\n\n`)
        })
        req.raw.on('close', () => subscription.unsubscribe())

      })()
    }
  // WebSocket
  // @ts-ignore Do not want to waste time to fight the terrible types of fastify.
  , wsHandler(conn, req, params: Params) {
      const id = params.id

      const observable = pubsub.observe(id)
      const subscription = observable.subscribe(value => conn.socket.send(value))

      conn.socket.on('close', () => subscription.unsubscribe())
      conn.socket.on('message', () => conn.socket.close())
    }
  })
}
