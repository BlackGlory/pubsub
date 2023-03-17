import { startService, stopService, getAddress } from '@test/utils.js'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'
import { publish } from '@apis/publish.js'

beforeEach(startService)
afterEach(stopService)

test('subscribe', async () => {
  const namespace = 'namespace'
  const channel = 'channel'

  const es = new EventSource(`${getAddress()}/namespaces/${namespace}/channels/${channel}`)
  try {
    await waitForEventTarget(es, 'open')
    queueMicrotask(() => {
      publish(namespace, channel, 'content')
    })
    const event = await waitForEventTarget(es, 'message') as MessageEvent
    expect(event.data).toBe(JSON.stringify('content'))
  } finally {
    es.close()
  }
})
