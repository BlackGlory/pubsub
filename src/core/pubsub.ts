import { Emitter } from './emitter'
import { Observable } from 'rxjs'

export class PubSub<T> implements IPubSub<T> {
  #emitter = new Emitter<T>()

  publish(key: string, value: T): void {
    this.#emitter.emit(key, value)
  }

  subscribe(key: string, listener: (value: T) => void): IUnsubscribe {
    const observable = new Observable<T>(observer => {
      const listener = (value: T) => observer.next(value)
      this.#emitter.on(key, listener)
      return () => this.#emitter.off(key, listener)
    })
    const subscription = observable.subscribe(listener)
    return () => subscription.unsubscribe()
  }
}
