import { startService, stopService, getAddress } from '@test/utils.js'
import WebSocket from 'ws'
import { waitForEventTarget } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

test('subscribe', async () => {
  const channel = 'channel'

  const ws = new WebSocket(`${getAddress()}/pubsub/${channel}`.replace('http', 'ws'))
  await waitForEventTarget(ws as unknown as EventTarget, 'open')
})
