import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('open', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        await AccessControlDAO.addWhitelistItem(id)
        const server = await buildServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEvent(ws as unknown as EventTarget, 'open')
        } finally {
          await server.close()
        }
      })
    })

    describe('id not in whitelist', () => {
      it('error', async () => {
        process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = await buildServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEvent(ws as unknown as EventTarget, 'error')
        } finally {
          await server.close()
        }
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('open', async () => {
        const id = 'id'
        const server = await buildServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/pubsub/${id}`.replace('http', 'ws'))
          await waitForEvent(ws as unknown as EventTarget, 'open')
        } finally {
          await server.close()
        }
      })
    })
  })
})
