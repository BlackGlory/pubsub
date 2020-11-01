import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('no access control', () => {
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
