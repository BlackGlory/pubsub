export interface IAccessControlDAO {
  Blacklist: IBlacklistDAO
  Whitelist: IWhitelistDAO
  Token: ITokenDAO
  TokenPolicy: ITokenPolicyDAO
}

export interface IBlacklistDAO {
  getAllBlacklistItems(): string[]
  inBlacklist(namespace: string): boolean
  addBlacklistItem(namespace: string): void
  removeBlacklistItem(namespace: string): void
}

export interface IWhitelistDAO {
  getAllWhitelistItems(): string[]
  inWhitelist(namespace: string): boolean
  addWhitelistItem(namespace: string): void
  removeWhitelistItem(namespace: string): void
}

export interface ITokenDAO {
  getAllNamespacesWithTokens(): string[]
  getAllTokens(namespace: string): Array<{
    token: string
    write: boolean
    read: boolean
  }>

  hasWriteTokens(namespace: string): boolean
  matchWriteToken(params: {
    token: string
    namespace: string
  }): boolean
  setWriteToken(params: {
    token: string
    namespace: string
  }): void
  unsetWriteToken(params: {
    token: string
    namespace: string
  }): void

  hasReadTokens(namespace: string): boolean
  matchReadToken(params: {
    token: string
    namespace: string
  }): boolean
  setReadToken(params: {
    token: string
    namespace: string
  }): void
  unsetReadToken(params: {
    token: string
    namespace: string
  }): void
}

export interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): string[]
  getTokenPolicies(namespace: string): {
    writeTokenRequired: boolean | null
    readTokenRequired: boolean | null
  }

  setWriteTokenRequired(namespace: string, val: boolean): void
  unsetWriteTokenRequired(namespace: string): void

  setReadTokenRequired(namespace: string, val: boolean): void
  unsetReadTokenRequired(namespace: string): void
}
