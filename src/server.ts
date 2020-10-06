import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as mpmc } from '@service/mpmc'
import { routes as pubsub } from '@service/pubsub'
import { HOST, PORT } from '@src/config'

const server = fastify(({ logger: true }))
server.register(cors, { origin: true })
server.register(mpmc)
server.register(pubsub)
server.listen(PORT, HOST, (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})
