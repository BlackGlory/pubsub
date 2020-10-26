import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { DAO } from '@dao'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('204', async () => {
      const id = 'id'
      const message = 'message'
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const server = await buildServer()
      await DAO.addWhitelistItem(id)

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

  describe('id not in whitelist', () => {
    it('403', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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

      expect(res.statusCode).toBe(403)
    })
  })
})
