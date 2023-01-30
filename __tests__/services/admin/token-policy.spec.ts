import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('TokenPolicy', () => {
  describe('GET /admin/pubsub-with-token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/pubsub-with-token-policies')
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
        , pathname('/admin/pubsub-with-token-policies')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/pubsub-with-token-policies')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/pubsub/:namespace/token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'object'
        , properties: {
            writeTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , readTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
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
        , pathname(`/admin/pubsub/${namespace}/token-policies`)
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
        , pathname(`/admin/pubsub/${namespace}/token-policies`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/pubsub/:namespace/token-policies/write-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/write-token-required`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/write-token-required`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/write-token-required`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/pubsub/:namespace/token-policies/read-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/read-token-required`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/read-token-required`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/read-token-required`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/pubsub/:namespace/token-policies/write-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/write-token-required`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/write-token-required`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/write-token-required`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/pubsub/:namespace/token-policies/read-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/read-token-required`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/read-token-required`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/pubsub/${namespace}/token-policies/read-token-required`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.PUBSUB_ADMIN_PASSWORD }`
  }
}
