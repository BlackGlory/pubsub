import { Observable } from 'rxjs'
import { emitter } from './emitter.js'

export function subscribe(
  channel: string
, listener: (value: string) => void
): () => void {
  const observable = new Observable<string>(observer => {
    const removeListener = emitter.get()
      .on(channel, (value: string) => observer.next(value))

    return () => removeListener()
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
