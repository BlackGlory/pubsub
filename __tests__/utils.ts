import * as AccessControlDatabase from '@dao/access-control/database'
import * as JsonSchemaDatabase from '@dao/json-schema/database'

export async function resetDatabases() {
  await resetAccessControlDatabase()
  await resetJsonSchemaDatabase()
}

export async function resetAccessControlDatabase() {
  AccessControlDatabase.closeDatabase()
  await AccessControlDatabase.prepareDatabase()
}

export async function resetJsonSchemaDatabase() {
  JsonSchemaDatabase.closeDatabase()
  await JsonSchemaDatabase.prepareDatabase()
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
