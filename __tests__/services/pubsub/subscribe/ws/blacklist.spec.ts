import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import WebSocket from 'ws'
import { waitForEventTarget } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

describe('blackllist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('error', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)

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
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)

        const ws = new WebSocket(`${getAddress()}/pubsub/${namespace}`.replace('http', 'ws'))
        await waitForEventTarget(ws as unknown as EventTarget, 'open')
      })
    })
  })
})
