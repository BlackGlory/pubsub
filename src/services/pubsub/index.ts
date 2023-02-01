import { FastifyPluginAsync } from 'fastify'
import { routes as publishRoutes } from './publish.js'
import { routes as subscribeRoutes } from './subscribe.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api : IAPI }> = async (server, { api }) => {
  await server.register(publishRoutes, { api })
  await server.register(subscribeRoutes, { api })
}
