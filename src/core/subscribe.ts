import { PubSubDAO } from '@dao'

export function subscribe(id: string, cb: (value: string) => void): () => void {
  return PubSubDAO.subscribe(id, cb)
}
