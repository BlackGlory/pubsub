import { PubSubDAO } from '@dao/index.js'

export function publish(namespace: string, payload: string): void {
  PubSubDAO.publish(namespace, payload)
}

export function subscribe(namespace: string, cb: (value: string) => void): () => void {
  return PubSubDAO.subscribe(namespace, cb)
}
