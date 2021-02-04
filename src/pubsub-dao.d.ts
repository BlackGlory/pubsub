type IUnsubscribe = () => void

interface IPubSubDAO {
  publish(key: string, value: string): void
  subscribe(key: string, listener: (value: string) => void): IUnsubscribe
}
