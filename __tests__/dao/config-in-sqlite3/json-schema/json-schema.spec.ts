import * as DAO from '@dao/config-in-sqlite3/json-schema/json-schema'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { Database } from 'better-sqlite3'
import { resetDatabases, resetEnvironment } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('JSON Schema', () => {
  describe('getAllIdsWithJsonSchema(): string[]', () => {
    it('return string[]', () => {
      const db = getDatabase()
      const id = 'id-1'
      const schema = createSchema()
      insert(db, { id, schema })

      const result = DAO.getAllIdsWithJsonSchema()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('getJsonSchema(id: string): string | null', () => {
    describe('exist', () => {
      it('return schema', () => {
        const db = getDatabase()
        const id = 'id-1'
        const schema = createSchema()
        insert(db, { id, schema })

        const result = DAO.getJsonSchema(id)

        expect(result).toBe(schema)
      })
    })

    describe('not exist', () => {
      it('return null', () => {
        const id = 'id-1'

        const result = DAO.getJsonSchema(id)

        expect(result).toBeNull()
      })
    })
  })

  describe('setJsonSchema({ id: string; schema: string })', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'
        const schema = createSchema()
        insert(db, { id, schema })

        const result = DAO.setJsonSchema({ id, schema })

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'
        const schema = createSchema()

        const result = DAO.setJsonSchema({ id, schema })

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })
  })

  describe('removeJsonSchema(id: string)', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'
        const schema = createSchema()
        insert(db, { id, schema })

        const result = DAO.removeJsonSchema(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'

        const result = DAO.removeJsonSchema(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function createSchema() {
  return JSON.stringify({ type: 'number' })
}

function exist(db: Database, id: string) {
  return !!select(db, id)
}

function insert(db: Database, { id, schema }:{ id: string; schema: string }) {
  db.prepare('INSERT INTO pubsub_json_schema (pubsub_id, json_schema) VALUES ($id, $schema);').run({ id, schema })
}

function select(db: Database, id: string) {
  return db.prepare('SELECT * FROM pubsub_json_schema WHERE pubsub_id = $id;').get({ id })
}
