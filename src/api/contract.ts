import { Awaitable, JSONValue } from '@blackglory/prelude'
import { CustomErrorConstructor } from '@blackglory/errors'

export interface IAPI {
  isAdmin(password: string): boolean

  PubSub: {
    publish(namespace: string, payload: string): void
    subscribe(namespace: string, cb: (value: string) => void): () => void
  }

  JSONSchema: {
    isEnabled(): boolean
    getAllNamespaces(): string[]
    get(namespace: string): string | null
    set(namespace: string, schema: JSONValue): void
    remove(namespace: string): void

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: string): void

    InvalidPayload: CustomErrorConstructor
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(namespace: string, token?: string): void

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): string[]
      getAll(namespace: string): Array<{
        token: string
        write: boolean
        read: boolean
      }>

      setWriteToken(namespace: string, token: string): void
      unsetWriteToken(namespace: string, token: string): void

      setReadToken(namespace: string, token: string): void
      unsetReadToken(namespace: string, token: string): void
    }

    TokenPolicy: {
      getAllNamespaces(): string[]
      get(namespace: string): {
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }

      setWriteTokenRequired(namespace: string, val: boolean): void
      unsetWriteTokenRequired(namespace: string): void

      setReadTokenRequired(namespace: string, val: boolean): void
      unsetReadTokenRequired(namespace: string): void
    }
  }
}
