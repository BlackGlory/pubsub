import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, text } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(id)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/pubsub/${id}`)
        , text(message)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('204', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('204', async () => {
        const id = 'id'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(id)

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
