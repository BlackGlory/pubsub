import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from './channel-manager'

export const routes: FastifyPluginAsync  = async function routes(server, options) {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'buffer' }
  , (req, body, done) => {
      done(null, body)
    }
  )

  const manager = new ChannelManager()

  server.get<{ Params: { id: string }}>('/mpmc/:id', async (req, reply) => {
    const value = await manager.take(req.params.id)
    reply.send(value)
  })

  server.post<{ Params: { id: string }}>('/mpmc/:id', async (req, reply) => {
    await manager.put(req.params.id, req.body)
    reply.status(204).send()
  })
}
