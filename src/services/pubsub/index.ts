import { FastifyPluginAsync } from 'fastify'
import { PubSub } from '@src/core/pubsub'
import { routes as publishRoutes } from './publish'
import { routes as subscribeRoutes } from './subscribe'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  const pubsub = new PubSub<string>()

  server.register(publishRoutes, { pubsub })
  server.register(subscribeRoutes, { pubsub })
}
