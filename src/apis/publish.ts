import { JSONValue } from '@blackglory/prelude'
import { pubsub } from '@dao/pubsub.js'

export function publish(namespace: string, channel: string, content: JSONValue): void {
  pubsub.publish(namespace, channel, content)
}
