import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import { UnpackedPromise } from 'hotypes'

let server: UnpackedPromise<ReturnType<typeof buildServer>>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  server = await buildServer()
  address = await server.listen()
}

export async function stopService() {
  await server.close()
  resetEnvironment()
}

export function resetEnvironment() {
  // reset memoize
  resetCache()
}
