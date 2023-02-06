import { publish as _publish } from '@dao/publish.js'

export function publish(namespace: string, channel: string, payload: string): void {
  _publish(namespace, channel, payload)
}
