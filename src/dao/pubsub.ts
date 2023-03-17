import { JSONValue } from '@blackglory/prelude'
import { Emitter } from '@blackglory/structures'
import { Observable } from 'rxjs'

class PubSub {
  private emitter = this.createEmitter()

  publish(namespace: string, channel: string, content: JSONValue): void {
    const eventName = this.createEventName(namespace, channel)

    this.emitter.emit(eventName, content)
  }

  observe(namespace: string, channel: string): Observable<JSONValue> {
    return new Observable(observer => {
      const eventName = this.createEventName(namespace, channel)

      const removeListener = this.emitter.on(eventName, content => {
        observer.next(content)
      })

      return removeListener
    })
  }

  reset(): void {
    this.emitter = this.createEmitter()
  }

  private createEventName(namespace: string, channel: string): string {
    return `${namespace}-${channel}`
  }

  private createEmitter(): Emitter<Record<string, [content: JSONValue]>> {
    return new Emitter()
  }
}

export const pubsub = new PubSub()
