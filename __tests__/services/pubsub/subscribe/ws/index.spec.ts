import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import WebSocket = require('ws')
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('open', async () => {
    const id = 'id'

    const ws = new WebSocket(`${getAddress()}/pubsub/${id}`.replace('http', 'ws'))
    await waitForEventTarget(ws as unknown as EventTarget, 'open')
  })
})
