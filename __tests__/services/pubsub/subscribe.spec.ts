import { startService, stopService, getAddress } from '@test/utils.js'
import { fetchEvents } from 'extra-sse'
import { firstAsync } from 'iterable-operator'
import { publish } from '@apis/publish.js'

beforeEach(startService)
afterEach(stopService)

test('subscribe', async () => {
  const namespace = 'namespace'
  const channel = 'channel'

  const iter = fetchEvents(`${getAddress()}/namespaces/${namespace}/channels/${channel}`)
  setTimeout(() => publish(namespace, channel, 'content'), 500)
  const result = await firstAsync(iter)

  expect(result).toStrictEqual({
    comment: undefined
  , event: undefined
  , data: JSON.stringify('content')
  , id: undefined
  , retry: undefined
  })
})
