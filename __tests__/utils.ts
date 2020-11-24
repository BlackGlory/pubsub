import * as Sqlite3Database from '@dao/sqlite3/database'

export async function resetDatabases() {
  await resetSqlite3Database()
}

export async function resetSqlite3Database() {
  Sqlite3Database.closeDatabase()
  await Sqlite3Database.prepareDatabase()
}

export function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // sjee also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.PUBSUB_HOST
  delete process.env.PUBSUB_PORT
  delete process.env.PUBSUB_ADMIN_PASSWORD
  delete process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL
  delete process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.PUBSUB_WRITE_TOKEN_REQUIRED
  delete process.env.PUBSUB_READ_TOKEN_REQUIRED
  delete process.env.PUBSUB_JSON_VALIDATION
  delete process.env.PUBSUB_DEFAULT_JSON_SCHEMA
  delete process.env.PUBSUB_JSON_PAYLOAD_ONLY
}
