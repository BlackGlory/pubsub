import Ajv from 'ajv'
import { JSONSchemaDAO } from '@dao/index.js'
import { DEFAULT_JSON_SCHEMA, JSON_VALIDATION } from '@env/index.js'
import { JSONValue } from 'justypes'
import { getErrorResult } from 'return-style'
import { CustomError } from '@blackglory/errors'

const ajv = new Ajv.default()

export function isEnabled(): boolean {
  return JSON_VALIDATION()
}

export function getAllNamespaces(): string[] {
  return JSONSchemaDAO.getAllNamespacesWithJSONSchema()
}

export function get(namespace: string): string | null {
  return JSONSchemaDAO.getJSONSchema(namespace)
}

export function set(namespace: string, schema: JSONValue): void {
  const schemaString = JSON.stringify(schema, null, 2)
  return JSONSchemaDAO.setJSONSchema({ namespace, schema: schemaString })
}

export function remove(namespace: string): void {
  return JSONSchemaDAO.removeJSONSchema(namespace)
}

/**
 * @throws {InvalidPayload}
 */
export function validate(namespace: string, payload: string): void {
  const [err, json] = getErrorResult(() => JSON.parse(payload))
  if (err) throw new InvalidPayload()

  const jsonSchema = JSONSchemaDAO.getJSONSchema(namespace)
  const schema = jsonSchema ? JSON.parse(jsonSchema) : DEFAULT_JSON_SCHEMA()
  if (schema) {
    const valid = ajv.validate(schema, json)
    if (!valid) throw new InvalidPayload(ajv.errorsText())
  }
}

export class InvalidPayload extends CustomError {}
