import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as pubsub } from '@services/pubsub'
import { routes as api } from '@services/api'
import { HTTP2, PAYLOAD_LIMIT } from '@config'
import { DAO } from '@dao'
import { createPubSub } from '@core'

export async function buildServer({ logger = false }: Partial<{ logger: boolean }> = {}) {
  const server = fastify(({
    logger
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  , bodyLimit: PAYLOAD_LIMIT()
  }))
  server.register(cors, { origin: true })
  server.register(pubsub, { DAO, PubSub: await createPubSub<string>() })
  server.register(api, { DAO })
  return server
}
