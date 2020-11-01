import { PubSubDAO } from '@dao'

export function publish(id: string, payload: unknown): void {
  PubSubDAO.publish(id, payload)
}

export function subscribe(id: string, cb: (value: unknown) => void): () => void {
  return PubSubDAO.subscribe(id, cb)
}
