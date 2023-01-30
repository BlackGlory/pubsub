import { startService, stopService, getAddress } from '@test/utils.js'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const es = new EventSource(`${getAddress()}/pubsub/${namespace}?token=${token}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/pubsub/${namespace}`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/pubsub/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/pubsub/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'false'
          const namespace = 'namespace'

          const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
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
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.PUBSUB_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        })
      })
    })
  })
})
