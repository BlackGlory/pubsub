import { FastifyPluginAsync } from 'fastify'
import { routes as publishRoutes } from './publish'
import { routes as subscribeRoutes } from './subscribe'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(publishRoutes, { Core })
  server.register(subscribeRoutes, { Core })
}
