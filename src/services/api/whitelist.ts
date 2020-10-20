import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'
import DAO from '@dao'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.get(
    '/whitelist'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
    const result = await DAO.getAllWhitelistItems()
    reply.send(result)
  })

  server.put<{ Params: { id: string }}>(
    '/whitelist/:id'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      await DAO.addWhitelistItem(req.params.id)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { id: string }}>(
    '/whitelist/:id'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
    await DAO.removeWhitelistItem(req.params.id)
    reply.status(204).send()
  })
}
