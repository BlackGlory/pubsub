import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync = async server => {
  server.get('/health', (req, reply) => {
    reply.send('OK')
  })
}
