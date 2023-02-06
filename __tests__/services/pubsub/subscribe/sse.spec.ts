import { startService, stopService, getAddress } from '@test/utils.js'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

test('subscribe', async () => {
  const namespace = 'namespace'
  const channel = 'channel'

  const es = new EventSource(`${getAddress()}/namespaces/${namespace}/channels/${channel}`)
  await waitForEventTarget(es as EventTarget, 'open')
  es.close()
})
