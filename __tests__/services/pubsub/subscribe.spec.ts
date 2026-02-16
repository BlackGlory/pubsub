import { test, beforeEach, afterEach, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { fetchEvents } from 'extra-sse'
import { firstAsync } from 'iterable-operator'
import { publish } from '@apis/publish.js'
import { delay } from 'extra-promise'

beforeEach(startService)
afterEach(stopService)

test('subscribe', async () => {
  const namespace = 'namespace'
  const channel = 'channel'

  const iter = fetchEvents(`${getAddress()}/namespaces/${namespace}/channels/${channel}`, {
    autoReconnect: false
  })
  const promise = firstAsync(iter)
  await delay(500)
  publish(namespace, channel, 'content')
  const result = await promise

  expect(result).toStrictEqual({
    comment: undefined
  , event: undefined
  , data: JSON.stringify('content')
  , id: undefined
  , retry: undefined
  })
})
