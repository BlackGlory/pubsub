import * as hapi from '@hapi/hapi'
import { HOST, PORT } from '@src/config'
import { makeChannel } from 'extra-promise'

const [send, receive, close] = makeChannel<Buffer>()
const iter = receive()[Symbol.asyncIterator]()

;(async () => {
  const server = hapi.server({
    port: PORT
  , host: HOST
  })

  server.route({
    method: 'GET'
  , path: '/'
  , async handler(req, h) {
      return (await iter.next()).value
    }
  })

  server.route({
    method: 'POST'
  , path: '/'
  , options: {
      payload: {
        parse: false
      }
    , response: {
        emptyStatusCode: 204
      }
    }
  , async handler(req, h) {
      await send(req.payload as Buffer)
      return h.continue
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
})()
