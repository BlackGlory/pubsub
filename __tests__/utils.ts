import {
  getDatabase as getAccessControlDatabase
, reconnectDatabase as reconnectAccessControlDatabase
, migrateDatabase as migrateAccessControlDatabase
} from '@dao/access-control/database'
import {
  getDatabase as getJsonSchemaDatabase
, reconnectDatabase as reconnectJsonSchemaDatabase
, migrateDatabase as migrateJsonSchemaDatabase
} from '@dao/json-schema/database'

export async function prepareAccessControlDatabase() {
  reconnectAccessControlDatabase()
  const db = getAccessControlDatabase()
  await migrateAccessControlDatabase()
  return db
}

export async function prepareJsonSchemaDatabase() {
  reconnectJsonSchemaDatabase()
  const db = getJsonSchemaDatabase()
  await migrateJsonSchemaDatabase()
  return db
}

export async function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // sjee also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.PUBSUB_HOST
  delete process.env.PUBSUB_PORT
  delete process.env.PUBSUB_ADMIN_PASSWORD
  delete process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL
  delete process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.PUBSUB_TOKEN_REQUIRED
  delete process.env.PUBSUB_JSON_VALIDATION
  delete process.env.PUBSUB_DEFAULT_JSON_SCHEMA
  delete process.env.PUBSUB_JSON_PAYLOAD_ONLY
}
