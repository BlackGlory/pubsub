import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithJSONSchema = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM pubsub_json_schema
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const getJSONSchema = withLazyStatic(function (namespace: string): string | null {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT json_schema
      FROM pubsub_json_schema
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })

  return result ? result['json_schema'] : null
})

export const setJSONSchema = withLazyStatic(function ({
  namespace
, schema
}: { namespace: string; schema: string }): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO pubsub_json_schema (namespace, json_schema)
    VALUES ($namespace, $schema)
        ON CONFLICT(namespace)
        DO UPDATE SET json_schema = $schema;
  `), [getDatabase()]).run({ namespace, schema })
})

export const removeJSONSchema = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM pubsub_json_schema
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace })
})
