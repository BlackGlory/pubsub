import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@src/dao/access-control'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id has subscribe tokens', () => {
      describe('token matched', () => {
        it('open', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadToken({ id, token })
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/pubsub/${id}?token=${token}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
          } finally {
            await server.close()
          }
        })
      })

      describe('token does not matched', () => {
        it('error', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/pubsub/${id}?token=bad`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'error')
          } finally {
            await server.close()
          }
        })
      })

      describe('no token', () => {
        it('error', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'error')
          } finally {
            await server.close()
          }
        })
      })
    })

    describe('id does not have subscribe tokens', () => {
      describe('id has publish tokens', () => {
        it('open', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setWriteToken({ id, token })
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
          } finally {
            await server.close()
          }
        })
      })

      describe('id has no tokens', () => {
        describe('TOKEN_REQUIRED', () => {
          it('error', async () => {
            process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
            process.env.PUBSUB_TOKEN_REQUIRED = 'true'
            const id = 'id'
            const server = await buildServer()
            const address = await server.listen(0)

            try {
              const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
              await waitForEvent(ws as unknown as EventTarget, 'error')
            } finally {
              await server.close()
            }
          })
        })

        describe('not TOKEN_REQUIRED', () => {
          it('open', async () => {
            process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
            const id = 'id'
            const server = await buildServer()
            const address = await server.listen(0)

            try {
              const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
              await waitForEvent(ws as unknown as EventTarget, 'open')
            } finally {
              await server.close()
            }
          })
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id has subscribe tokens', () => {
      describe('no token', () => {
        it('error', async () => {
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
          } finally {
            await server.close()
          }
        })
      })
    })
  })
})
