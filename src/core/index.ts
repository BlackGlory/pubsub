import { isAdmin } from './admin'
import { metrics } from './metrics'
import * as PubSub from './pubsub'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, metrics
, PubSub
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
