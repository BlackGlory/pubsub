import { FastifyPluginAsync } from 'fastify'
import { PubSub } from './pubsub'
import websocket from 'fastify-websocket'
import urlencodedParser from '@src/urlencoded-parser'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(urlencodedParser, { parseAs: 'string' })
  server.register(websocket)

  const pubsub = new PubSub<string>()

  type Params = { id: string }

  server.route<{ Params: Params }>({
    method: 'GET'
  , url: '/pubsub/:id'
  // Server-Sent Events
  , handler(req, reply) {
      reply.raw.setHeader('Content-Type','text/event-stream')
      reply.raw.setHeader('Connection', 'keep-alive')
      reply.raw.setHeader('Cache-Control', 'no-store')
      if (req.headers.origin) {
        reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      }

      const observable = pubsub.observe(req.params.id)
      const subscription = observable.subscribe(value => {
        reply.raw.write(`data: ${value}\n\n`)
      })
      req.raw.on('close', () => subscription.unsubscribe())
    }
  // WebSocket
  // @ts-ignore Do not want to waste time to fight the terrible types of fastify.
  , wsHandler(conn, req, params: Params) {
      const id = params.id

      const observable = pubsub.observe(id)
      const subscription = observable.subscribe(value => conn.socket.send(value))

      conn.socket.on('close', () => subscription.unsubscribe())
      conn.socket.on('message', async message => {
        await pubsub.publish(id, message.toString())
      })
    }
  })

  server.post<{
    Params: { id: string }
  , Body: string
  }>('/pubsub/:id', async (req, reply) => {
    await pubsub.publish(req.params.id, req.body)
    reply.status(204).send()
  })
}
