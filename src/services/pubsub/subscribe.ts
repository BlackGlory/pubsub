import * as http from 'http'
import * as net from 'net'
import { go } from '@blackglory/prelude'
import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'
import { sse } from 'extra-generator'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { SSE_HEARTBEAT_INTERVAL, WS_HEARTBEAT_INTERVAL } from '@env/index.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import { WebSocket, WebSocketServer, createWebSocketStream } from 'ws'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  const wss = new WebSocketServer({ noServer: true })

  // WebSocket handler
  wss.on('connection', (
    ws: WebSocket
  , req: http.IncomingMessage
  , params: { namespace: string }
  ) => {
    const unsubscribe = api.PubSub.subscribe(
      params.namespace
    , value => ws.send(value)
    )

    let cancelHeartbeatTimer: (() => void) | null = null
    if (WS_HEARTBEAT_INTERVAL() > 0) {
      cancelHeartbeatTimer = setDynamicTimeoutLoop(WS_HEARTBEAT_INTERVAL(), () => {
        ws.ping()
      })
    }

    ws.on('close', () => {
      if (cancelHeartbeatTimer) {
        cancelHeartbeatTimer()
      }
      unsubscribe()
    })
    ws.on('message', message => {
      if (message.toString() !== '') {
        ws.close()
      }
    })
  })

  // WebSocket upgrade handler
  server.server.on('upgrade', async (
    req: http.IncomingMessage
  , socket: net.Socket
  , head: Buffer
  ) => {
    const url = req.url!
    const pathnameRegExp = /^\/pubsub\/(?<namespace>[a-zA-Z0-9\.\-_]{1,256})$/
    const result = getPathname(url).match(pathnameRegExp)
    if (!result) {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      return socket.destroy()
    }

    const namespace = result.groups!.namespace
    const token = parseQuerystring<{ token?: string }>(url).token

    try {
      await api.Blacklist.check(namespace)
      await api.Whitelist.check(namespace)
      await api.TBAC.checkReadPermission(namespace, token)
    } catch (e) {
      if (e instanceof api.Blacklist.Forbidden) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      }
      if (e instanceof api.Whitelist.Forbidden) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      }
      if (e instanceof api.TBAC.Unauthorized) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      }
      return socket.destroy()
    }

    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req, { namespace })

      const connection = createWebSocketStream(ws, { encoding: 'utf8' })
      ws.on('newListener', event => {
        if (event === 'message') {
          connection.resume()
        }
      })

      const GOING_AWAY = 1001
      ws.close(GOING_AWAY)
    })
  })

  server.get<{
    Params: { namespace: string }
    Querystring: { token?: string }
  }>(
    '/pubsub/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      }
    }
    // Server-Sent Events handler
  , (req, reply) => {
      go(async () => {
        const namespace = req.params.namespace
        const token = req.query.token

        try {
          api.Blacklist.check(namespace)
          api.Whitelist.check(namespace)
          api.TBAC.checkReadPermission(namespace, token)
        } catch (e) {
          if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
          if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
          if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
          throw e
        }

        reply.raw.setHeader('Content-Type', 'text/event-stream')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Cache-Control', 'no-store')
        if (req.headers.origin) {
          reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        }
        reply.raw.flushHeaders()

        const unsubscribe = api.PubSub.subscribe(namespace, async data => {
          for (const line of sse({ data })) {
            // `publish` is non-blocking, so it cannot handle back-pressure.
            if (!reply.raw.write(line)) {
              await waitForEventEmitter(reply.raw, 'drain')
            }
          }
        })

        let cancelHeartbeatTimer: (() => void) | null = null
        if (SSE_HEARTBEAT_INTERVAL() > 0) {
          cancelHeartbeatTimer = setDynamicTimeoutLoop(
            SSE_HEARTBEAT_INTERVAL()
          , async () => {
              for (const line of sse({ event: 'heartbeat', data: '' })) {
                if (!reply.raw.write(line)) {
                  await waitForEventEmitter(reply.raw, 'drain')
                }
              }
            }
          )
        }

        req.raw.on('close', () => {
          if (cancelHeartbeatTimer) {
            cancelHeartbeatTimer()
          }
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
