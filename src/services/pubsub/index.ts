import { FastifyPluginAsync } from 'fastify'
import { routes as publishRoutes } from './publish.js'
import { routes as subscribeRoutes } from './subscribe.js'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  await server.register(publishRoutes, { API })
  await server.register(subscribeRoutes, { API })
}
