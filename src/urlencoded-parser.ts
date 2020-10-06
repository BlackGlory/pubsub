import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

export interface UrlencodedParserOptions {
  parseAs: 'buffer' | 'string'
}

const urlencodedParser: FastifyPluginCallback<UrlencodedParserOptions> = (fastify, options, done) => {
  fastify.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: options.parseAs }
  , (req, body, done) => {
      done(null, body)
    }
  )

  done()
}

export default fp(urlencodedParser, { name: 'urlencoded-parser', fastify: '3.x' })
