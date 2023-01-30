import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, text } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/pubsub/${namespace}`)
        , text(message)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('204', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(namespace)

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
