import { startService, stopService, getAddress } from '@test/utils.js'
import { JSONSchemaDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json, text, header } from 'extra-request/transformers'

// 由于服务启动时会读取环境变量 PUBSUB_JSON_PAYLOAD_ONLY
// 因此环境变量必须在服务启动前设置, 这迫使测试用例手动启动服务
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
            await startService()
            const namespace = 'namespace'
            const message = 123

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/pubsub/${namespace}`)
            , json(message)
            ))

            expect(res.status).toBe(204)
          })
        })

        describe('invalid', () => {
          it('400', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            process.env.PUBSUB_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            await startService()
            const namespace = 'namespace'
            const message = ' "message" '

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/pubsub/${namespace}`)
            , json(message)
            ))

            expect(res.status).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('204', async () => {
          process.env.PUBSUB_JSON_VALIDATION = 'true'
          process.env.PUBSUB_DEFAULT_JSON_SCHEMA = JSON.stringify({
            type: 'number'
          })
          await startService()
          const namespace = 'namespace'
          const message = 'message'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('id has JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            await startService()
            const namespace = 'namespace'
            const schema = { type: 'string' }
            const message = ' "message" '
            JSONSchemaDAO.setJSONSchema({
              namespace
            , schema: JSON.stringify(schema)
            })

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/pubsub/${namespace}`)
            , json(message)
            ))

            expect(res.status).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            await startService()
            const namespace = 'namespace'
            const schema = { type: 'string' }
            const message = 'message'
            JSONSchemaDAO.setJSONSchema({
              namespace
            , schema: JSON.stringify(schema)
            })

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/pubsub/${namespace}`)
            , text(message)
            , header('Content-Type', 'application/json')
            ))

            expect(res.status).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('415', async () => {
          process.env.PUBSUB_JSON_VALIDATION = 'true'
          await startService()
          const namespace = 'namespace'
          const schema = { type: 'string' }
          const message = ' "message" '
          JSONSchemaDAO.setJSONSchema({
            namespace
          , schema: JSON.stringify(schema)
          })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/pubsub/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(415)
        })
      })
    })

    describe('namespace does not have JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            await startService()
            const namespace = 'namespace'
            const schema = { type: 'string' }
            const message = 'message'
            JSONSchemaDAO.setJSONSchema({
              namespace
            , schema: JSON.stringify(schema)
            })

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/pubsub/${namespace}`)
            , json(message)
            ))

            expect(res.status).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.PUBSUB_JSON_VALIDATION = 'true'
            await startService()
            const namespace = 'namespace'
            const message = 'message'

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/pubsub/${namespace}`)
            , text(message)
            , header('Content-Type', 'application/json')
            ))

            expect(res.status).toBe(400)
          })
        })
      })
    })
  })

  describe('PUBSUB_JSON_PAYLOAD_ONLY', () => {
    describe('Content-Type: application/json', () => {
      it('accpet any plaintext, return 204', async () => {
        process.env.PUBSUB_JSON_PAYLOAD_ONLY = 'true'
        await startService()
        const namespace = 'namespace'
        const message = JSON.stringify('message')

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/pubsub/${namespace}`)
        , json(message)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('other Content-Type', () => {
      it('400', async () => {
        process.env.PUBSUB_JSON_PAYLOAD_ONLY = 'true'
        await startService()
        const namespace = 'namespace'
        const message = 'message'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/pubsub/${namespace}`)
        , text(message)
        ))

        expect(res.status).toBe(400)
      })
    })
  })

  describe('Content-Type', () => {
    it('accpet any content-type', async () => {
      await startService()
      const namespace = 'namespace'
      const message = 'message'

      const res = await fetch(post(
        url(getAddress())
      , pathname(`/pubsub/${namespace}`)
      , text(message)
      , header('Content-Type', 'apple/banana')
      ))

      expect(res.status).toBe(204)
    })
  })
})
