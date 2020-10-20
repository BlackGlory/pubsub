import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { DAO } from '@dao'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('blacklist', () => {
  describe('id in blacklist', () => {
    it('403', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
      const id = 'id'
      const message = 'message'
      const server = await buildServer()
      await DAO.addBlacklistItem(id)

      const res = await server.inject({
        method: 'POST'
      , url: `/pubsub/${id}`
      , headers: {
          'Content-Type': 'text/plain'
        }
      , payload: message
      })

      expect(res.statusCode).toBe(403)
    })
  })

  describe('id not in blacklist', () => {
    it('204', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
      const id = 'id'
      const message = 'message'
      const server = await buildServer()

      const res = await server.inject({
        method: 'POST'
      , url: `/pubsub/${id}`
      , headers: {
          'Content-Type': 'text/plain'
        }
      , payload: message
      })

      expect(res.statusCode).toBe(204)
    })
  })
})
