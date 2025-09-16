// Deep traversal alternative to JSONPath predicate for *Key property enforcement.
// Walks the object graph, emitting a violation when encountering a property whose name ends
// with 'Key' (starting with lowercase) whose value is an inline primitive string schema
// (type: string) that is not a $ref target, unless listed in exceptions.

function visit(node, path, pushError, exceptionsSet) {
  if (!node || typeof node !== 'object') return;

  if (node.properties && typeof node.properties === 'object') {
    for (const [propName, propSchema] of Object.entries(node.properties)) {
      const childPath = path.concat(['properties', propName]);
      if (/^[a-z].*Key$/.test(propName) && !exceptionsSet.has(propName)) {
        if (propSchema && typeof propSchema === 'object' && !('$ref' in propSchema)) {
          if (propSchema.type === 'string') {
            pushError(childPath, propName);
          }
        }
      }
      // Recurse into nested schemas regardless
      visit(propSchema, childPath, pushError, exceptionsSet);
    }
  }

  // Recurse into composed schemas (allOf/oneOf/anyOf/items) where applicable
  if (Array.isArray(node.allOf)) node.allOf.forEach((n, i) => visit(n, path.concat(['allOf', String(i)]), pushError, exceptionsSet));
  if (Array.isArray(node.oneOf)) node.oneOf.forEach((n, i) => visit(n, path.concat(['oneOf', String(i)]), pushError, exceptionsSet));
  if (Array.isArray(node.anyOf)) node.anyOf.forEach((n, i) => visit(n, path.concat(['anyOf', String(i)]), pushError, exceptionsSet));
  if (node.items) visit(node.items, path.concat(['items']), pushError, exceptionsSet);
}

module.exports = function (targetVal, opts, ctx) {
  const errors = [];
  const exceptionsSet = new Set((opts?.exceptions || '').split(/\s+/).filter(Boolean));

  const pushError = (errorPathArray, propName) => {
    errors.push({
      message: `Property '${propName}' must use $ref to a semantic key schema (x-semantic-type or x-semantic-key), not an inline primitive string.`,
      path: errorPathArray,
    });
  };

  visit(targetVal, ctx.path || [], pushError, exceptionsSet);

  return errors.length ? errors : undefined;
};
