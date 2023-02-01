import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { tokenSchema } from '@src/schema.js'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { createAuthHeaders } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('Token', () => {
  describe('GET /admin/pubsub-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/pubsub-with-tokens')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/pubsub-with-tokens')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/pubsub-with-tokens')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/pubsub/:namespace/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              token: tokenSchema
            , publish: { type: 'boolean' }
            , subscribe: { type: 'boolean' }
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/pubsub/:namespace/tokens/:token/write', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/write`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/write`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/write`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/pubsub/:namespace/tokens/:token/write', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/write`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/write`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/write`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/pubsub/:namespace/tokens/:token/read', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/read`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/read`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/read`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/pubsub/:namespace/tokens/:token/read', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/read`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/read`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/tokens/${token}/read`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})
