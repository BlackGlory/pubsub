interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(id: string): Promise<boolean>
  addBlacklistItem(id: string): Promise<void>
  removeBlacklistItem(id: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(id: string): Promise<boolean>
  addWhitelistItem(id: string): Promise<void>
  removeWhitelistItem(id: string): Promise<void>
}

interface IJsonSchemaDAO {
  getAllIdsWithJsonSchema(): Promise<string[]>
  getJsonSchema(id: string): Promise<string | null>
  setJsonSchema(props: { id: string; schema: string }): Promise<void>
  removeJsonSchema(id: string): Promise<void>
}

interface ITokenBasedAccessControlDAO {
  getAllIdsWithTokens(): Promise<string[]>
  getAllTokens(id: string): Promise<Array<{
    token: string
    publish: boolean
    subscribe: boolean
  }>>

  hasPublishTokens(id: string): Promise<boolean>
  matchPublishToken(props: { token: string; id: string }): Promise<boolean>
  setPublishToken(props: { token: string; id: string }): Promise<void>
  unsetPublishToken(props: { token: string; id: string }): Promise<void>

  hasSubscribeTokens(id: string): Promise<boolean>
  matchSubscribeToken(props: { token: string; id: string }): Promise<boolean>
  setSubscribeToken(props: { token: string; id: string }): Promise<void>
  unsetSubscribeToken(props: { token: string; id: string }): Promise<void>
}

interface IDataAccessObject extends IBlacklistDAO
                                  , IWhitelistDAO
                                  , IJsonSchemaDAO
                                  , ITokenBasedAccessControlDAO {}
