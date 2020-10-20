import { PubSub } from './pubsub'

export async function createPubSub<T>() {
  return new PubSub<T>()
}
