import { isAdmin } from './admin'
import { stats } from './stats'
import * as PubSub from './pubsub'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, stats
, PubSub
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
