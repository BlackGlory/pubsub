import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'
import { JSONValue } from '@blackglory/prelude'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get(
    '/pubsub-with-json-schema'
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
      const result = api.JSONSchema.getAllNamespaces()
      return reply.send(result)
    }
  )

  server.get<{ Params: { namespace: string }}>(
    '/pubsub/:namespace/json-schema'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: { type: 'string' }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = api.JSONSchema.get(namespace)
      if (result) {
        return reply
          .header('content-type', 'application/json')
          .send(result)
      } else {
        return reply
          .status(404)
          .send()
      }
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: JSONValue
  }>(
    '/pubsub/:namespace/json-schema'
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
      const schema = req.body
      api.JSONSchema.set(namespace, schema)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{ Params: { namespace: string }}>(
    '/pubsub/:namespace/json-schema'
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
      api.JSONSchema.remove(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
