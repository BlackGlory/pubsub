import { isAdmin } from './admin'
import { stats } from './stats'
import * as Error from './error'
import * as PubSub from './pubsub'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import * as TBAC from './token-based-access-control'

const Core: ICore = {
  isAdmin
, stats
, PubSub
, Blacklist
, Whitelist
, JsonSchema
, TBAC
, Error
}

export default Core
