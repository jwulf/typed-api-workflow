module.exports = function (targetVal, opts) {
  if (!targetVal || typeof targetVal !== 'object') return;

  const name = targetVal.name;
  if (!name) return; // skip malformed parameter objects
  const isPathParam = targetVal.in === 'path';
  const isKeyParam = /Key$/.test(name);
  const isException = opts?.exceptions?.includes(name);
  if (!(isPathParam && isKeyParam) || isException) return;

  const schema = targetVal.schema;
  if (!schema) {
    return [{ message: `Path parameter '${name}' must reference a semantic key schema via $ref or inline semantic marker.` }];
  }

  // If it is a $ref, accept (referenced schema will be validated by other rules for markers + type string)
  if (schema.$ref) return;

  // Allow inline ONLY if it is a string and carries semantic marker(s)
  const hasMarker = Object.prototype.hasOwnProperty.call(schema, 'x-semantic-type') || Object.prototype.hasOwnProperty.call(schema, 'x-semantic-key');
  if (schema.type === 'string' && hasMarker) return; // valid inline semantic key

  // If inline but missing marker or wrong type, emit error with actionable guidance
  return [{
    message: `Path parameter '${name}' must be a $ref to a semantic key schema or inline with type: string and x-semantic-type (or x-semantic-key).`,
  }];
};
