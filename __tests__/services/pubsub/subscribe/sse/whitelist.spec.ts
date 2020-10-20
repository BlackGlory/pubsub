import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import DAO from '@dao'
import EventSource = require('eventsource')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('200', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      await DAO.addWhitelistItem(id)
      const server = buildServer()
      const address = await server.listen(0)

      try {
        const es = new EventSource(`${address}/pubsub/${id}`)
        await waitForEvent(es as EventTarget, 'open')
        es.close()
      } finally {
        await server.close()
      }
    })
  })

  describe('id not in whitelist', () => {
    it('403', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      const server = buildServer()

      const res = await server.inject({
        method: 'GET'
      , url: `/pubsub/${id}`
      })

      expect(res.statusCode).toBe(403)
    })
  })
})
