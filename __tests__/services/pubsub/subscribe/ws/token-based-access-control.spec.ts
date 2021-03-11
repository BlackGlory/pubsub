import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('open', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}?token=${token}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'open')
        })
      })

      describe('token does not matched', () => {
        it('error', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}?token=bad`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'error')
        })
      })

      describe('no token', () => {
        it('error', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'error')
        })
      })
    })

    describe('id does not have read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('error', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'error')
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('open', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'false'
          const id = 'id'

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'open')
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need read tokens', () => {
      describe('no token', () => {
        it('open', async () => {
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'open')
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('open', async () => {
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'

          const ws = new WebSocket(`${getAddress()}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEventTarget(ws as unknown as EventTarget, 'open')
        })
      })
    })
  })
})
