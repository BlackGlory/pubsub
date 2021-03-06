import Database from 'better-sqlite3'
import type { Database as IDatabase } from 'better-sqlite3'
import * as path from 'path'
import { ensureDirSync } from 'extra-filesystem'
import { assert } from '@blackglory/errors'
import { NODE_ENV, NodeEnv, DATA } from '@env'
import { migrateDatabase } from './utils'
assert(NODE_ENV() !== NodeEnv.Test)

let db: IDatabase

export function openDatabase(): void {
  const dataPath = DATA()
  const dataFilename = path.join(dataPath, 'config.db')
  ensureDirSync(dataPath)

  db = new Database(dataFilename)
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
  if (db) {
    db.exec(`
      PRAGMA analysis_limit=400;
      PRAGMA optimize;
    `)
    db.close()
  }
}
