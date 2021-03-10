import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('open', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        await AccessControlDAO.addWhitelistItem(id)
        const server = getServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'open')
        } finally {
          await server.close()
        }
      })
    })

    describe('id not in whitelist', () => {
      it('error', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = getServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'error')
        } finally {
          await server.close()
        }
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('open', async () => {
        const id = 'id'
        const server = getServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'open')
        } finally {
          await server.close()
        }
      })
    })
  })
})
