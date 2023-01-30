type JSONValue = import('justypes').JSONValue
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor

interface ICore {
  isAdmin(password: string): boolean

  PubSub: {
    publish(namespace: string, payload: string): void
    subscribe(namespace: string, cb: (value: string) => void): () => void
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<string | null>
    set(namespace: string, schema: JSONValue): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: string): Promise<void>

    InvalidPayload: CustomErrorConstructor
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(namespace: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): Promise<string[]>
      getAll(namespace: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
      }>>

      setWriteToken(namespace: string, token: string): Promise<void>
      unsetWriteToken(namespace: string, token: string): Promise<void>

      setReadToken(namespace: string, token: string): Promise<void>
      unsetReadToken(namespace: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllNamespaces(): Promise<string[]>
      get(namespace: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(namespace: string): Promise<void>

      setReadTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetReadTokenRequired(namespace: string): Promise<void>
    }
  }
}
