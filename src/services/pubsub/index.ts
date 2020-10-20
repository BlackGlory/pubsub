import { FastifyPluginAsync } from 'fastify'
import { PubSub } from '@src/core/pubsub'
import { routes as publishRoutes } from './publish'
import { routes as subscribeRoutes } from './subscribe'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject}> = async function routes(server, { DAO }) {
  const pubsub = new PubSub<string>()

  server.register(publishRoutes, { pubsub, DAO })
  server.register(subscribeRoutes, { pubsub, DAO })
}
