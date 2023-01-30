import { FastifyPluginAsync } from 'fastify'
import { routes as publishRoutes } from './publish.js'
import { routes as subscribeRoutes } from './subscribe.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(publishRoutes, { Core })
  server.register(subscribeRoutes, { Core })
}
