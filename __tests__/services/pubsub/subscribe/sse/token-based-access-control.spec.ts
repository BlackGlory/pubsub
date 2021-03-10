import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const es = new EventSource(`${address}/pubsub/${id}?token=${token}`)
            await waitForEventTarget(es as EventTarget, 'open')
            es.close()
          } finally {
            await server.close()
          }
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

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
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/pubsub/${id}`
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = getServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/pubsub/${id}`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'false'
          const id = 'id'
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

  describe('disabled', () => {
    describe('id need read tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const id = 'id'
          const token = 'token'
          const server = getServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

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

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
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
})
