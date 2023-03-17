import { go, pass } from '@blackglory/prelude'
import { FastifyPluginAsync } from 'fastify'
import { sse } from 'extra-generator'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { SSE_HEARTBEAT_INTERVAL } from '@env/index.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import { IAPI } from '@src/contract.js'
import { SyncDestructor } from 'extra-defer'
import { AbortController } from 'extra-abort'

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

      const destructor = new SyncDestructor()
      const controller = new AbortController()
      const signal = controller.signal
      req.raw.on('close', () => {
        controller.abort()
        destructor.execute()
      })

      reply.raw.setHeader('Content-Type', 'text/event-stream')
      reply.raw.setHeader('Connection', 'keep-alive')
      reply.raw.setHeader('Cache-Control', 'no-store')
      if (req.headers.origin) {
        reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      }
      reply.raw.flushHeaders()

      const cancelHeartbeatTimer: (() => void) | undefined = go(() => {
        const heartbeatInterval = SSE_HEARTBEAT_INTERVAL()
        if (heartbeatInterval > 0) {
          return setDynamicTimeoutLoop(heartbeatInterval, async () => {
            for (const line of sse({ event: 'heartbeat', data: '' })) {
              if (signal.aborted) break

              if (!reply.raw.write(line)) {
                await waitForEventEmitter(reply.raw, 'drain', signal)
              }
            }
          })
        }
      })
      if (cancelHeartbeatTimer) {
        destructor.defer(cancelHeartbeatTimer)
      }

      if (signal.aborted) return

      const subscription = API
        .observe(namespace, channel)
        .subscribe({
          async next(content) {
            const data = JSON.stringify(content)
            for (const line of sse({ data })) {
              if (signal.aborted) break

              // `publish` is non-blocking, so it cannot handle back-pressure.
              if (!reply.raw.write(line)) {
                await waitForEventEmitter(reply.raw, 'drain', signal)
              }
            }
          }
        })
      destructor.defer(() => subscription.unsubscribe())
    }
  )
}
