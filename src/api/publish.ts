import { publish as _publish } from '@dao/publish.js'

export function publish(namespace: string, payload: string): void {
  _publish(namespace, payload)
}
