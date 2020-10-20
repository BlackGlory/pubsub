import { FastifyPluginAsync } from 'fastify'
import { routes as publishRoutes } from './publish'
import { routes as subscribeRoutes } from './subscribe'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject, PubSub: IPubSub<string> }> = async function routes(server, { DAO, PubSub }) {
  server.register(publishRoutes, { PubSub, DAO })
  server.register(subscribeRoutes, { PubSub, DAO })
}
