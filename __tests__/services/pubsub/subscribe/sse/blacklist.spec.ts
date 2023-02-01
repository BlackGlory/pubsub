import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('blackllist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/pubsub/${namespace}`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('200', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'

        const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
        await waitForEventTarget(es as EventTarget, 'open')
        es.close()
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('200', async () => {
        const namespace = 'namespace'
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)

        const es = new EventSource(`${getAddress()}/pubsub/${namespace}`)
        await waitForEventTarget(es as EventTarget, 'open')
        es.close()
      })
    })
  })
})
