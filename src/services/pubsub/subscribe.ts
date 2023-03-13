import { go } from '@blackglory/prelude'
import { FastifyPluginAsync } from 'fastify'
import { sse } from 'extra-generator'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { SSE_HEARTBEAT_INTERVAL } from '@env/index.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.get<{
    Params: {
      namespace: string
      channel: string
    }
  }>(
    '/namespaces/:namespace/channels/:channel'
  , {
      schema: {
        params: {
          namespace: { type: 'string' }
        , channel: { type: 'string' }
        }
      }
    }
    // Server-Sent Events handler
  , (req, reply) => {
      const namespace = req.params.namespace
      const channel = req.params.channel

      reply.raw.setHeader('Content-Type', 'text/event-stream')
      reply.raw.setHeader('Connection', 'keep-alive')
      reply.raw.setHeader('Cache-Control', 'no-store')
      if (req.headers.origin) {
        reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      }
      reply.raw.flushHeaders()

      const unsubscribe = API.subscribe(namespace, channel, data => {
        // eslint-disable-next-line
        go(async () => {
          for (const line of sse({ data })) {
            // `publish` is non-blocking, so it cannot handle back-pressure.
            if (!reply.raw.write(line)) {
              await waitForEventEmitter(reply.raw, 'drain')
            }
          }
        })
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
    }
  )
}
