import { JSONValue } from '@blackglory/prelude'
import { Observable } from 'rxjs'

export interface IAPI {
  publish(namespace: string, channel: string, content: JSONValue): void
  observe(namespace: string, channel: string): Observable<JSONValue>
}
