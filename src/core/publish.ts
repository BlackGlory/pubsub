import { PubSubDAO } from '@dao'

export function publish(id: string, payload: string): void {
  PubSubDAO.publish(id, payload)
}
