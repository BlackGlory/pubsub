import { assert } from '@blackglory/errors'

export function createAuthHeaders(adminPassword?: string) {
  const value =  adminPassword ?? process.env.PUBSUB_ADMIN_PASSWORD
  assert(value, 'The value should not be undefined')

  return { 'Authorization': `Bearer ${value}` }
}
