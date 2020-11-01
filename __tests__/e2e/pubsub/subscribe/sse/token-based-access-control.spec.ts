import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import * as DAO from '@src/dao/access-control/token-based-access-control'
import EventSource = require('eventsource')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('token-based access control', () => {
  describe('id has subscribe tokens', () => {
    describe('token matched', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        await DAO.setReadToken({ id, token })
        const server = await buildServer()
        const address = await server.listen(0)

        try {
          const es = new EventSource(`${address}/pubsub/${id}?token=${token}`)
          await waitForEvent(es as EventTarget, 'open')
          es.close()
        } finally {
          await server.close()
        }
      })
    })

    describe('token does not matched', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const server = await buildServer()
        await DAO.setReadToken({ id, token })

        const res = await server.inject({
          method: 'GET'
        , url: `/pubsub/${id}`
        , query: { token: 'bad' }
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('no token', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const server = await buildServer()
        await DAO.setReadToken({ id, token })

        const res = await server.inject({
          method: 'GET'
        , url: `/pubsub/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('id does not have subscribe tokens', () => {
    describe('id has publish tokens', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        await DAO.setWriteToken({ id, token })
        const server = await buildServer()
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

    describe('id has no tokens', () => {
      describe('DISABLE_NO_TOKENS', () => {
        it('403', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_DISABLE_NO_TOKENS = 'true'
          const id = 'id'
          const server = await buildServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/pubsub/${id}`
          })

          expect(res.statusCode).toBe(403)
        })
      })

      describe('not DISABLE_NO_TOKENS', () => {
        it('200', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const server = await buildServer()
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
    })
  })
})
