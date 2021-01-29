import { buildServer } from '@src/server'
import { resetEnvironment, resetDatabases } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('blackllist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

        const res = await server.inject({
          method: 'GET'
        , url: `/pubsub/${id}`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const server = await buildServer()
        const address = await server.listen(0)

        try {
          const es = new EventSource(`${address}/pubsub/${id}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        } finally {
          await server.close()
        }
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const id = 'id'
        const server = await buildServer()
        const address = await server.listen(0)
        await AccessControlDAO.addBlacklistItem(id)

        try {
          const es = new EventSource(`${address}/pubsub/${id}`)
          await waitForEventTarget(es as EventTarget, 'open')
          es.close()
        } finally {
          await server.close()
        }
      })
    })
  })
})