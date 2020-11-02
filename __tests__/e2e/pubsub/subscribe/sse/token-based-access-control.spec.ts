import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import EventSource = require('eventsource')
import { waitForEvent } from '@blackglory/wait-for'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

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
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
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
        it('403', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/pubsub/${id}`
          })

          expect(res.statusCode).toBe(403)
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('403', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = await buildServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/pubsub/${id}`
          })

          expect(res.statusCode).toBe(403)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'false'
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

  describe('disabled', () => {
    describe('id need read tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

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

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
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
