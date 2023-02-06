import { publish as _publish } from '@dao/publish.js'

export function publish(channel: string, payload: string): void {
  _publish(channel, payload)
}
