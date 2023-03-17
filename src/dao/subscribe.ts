import { Observable } from 'rxjs'
import { emitter } from './emitter.js'

export function observe(
  namespace: string
, channel: string
): Observable<string> {
  const eventName = `${namespace}-${channel}`

  return new Observable<string>(observer => {
    const removeListener = emitter.get().on(eventName, (value: string) => {
      observer.next(value)
    })

    return removeListener
  })
}
