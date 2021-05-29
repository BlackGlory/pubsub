import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket from 'ws'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('open', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        await AccessControlDAO.addWhitelistItem(namespace)

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'open')
      })
    })

    describe('namespace not in whitelist', () => {
      it('error', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'error')
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('open', async () => {
        const namespace = 'namespace'

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'open')
      })
    })
  })
})
