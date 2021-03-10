import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('200', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        await AccessControlDAO.addWhitelistItem(id)
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

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = getServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/pubsub/${id}`
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('200', async () => {
        const id = 'id'
        await AccessControlDAO.addWhitelistItem(id)
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
  })
})
