import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject }> = async function routes(server, { DAO }) {
  // get all ids
  server.get<{ Params: { id: string }}>(
    '/pubsub-with-tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await DAO.getAllIdsWithTokens()
      reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { id: string }
  }>(
    '/pubsub/:id/tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                token: tokenSchema
              , publish: { type: 'boolean' }
              , subscribe: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await DAO.getAllTokens(req.params.id)
      reply.send(result)
    }
  )

  // publish token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/pubsub/:id/tokens/:token/publish'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      await DAO.setPublishToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/pubsub/:id/tokens/:token/publish'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      await DAO.unsetPublishToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  // subscribe token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/pubsub/:id/tokens/:token/subscribe'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      await DAO.setSubscribeToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/pubsub/:id/tokens/:token/subscribe'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      await DAO.unsetSubscribeToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )
}
