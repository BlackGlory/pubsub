import { PubSubDAO } from '@dao'

export function publish(id: string, payload: string): void {
  PubSubDAO.publish(id, payload)
}

export function subscribe(id: string, cb: (value: string) => void): () => void {
  return PubSubDAO.subscribe(id, cb)
}
