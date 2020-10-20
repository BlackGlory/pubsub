import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import DAO from '@dao'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('open', async () => {
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      await DAO.addWhitelistItem(id)
      const server = buildServer()
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
      process.env.PUBSUB_ADMIN_PASSWORD = 'password'
      process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      const server = buildServer()
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
