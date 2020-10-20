import * as DAO from '@dao/sqlite3/token-based-access-control'
import { prepareDatabase } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/sqlite3/database')

describe('TBAC(token-based access control)', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', async () => {
      const db = await prepareDatabase()
      const id1 = 'id-1'
      const token1 = 'token-1'
      const id2 = 'id-2'
      const token2 = 'token-2'
      insert(db, { token: token1, id: id1, subscribe: true, publish: false })
      insert(db, { token: token2, id: id2, subscribe: false, publish: true })

      const result = DAO.getAllIdsWithTokens()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id1, id2])
    })
  })

  describe('getAllTokens(id: string): Array<{ token: string; publish: boolean; subscribe: boolean }>', () => {
    it('return Array<{ token: string; publish: boolean; subscribe: boolean }>', async () => {
      const db = await prepareDatabase()
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      insert(db, { token: token1, id, subscribe: true, publish: false })
      insert(db, { token: token2, id, subscribe: false, publish: true })

      const result = DAO.getAllTokens(id)

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([
        { token: token1, subscribe: true, publish: false }
      , { token: token2, subscribe: false, publish: true }
      ])
    })
  })

  describe('EnqueueToken', () => {
    describe('hasEnqueueTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: false, publish: true })

          const result = DAO.hasEnqueueTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: false })

          const result = DAO.hasEnqueueTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchEnqueueToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: false, publish: true })

          const result = DAO.matchEnqueueToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: false })

          const result = DAO.matchEnqueueToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setEnqueueToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: false })

          const result = DAO.setEnqueueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['publish_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setEnqueueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['publish_permission']).toBe(1)
        })
      })
    })

    describe('unsetEnqueueToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: true })

          const result = DAO.unsetEnqueueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['publish_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetEnqueueToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('DequeueToken', () => {
    describe('hasDequeueTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: false })

          const result = DAO.hasDequeueTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: false, publish: true })

          const result = DAO.hasDequeueTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchDequeueToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: false })

          const result = DAO.matchDequeueToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: false, publish: true })

          const result = DAO.matchDequeueToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setDequeueToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: false, publish: true })

          const result = DAO.setDequeueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['subscribe_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setDequeueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['subscribe_permission']).toBe(1)
        })
      })
    })

    describe('unsetDequeueToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, subscribe: true, publish: true })

          const result = DAO.unsetDequeueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['subscribe_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetDequeueToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })
})

function exist(db: Database, { token, id }: { token: string; id: string }) {
  return !!select(db, { token, id })
}

function select(db: Database, { token, id }: { token: string; id: string }) {
  return db.prepare(`
    SELECT *
      FROM pubsub_tbac
     WHERE token = $token AND pubsub_id = $id;
  `).get({ token, id })
}

function insert(
  db: Database
, { token, id, subscribe, publish }: {
    token: string
    id: string
    subscribe: boolean
    publish: boolean
  }
) {
  db.prepare(`
    INSERT INTO pubsub_tbac (token, pubsub_id, subscribe_permission, publish_permission)
    VALUES ($token, $id, $subscribe, $publish);
  `).run({
    token
  , id
  , subscribe: subscribe ? 1 : 0
  , publish: publish ? 1 : 0
  })
}
