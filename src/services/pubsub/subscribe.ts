import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import {
  LIST_BASED_ACCESS_CONTROL
, ListBasedAccessControl
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
} from '@env'
import websocket from 'fastify-websocket'

export const routes: FastifyPluginAsync<{
  PubSub: IPubSub<string>
  DAO: IDataAccessObject
}> = async function routes(server, { PubSub, DAO }) {
  server.register(websocket, {
    options: {
      // pain, see https://github.com/fastify/fastify-websocket/issues/70
      async verifyClient(info, next) {
        const noTokenRegExp = /^\/pubsub\/(?<id>[a-zA-Z0-9\.\-_]{1,256})$/
        const tokenRegExp = /^\/pubsub\/(?<id>[a-zA-Z0-9\.\-_]{1,256})\?token=(?<token>[a-zA-Z0-9\.\-\_]{1,256})$/

        const url = info.req.url!
        const noTokenResult = url.match(noTokenRegExp)
        let id: string | undefined
        let token: string | undefined
        if (noTokenResult) {
          id = noTokenResult.groups!.id
        } else {
          const tokenResult = url.match(tokenRegExp)
          if (tokenResult) {
            id = tokenResult.groups!.id
            token = tokenResult.groups!.token
          }
        }

        if (id) {
          if (LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Blacklist) {
            if (await DAO.inBlacklist(id)) return next(false)
          } else if (LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Whitelist) {
            if (!await DAO.inWhitelist(id)) return next(false)
          }

          if (TOKEN_BASED_ACCESS_CONTROL()) {
            if (await DAO.hasReadTokens(id)) {
              if (token) {
                if (!await DAO.matchReadToken({ token, id })) return next(false)
              } else {
                return next(false)
              }
            } else {
              if (DISABLE_NO_TOKENS()) {
                if (!await DAO.hasWriteTokens(id)) return next(false)
              }
            }
          }

          return next(true)
        }

        next(false)
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
    , response: {
        200: { type: 'null' }
      }
    }
  // Server-Sent Events
  , handler(req, reply) {
      ;(async () => {
        const id = req.params.id
        const token = req.query.token

        if (LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Blacklist) {
          if (await DAO.inBlacklist(id)) return reply.status(403).send()
        } else if (LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Whitelist) {
          if (!await DAO.inWhitelist(id)) return reply.status(403).send()
        }

        if (TOKEN_BASED_ACCESS_CONTROL()) {
          if (await DAO.hasReadTokens(id)) {
            if (token) {
              if (!await DAO.matchReadToken({ token, id })) return reply.status(401).send()
            } else {
              return reply.status(401).send()
            }
          } else {
            if (DISABLE_NO_TOKENS()) {
              if (!await DAO.hasWriteTokens(id)) return reply.status(403).send()
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

        const unsubscribe = PubSub.subscribe(id, value => {
          reply.raw.write(`data: ${value}\n\n`)
        })

        req.raw.on('close', () => unsubscribe())
      })()
    }
  // WebSocket
  // @ts-ignore Do not want to waste time to fight the terrible types of fastify.
  , wsHandler(conn, req, params: Params) {
      const id = params.id

      const unsubscribe = PubSub.subscribe(id, value => conn.socket.send(value))

      conn.socket.on('close', () => unsubscribe())
      conn.socket.on('message', () => conn.socket.close())
    }
  })
}
