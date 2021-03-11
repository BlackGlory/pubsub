import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

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
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const es = new EventSource(`${getAddress()}/pubsub/${id}?token=${token}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/pubsub/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'false'
          const id = 'id'

          const es = new EventSource(`${getAddress()}/pubsub/${id}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
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
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const es = new EventSource(`${getAddress()}/pubsub/${id}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'

          const es = new EventSource(`${getAddress()}/pubsub/${id}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        })
      })
    })
  })
})
