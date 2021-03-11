import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, text, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need write tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , searchParam('token', token)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , searchParam('token', 'bad')
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('id does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_WRITE_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const message = 'message'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_WRITE_TOKEN_REQUIRED = 'false'
          const id = 'id'
          const message = 'message'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need write tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('id does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.PUBSUB_WRITE_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
