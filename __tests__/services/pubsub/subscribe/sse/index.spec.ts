import { startService, stopService, getServer } from '@test/utils'
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
    const server = getServer()
    const address = await server.listen(0)

    try {
      const es = new EventSource(`${address}/pubsub/${id}`)
      await waitForEventTarget(es as EventTarget, 'open')
      es.close()
    } finally {
      await server.close()
    }
  })
})
