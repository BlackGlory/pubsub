import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const id = 'id'

    const es = new EventSource(`${getAddress()}/pubsub/${id}`)
    await waitForEventTarget(es as EventTarget, 'open')
    es.close()
  })
})
