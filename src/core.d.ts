type Json = import('@blackglory/types').Json
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor

interface ICore {
  isAdmin(password: string): boolean

  metrics(): {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    resourceUsage: NodeJS.ResourceUsage
  }

  PubSub: {
    publish(id: string, payload: string): void
    subscribe(id: string, cb: (value: string) => void): () => void
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: Json): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(id: string, payload: string): Promise<void>

    InvalidPayload: CustomErrorConstructor
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(ig: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>

    Forbidden: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(id: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllIds(): Promise<string[]>
      getAll(id: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
      }>>

      setWriteToken(id: string, token: string): Promise<void>
      unsetWriteToken(id: string, token: string): Promise<void>

      setReadToken(id: string, token: string): Promise<void>
      unsetReadToken(id: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllIds(): Promise<string[]>
      get(id: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(id: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(id: string): Promise<void>

      setReadTokenRequired(id: string, val: boolean): Promise<void>
      unsetReadTokenRequired(id: string): Promise<void>
    }
  }
}
