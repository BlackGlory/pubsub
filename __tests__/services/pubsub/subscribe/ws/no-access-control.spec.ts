import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('no access control', () => {
  it('open', async () => {
    const id = 'id'
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
