import { startService, stopService, getAddress } from '@test/utils'
import WebSocket from 'ws'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('open', async () => {
    const namespace = 'namespace'

    const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
    await waitForEventTarget(ws as unknown as EventTarget, 'open')
  })
})
