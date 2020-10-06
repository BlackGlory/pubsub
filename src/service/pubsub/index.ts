import { FastifyPluginAsync } from 'fastify'
import { PubSub } from './pubsub'

export const routes: FastifyPluginAsync  = async function routes(server, options) {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'string' }
  , (req, body, done) => {
      done(null, body)
    }
  )

  const pubsub = new PubSub<string>()

  server.get<{ Params: { id: string }}>('/pubsub/:id', (req, reply) => {
    reply.raw.setHeader('Content-Type','text/event-stream')
    reply.raw.setHeader('Connection', 'keep-alive')
    reply.raw.setHeader('Cache-Control', 'no-store')
    reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin || '')
    const observable = pubsub.observe(req.params.id)
    const subscription = observable.subscribe(value => {
      reply.raw.write(`data: ${value}\n\n`)
    })
    req.raw.on('close', () => subscription.unsubscribe())
  })

  server.post<{ Params: { id: string }}>('/pubsub/:id', async (req, reply) => {
    await pubsub.publish(req.params.id, req.body as string)
    reply.status(204).send()
  })
}
