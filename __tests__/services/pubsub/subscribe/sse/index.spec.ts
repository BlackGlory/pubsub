import { startService, stopService, getAddress } from '@test/utils'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'

    const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
    await waitForEventTarget(es as EventTarget, 'open')
    es.close()
  })
})
