import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('json schema', () => {
  describe('GET /api/pubsub-with-json-schema', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const server = getServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/pubsub-with-json-schema'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = getServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/pubsub-with-json-schema'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const server = getServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/pubsub-with-json-schema'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/pubsub/<id>/json-schema', () => {
    describe('auth', () => {
      describe('exist', () => {
        it('200', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          const server = getServer()
          const id = 'id'
          const schema = { type: 'number' }
          await JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await server.inject({
            method: 'GET'
          , url: `/api/pubsub/${id}/json-schema`
          , headers: createAuthHeaders()
          })

          expect(res.statusCode).toBe(200)
          expect(res.json()).toEqual(schema)
        })
      })

      describe('not exist', () => {
        it('404', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          const server = getServer()
          const id = 'id'

          const res = await server.inject({
            method: 'GET'
          , url: `/api/pubsub/${id}/json-schema`
          , headers: createAuthHeaders()
          })

          expect(res.statusCode).toBe(404)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = getServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/pubsub/${id}/json-schema`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const server = getServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/pubsub/${id}/json-schema`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/pubsub/<id>/json-schema', () => {
    describe('auth', () => {
      describe('valid JSON', () => {
        it('204', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          const server = getServer()
          const id = 'id'
          const schema = { type: 'number' }

          const res = await server.inject({
            method: 'PUT'
          , url: `/api/pubsub/${id}/json-schema`
          , headers: {
              ...createAuthHeaders()
            , ...createJsonHeaders()
            }
          , payload: schema
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('invalid JSON', () => {
        it('400', async () => {
          process.env.PUBSUB_ADMIN_PASSWORD = 'password'
          const server = getServer()
          const id = 'id'

          const res = await server.inject({
            method: 'PUT'
          , url: `/api/pubsub/${id}/json-schema`
          , headers: {
              ...createAuthHeaders()
            , ...createJsonHeaders()
            }
          , payload: ''
          })

          expect(res.statusCode).toBe(400)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = getServer()
        const id = 'id'
        const schema = { type: 'number' }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/pubsub/${id}/json-schema`
        , headers: createJsonHeaders()
        , payload: schema
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const server = getServer()
        const id = 'id'
        const schema = { type: 'number' }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/pubsub/${id}/json-schema`
        , headers: {
            ...createAuthHeaders('bad')
          , ...createJsonHeaders()
          }
        , payload: schema
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/pubsub/<id>/json-schema', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const server = getServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/pubsub/${id}/json-schema`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = getServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/pubsub/${id}/json-schema`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.PUBSUB_ADMIN_PASSWORD = 'password'
        const server = getServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/pubsub/${id}/json-schema`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.PUBSUB_ADMIN_PASSWORD }`
  }
}

function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
