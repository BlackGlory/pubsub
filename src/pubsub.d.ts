type IUnsubscribe = () => void

interface IPubSubFactory {
  create<T>(): Promise<IPubSub<T>>
}

interface IPubSub<T> {
  publish(key: string, value: T): void
  subscribe(key: string, listener: (value: T) => void): IUnsubscribe
}
