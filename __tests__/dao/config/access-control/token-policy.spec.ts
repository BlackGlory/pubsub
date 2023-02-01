import { TokenPolicyDAO } from '@dao/config/access-control/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawTokenPolicy({
        namespace
      , write_token_required: 1
      , read_token_required: 1
      })

      const result = TokenPolicyDAO.getAllNamespacesWithTokenPolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe('getTokenPolicies(namespace: string): { writeTokenRequired: boolean | null, readTokenRequired: boolean | null', () => {
    describe('policy exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , write_token_required: 1
        , read_token_required: 1
        })

        const result = TokenPolicyDAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          writeTokenRequired: true
        , readTokenRequired: true
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = TokenPolicyDAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          writeTokenRequired: null
        , readTokenRequired: null
        })
      })
    })
  })

  describe('setWriteTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = TokenPolicyDAO.setWriteTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['write_token_required']).toBe(1)
    })
  })

  describe('unsetWriteTokenRequired(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        })

        const result = TokenPolicyDAO.unsetWriteTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['write_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = TokenPolicyDAO.unsetWriteTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBe(false)
      })
    })
  })

  describe('setReadTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = TokenPolicyDAO.setReadTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['read_token_required']).toBe(1)
    })
  })

  describe('unsetReadTokenRequired(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        })

        const result = TokenPolicyDAO.unsetReadTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['read_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = TokenPolicyDAO.unsetReadTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBe(false)
      })
    })
  })
})
