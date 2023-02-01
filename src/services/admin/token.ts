import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  // get all namespaces
  server.get<{ Params: { namespace: string }}>(
    '/pubsub-with-tokens'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = api.TBAC.Token.getAllNamespaces()
      return reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { namespace: string }
  }>(
    '/pubsub/:namespace/tokens'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                token: tokenSchema
              , write: { type: 'boolean' }
              , read: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = api.TBAC.Token.getAll(namespace)
      return reply.send(result)
    }
  )

  // write token
  server.put<{
    Params: { token: string, namespace: string }
  }>(
    '/pubsub/:namespace/tokens/:token/write'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      api.TBAC.Token.setWriteToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { token: string, namespace: string }
  }>(
    '/pubsub/:namespace/tokens/:token/write'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      api.TBAC.Token.unsetWriteToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  // read token
  server.put<{
    Params: { token: string, namespace: string }
  }>(
    '/pubsub/:namespace/tokens/:token/read'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      api.TBAC.Token.setReadToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { token: string, namespace: string }
  }>(
    '/pubsub/:namespace/tokens/:token/read'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      api.TBAC.Token.unsetReadToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )
}
