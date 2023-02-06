import { startService, stopService, getAddress } from '@test/utils.js'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

test('subscribe', async () => {
  const namespace = 'namespace'

  const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
  await waitForEventTarget(es as EventTarget, 'open')
  es.close()
})
