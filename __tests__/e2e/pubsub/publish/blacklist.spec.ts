import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

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

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('204', async () => {
        const id = 'id'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

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
})
