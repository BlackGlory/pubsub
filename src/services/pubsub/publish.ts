import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'
import { JSON_PAYLOAD_ONLY, PUBLISH_PAYLOAD_LIMIT } from '@env/index.js'
import { CustomError } from '@blackglory/errors'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
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
    Params: { namespace: string }
    Querystring: { token?: string }
    Body: string
  }>(
    '/pubsub/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      , headers: {
          'content-type':
            JSON_PAYLOAD_ONLY()
            ? { type: 'string', pattern: '^application/json' }
            : { type: 'string' }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: PUBLISH_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const payload = req.body
      const token = req.query.token

      try {
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkWritePermission(namespace, token)
        if (Core.JsonSchema.isEnabled()) {
          if (isJSONPayload()) {
            await Core.JsonSchema.validate(namespace, payload)
          } else {
            if (await Core.JsonSchema.get(namespace)) {
              throw new BadContentType('application/json')
            }
          }
        }
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.JsonSchema.InvalidPayload) return reply.status(400).send()
        if (e instanceof BadContentType) return reply.status(415).send()
        throw e
      }

      Core.PubSub.publish(namespace, payload)
      return reply
        .status(204)
        .send()

      function isJSONPayload(): boolean {
        const contentType = req.headers['content-type']
        if (!contentType) return false
        return contentType
          .toLowerCase()
          .startsWith('application/json')
      }
    }
  )
}

class BadContentType extends CustomError {
  constructor(contentType: string) {
    super(`Content-Type must be ${contentType}`)
  }
}
