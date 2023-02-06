import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, text } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

test('publish', async () => {
  const namespace = 'namespace'
  const message = 'message'

  const res = await fetch(post(
    url(getAddress())
  , pathname(`/pubsub/${namespace}`)
  , text(message)
  ))

  expect(res.status).toBe(204)
})
