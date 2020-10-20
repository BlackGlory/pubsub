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

describe('blackllist', () => {
  describe('id in blacklist', () => {
    it('403', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
      const id = 'id'
      const server = buildServer()
      await DAO.addBlacklistItem(id)

      const res = await server.inject({
        method: 'GET'
      , url: `/pubsub/${id}`
      })

      expect(res.statusCode).toBe(403)
    })
  })

  describe('id not in blacklist', () => {
    it('200', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
      const id = 'id'
      const server = buildServer()
      const address = await server.listen(0)

      try {
        const es = new EventSource(`${address}/pubsub/${id}`)
        await waitForEvent(es as EventTarget, 'open')
      } finally {
        await server.close()
      }
    })
  })
})
