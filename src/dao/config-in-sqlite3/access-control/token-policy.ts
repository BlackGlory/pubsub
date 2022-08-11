import { getDatabase } from '../database'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithTokenPolicies = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM pubsub_token_policy;
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const getTokenPolicies = withLazyStatic(function (namespace: string): {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
} {
  const row: {
    'write_token_required': number | null
  , 'read_token_required': number | null
  } = lazyStatic(() => getDatabase().prepare(`
    SELECT write_token_required
         , read_token_required
      FROM pubsub_token_policy
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })
  if (row) {
    const writeTokenRequired = row['write_token_required']
    const readTokenRequired = row['read_token_required']
    return {
      writeTokenRequired:
        writeTokenRequired === null
        ? null
        : numberToBoolean(writeTokenRequired)
    , readTokenRequired:
        readTokenRequired === null
        ? null
        : numberToBoolean(readTokenRequired)
    }
  } else {
    return { writeTokenRequired: null, readTokenRequired: null }
  }
})

export const setWriteTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO pubsub_token_policy (namespace, write_token_required)
    VALUES ($namespace, $writeTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET write_token_required = $writeTokenRequired;
  `), [getDatabase()]).run({ namespace, writeTokenRequired: booleanToNumber(val) })
})

export const unsetWriteTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE pubsub_token_policy
         SET write_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setReadTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO pubsub_token_policy (namespace, read_token_required)
    VALUES ($namespace, $readTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET read_token_required = $readTokenRequired;
  `), [getDatabase()]).run({ namespace, readTokenRequired: booleanToNumber(val) })
})

export const unsetReadTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE pubsub_token_policy
         SET read_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoPoliciesRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM pubsub_token_policy
     WHERE namespace = $namespace
       AND write_token_required = NULL
       AND read_token_required = NULL
  `), [getDatabase()]).run({ namespace })
})

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
