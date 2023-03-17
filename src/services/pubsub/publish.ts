import { FastifyPluginAsync } from 'fastify'
import { IAPI } from '@src/contract.js'
import { JSONValue } from '@blackglory/prelude'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.post<{
    Params: {
      namespace: string
      channel: string
    }
    Body: JSONValue
  }>(
    '/namespaces/:namespace/channels/:channel'
  , {
      schema: {
        params: {
          namespace: { type: 'string' }
        , channel: { type: 'string' }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const channel = req.params.channel
      const content = req.body

      API.publish(namespace, channel, content)

      return reply
        .status(204)
        .send()
    }
  )
}
