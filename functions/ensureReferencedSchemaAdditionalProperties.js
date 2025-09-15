/**
 * Ensures that when a request body schema is a $ref, the referenced component schema
 * explicitly declares `additionalProperties` (any boolean or object value).
 *
 * Invocation context: configured with a `given` selecting requestBody media type schemas
 * that have a $ref. We then look up the referenced schema in components.schemas.
 *
 * Limitations / Scope:
 *  - Only supports local $refs of the form '#/components/schemas/Name'. External refs ignored.
 *  - Does not recurse allOf/oneOf; enforcement is only that the top-level referenced schema itself
 *    declares additionalProperties. (Could be enhanced later.)
 */
module.exports = function ensureReferencedSchemaAdditionalProperties(targetVal, _opts, ctx) {
  if (!targetVal || typeof targetVal !== 'object' || !targetVal.$ref) return;
  const ref = targetVal.$ref;
  const match = ref.match(/^#\/components\/schemas\/(.+)$/);
  if (!match) return; // Not a local component schema ref; ignore.
  const schemaName = match[1];

  // Attempt to locate resolved document root
  const root = ctx?.documentInventory?.resolved || ctx?.document || {};
  const components = root.components || {};
  const schemas = components.schemas || {};
  const referenced = schemas[schemaName];
  if (!referenced || typeof referenced !== 'object') return [{
    message: `Referenced schema '${schemaName}' not found under components.schemas.`
  }];

  const hasExplicit = Object.prototype.hasOwnProperty.call(referenced, 'additionalProperties');
  if (!hasExplicit) {
    return [{
      message: `Referenced schema '${schemaName}' used in a request body must explicitly declare additionalProperties (boolean or schema).`
    }];
  }
};
