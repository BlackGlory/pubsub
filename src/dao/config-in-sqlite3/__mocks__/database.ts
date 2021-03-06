import Database from 'better-sqlite3'
import type { Database as IDatabase } from 'better-sqlite3'
import { assert } from '@blackglory/errors'
import { migrateDatabase } from '../utils'

let db: IDatabase

export function openDatabase(): void {
  db = new Database(':memory:')
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
}

export function getDatabase(): IDatabase {
  assert(db)
  return db
}

export function closeDatabase(): void {
  if (db) db.close()
}
