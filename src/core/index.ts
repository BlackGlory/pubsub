import { isAdmin } from './admin'
import { publish } from './publish'
import { subscribe } from './subscribe'
import { stats } from './stats'
import { Forbidden, Unauthorized } from './error'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import * as TBAC from './token-based-access-control'

const Core: ICore = {
  isAdmin
, publish
, subscribe
, stats
, Forbidden
, Unauthorized
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}

export default Core
