import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, text, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('204', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addWhitelistItem(namespace)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/pubsub/${namespace}`)
        , text(message)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const message = 'message'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/pubsub/${namespace}`)
        , text(message)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('204', async () => {
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
})
