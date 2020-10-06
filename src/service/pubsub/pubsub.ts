import { Emitter } from './emitter'
import { Observable } from 'rxjs'

export class PubSub<T> {
  #emitter = new Emitter<T>()

  publish(key: string, value: T) {
    this.#emitter.emit(key, value)
  }

  observe(key: string): Observable<T> {
    return new Observable<T>(observer => {
      const listener = (value: T) => observer.next(value)
      this.#emitter.on(key, listener)
      return () => this.#emitter.off(key, listener)
    })
  }
}
