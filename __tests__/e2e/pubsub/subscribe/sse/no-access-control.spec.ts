import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import EventSource = require('eventsource')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('no access control', () => {
  it('200', async () => {
    const id = 'id'
    const server = await buildServer()
    const address = await server.listen(0)

    try {
      const es = new EventSource(`${address}/pubsub/${id}`)
      await waitForEvent(es as EventTarget, 'open')
      es.close()
    } finally {
      await server.close()
    }
  })
})
