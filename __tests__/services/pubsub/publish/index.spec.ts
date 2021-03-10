import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  describe('PUBSUB_JSON_VALIDATION=true', () => {
    describe('PUBSUB_JSON_DEFAULT_SCHEMA', () => {
      describe('Content-Type: application/json', () => {
        describe('valid', () => {
          it('204', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            process.env.PUBSUB_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            const server = getServer()
            const id = 'id'
            const message = '123'

            const res = await server.inject({
              method: 'POST'
            , url: `/pubsub/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid', () => {
          it('400', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            process.env.PUBSUB_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            const server = getServer()
            const id = 'id'
            const message = ' "message" '

            const res = await server.inject({
              method: 'POST'
            , url: `/pubsub/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('204', async () => {
          process.env.PUBSUB_JSON_VALIDATION = 'true'
          process.env.PUBSUB_DEFAULT_JSON_SCHEMA = JSON.stringify({
            type: 'number'
          })
          const server = getServer()
          const id = 'id'
          const message = 'message'

          const res = await server.inject({
            method: 'POST'
          , url: `/pubsub/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id has JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = ' "message" '
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })
            const server = getServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/pubsub/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = 'message'
            const server = getServer()
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            const res = await server.inject({
              method: 'POST'
            , url: `/pubsub/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('415', async () => {
          process.env.PUBSUB_JSON_VALIDATION = 'true'
          const id = 'id'
          const schema = { type: 'string' }
          const message = ' "message" '
          const server = getServer()
          await JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await server.inject({
            method: 'POST'
          , url: `/pubsub/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })

          expect(res.statusCode).toBe(415)
        })
      })
    })

    describe('id does not have JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = ' "message" '
            const server = getServer()
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            const res = await server.inject({
              method: 'POST'
            , url: `/pubsub/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            const id = 'id'
            const message = 'message'
            const server = getServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/pubsub/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })
    })
  })

  describe('PUBSUB_JSON_PAYLOAD_ONLY', () => {
    describe('Content-Type: application/json', () => {
      it('accpet any plaintext, return 204', async () => {
        process.env.PUBSUB_JSON_PAYLOAD_ONLY = 'true'
        const server = getServer()
        const id = 'id'
        const message = JSON.stringify('message')

        const res = await server.inject({
          method: 'POST'
        , url: `/pubsub/${id}`
        , payload: message
        , headers: {
            'Content-Type': 'application/json'
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('other Content-Type', () => {
      it('400', async () => {
        process.env.PUBSUB_JSON_PAYLOAD_ONLY = 'true'
        const server = getServer()
        const id = 'id'
        const message = 'message'

        const res = await server.inject({
          method: 'POST'
        , url: `/pubsub/${id}`
        , payload: message
        , headers: {
            'Content-Type': 'text/plain'
          }
        })

        expect(res.statusCode).toBe(400)
      })
    })
  })

  describe('Content-Type', () => {
    it('accpet any content-type', async () => {
      const server = getServer()
      const id = 'id'
      const message = 'message'

      const res = await server.inject({
        method: 'POST'
      , url: `/pubsub/${id}`
      , payload: message
      , headers: {
          'Content-Type': 'apple/banana'
        }
      })

      expect(res.statusCode).toBe(204)
    })
  })
})
