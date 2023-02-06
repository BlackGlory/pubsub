import { FastifyPluginAsync } from 'fastify'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  // overwrite application/json parser
  server.addContentTypeParser(
    'application/json'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.addContentTypeParser(
    '*'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.post<{
    Params: {
      namespace: string
      channel: string
    }
    Body: string
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
      const payload = req.body

      API.publish(namespace, channel, payload)
      return reply
        .status(204)
        .send()
    }
  )
}
