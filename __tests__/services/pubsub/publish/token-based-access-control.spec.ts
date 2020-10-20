import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import DAO from '@dao'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('token-based access control', () => {
  describe('id has publish tokens', () => {
    describe('token matched', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = buildServer()
        await DAO.setEnqueueToken({ id, token })

        const res = await server.inject({
          method: 'POST'
        , url: `/pubsub/${id}`
        , query: { token }
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('token does not matched', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = buildServer()
        await DAO.setEnqueueToken({ id, token })

        const res = await server.inject({
          method: 'POST'
        , url: `/pubsub/${id}`
        , query: { token: 'bad' }
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('id does not have publish tokens', () => {
    describe('id has subscribe tokens', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = buildServer()
        await DAO.setDequeueToken({ id, token })

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

    describe('id has no tokens', () => {
      describe('DISABLE_NO_TOKENS', () => {
        it('403', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_DISABLE_NO_TOKENS = 'true'
          const id = 'id'
          const message = 'message'
          const server = buildServer()

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

      describe('not DISABLE_NO_TOKENS', () => {
        it('204', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const message = 'message'
          const server = buildServer()

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
})
