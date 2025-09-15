module.exports = function (targetVal, opts) {
  if (!targetVal || typeof targetVal !== 'object') return;

  const isPathParam = targetVal.in === 'path';
  const isKeyParam = targetVal.name && /Key$/.test(targetVal.name);
  const isException = opts?.exceptions?.includes(targetVal.name);

  if (!(isPathParam && isKeyParam) || isException) return;

  const schema = targetVal.schema;
  if (!schema) return [{ message: `Path parameter '${targetVal.name}' must reference a semantic key schema via $ref.` }];

  // Heuristic: a valid semantic key path param should be a $ref (or oneOf including a $ref)
  // to a schema that (after resolution) would carry x-semantic-key or x-semantic-type.
  // We cannot resolve here, so only enforce that it's not an inline primitive.
  const isInlinePrimitive = schema.type === 'string' && !schema.$ref;
  if (isInlinePrimitive) {
    return [{
      message: `Path parameter '${targetVal.name}' must use $ref to a semantic key schema (with x-semantic-key or x-semantic-type), not an inline primitive string.`,
    }];
  }
};
