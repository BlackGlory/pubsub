import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get(
    '/pubsub-with-token-policies'
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
      const result = api.TBAC.TokenPolicy.getAllNamespaces()
      return reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/pubsub/:namespace/token-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            type: 'object'
          , properties: {
              writeTokenRequired: { type: 'boolean', nullable: true }
            , readTokenRequired: { type: 'boolean', nullable: true }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = api.TBAC.TokenPolicy.get(namespace)
      return reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
  , Body: boolean
  }>(
    '/pubsub/:namespace/token-policies/write-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      api.TBAC.TokenPolicy.setWriteTokenRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string}
  }>(
    '/pubsub/:namespace/token-policies/write-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      api.TBAC.TokenPolicy.unsetWriteTokenRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.put<{
    Params: { namespace: string }
  , Body: boolean
  }>(
    '/pubsub/:namespace/token-policies/read-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      api.TBAC.TokenPolicy.setReadTokenRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string}
  }>(
    '/pubsub/:namespace/token-policies/read-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      api.TBAC.TokenPolicy.unsetReadTokenRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
