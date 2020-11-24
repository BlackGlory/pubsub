import { getDatabase } from '../database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT pubsub_id FROM pubsub_json_schema
  `).all()
  return result.map(x => x['pubsub_id'])
}

export function getJsonSchema(id: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema FROM pubsub_json_schema
     WHERE pubsub_id = $id;
  `).get({ id })
  if (result) return result['json_schema']
  else return null
}

export function setJsonSchema({ id, schema }: { id: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_json_schema (pubsub_id, json_schema)
    VALUES ($id, $schema)
        ON CONFLICT(pubsub_id)
        DO UPDATE SET json_schema = $schema;
  `).run({ id, schema })
}

export function removeJsonSchema(id: string): void {
  getDatabase().prepare(`
    DELETE FROM pubsub_json_schema
     WHERE pubsub_id = $id;
  `).run({ id })
}
