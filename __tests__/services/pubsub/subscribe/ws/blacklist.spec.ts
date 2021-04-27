import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('blackllist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('error', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        await AccessControlDAO.addBlacklistItem(namespace)

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'error')
      })
    })

    describe('namespace not in blacklist', () => {
      it('open', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'open')
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('open', async () => {
        const namespace = 'namespace'
        await AccessControlDAO.addBlacklistItem(namespace)

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'open')
      })
    })
  })
})
