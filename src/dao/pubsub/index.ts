import { publish } from './publish'
import { subscribe } from './subscribe'

export const PubSubDAO: IPubSubDAO<unknown> = {
  publish
, subscribe
}
