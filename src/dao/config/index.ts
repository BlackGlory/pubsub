import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import * as TokenBasedAccessControl from './token-based-access-control'

const BlacklistDAO: IBlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: IWhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const JsonSchemaDAO: IJsonSchemaDAO = {
  getAllIdsWithJsonSchema: asyncify(JsonSchema.getAllIdsWithJsonSchema)
, getJsonSchema: asyncify(JsonSchema.getJsonSchema)
, removeJsonSchema: asyncify(JsonSchema.removeJsonSchema)
, setJsonSchema: asyncify(JsonSchema.setJsonSchema)
}

const TokenBasedAccessControlDAO: ITokenBasedAccessControlDAO = {
  getAllIdsWithTokens: asyncify(TokenBasedAccessControl.getAllIdsWithTokens)
, getAllTokens: asyncify(TokenBasedAccessControl.getAllTokens)

, hasWriteTokens: asyncify(TokenBasedAccessControl.hasWriteTokens)
, matchWriteToken: asyncify(TokenBasedAccessControl.matchWriteToken)
, setWriteToken: asyncify(TokenBasedAccessControl.setWriteToken)
, unsetWriteToken: asyncify(TokenBasedAccessControl.unsetWriteToken)

, hasReadTokens: asyncify(TokenBasedAccessControl.hasReadTokens)
, matchReadToken: asyncify(TokenBasedAccessControl.matchReadToken)
, setReadToken: asyncify(TokenBasedAccessControl.setReadToken)
, unsetReadToken: asyncify(TokenBasedAccessControl.unsetReadToken)
}

export const DAO: IDataAccessObject = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...JsonSchemaDAO
, ...TokenBasedAccessControlDAO
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
