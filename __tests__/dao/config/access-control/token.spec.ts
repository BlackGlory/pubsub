import { TokenDAO } from '@dao/config/access-control/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawToken, hasRawToken, setRawToken } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllNamespacesWithTokens(): string[]', () => {
    it('return string[]', () => {
      const namespace1 = 'namespace-1'
      const token1 = 'token-1'
      const namespace2 = 'namespace-2'
      const token2 = 'token-2'
      setRawToken({
        token: token1
      , namespace: namespace1
      , read_permission: 1
      , write_permission: 0
      })
      setRawToken({
        token: token2
      , namespace: namespace2
      , read_permission: 0
      , write_permission: 1
      })

      const result = TokenDAO.getAllNamespacesWithTokens()

      expect(result).toEqual([namespace1, namespace2])
    })
  })

  describe(`
    getAllTokens(
      namespace: string
    ): Array<{token: string; enqueue: boolean; dequeue: boolean }>
  `, () => {
    it('return Array<{ token: string; write: boolean; read: boolean }>', () => {
      const namespace = 'namespace'
      const token1 = 'token-1'
      const token2 = 'token-2'
      setRawToken({
        token: token1
      , namespace
      , read_permission: 1
      , write_permission: 0
      })
      setRawToken({
        token: token2
      , namespace
      , read_permission: 0
      , write_permission: 1
      })

      const result = TokenDAO.getAllTokens(namespace)

      expect(result).toEqual([
        { token: token1, read: true, write: false }
      , { token: token2, read: false, write: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = TokenDAO.hasWriteTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = TokenDAO.hasWriteTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchWriteToken({ token: string; namespace: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = TokenDAO.matchWriteToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = TokenDAO.matchWriteToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = TokenDAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 1
          })

          const result = TokenDAO.unsetWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.unsetWriteToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('hasReadTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = TokenDAO.hasReadTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = TokenDAO.hasReadTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchReadToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0 })

          const result = TokenDAO.matchReadToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = TokenDAO.matchReadToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setReadToken(token: string, namespace: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1 })

          const result = TokenDAO.setReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.setReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })
    })

    describe('unsetReadToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 1
          })

          const result = TokenDAO.unsetReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = TokenDAO.unsetReadToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })
})
