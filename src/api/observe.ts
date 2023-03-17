import { Observable } from 'rxjs'
import { observe as _observe } from '@dao/subscribe.js'

export function observe(namespace: string, channel: string): Observable<string> {
  return _observe(namespace, channel)
}
