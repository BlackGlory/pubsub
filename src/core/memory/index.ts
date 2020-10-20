import { PubSub } from './pubsub'

export const PubSubFactory: IPubSubFactory = {
  async create<T>() {
    return new PubSub<T>()
  }
}
