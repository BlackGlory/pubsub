import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  pubsub_id: string
  json_schema: string
}

export function setRawJsonSchema(props: IRawJsonSchema): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_json_schema (pubsub_id, json_schema)
    VALUES ($pubsub_id, $json_schema);
  `).run(props)
}

export function hasRawJsonSchema(id: string): boolean {
  return !!getRawJsonSchema(id)
}

export function getRawJsonSchema(id: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM pubsub_json_schema
     WHERE pubsub_id = $id;
  `).get({ id })
}
