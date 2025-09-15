/**
 * Spectral custom function: ensure that object properties whose name ends with 'Key'
 * are modelled as references to a semantic key schema instead of inline primitives.
 *
 * Transition note: Previously this enforced inheritance from CamundaKey. We are
 * migrating to an explicit semantic key signal (x-semantic-key: true) or, during
 * transition, the presence of x-semantic-type on the target schema.
 *
 * Heuristic implemented here (lightweight, no deep $ref resolution):
 *  - If the property schema is an inline primitive string (type==='string') and the
 *    property name ends with Key, emit an error (should be $ref to a semantic key schema).
 *  - If exceptions list (space-separated) includes the property name, skip.
 *
 * We intentionally avoid deep resolution here to keep rule inexpensive; a separate
 * rule / later pass can validate that the referenced schema actually carries the
 * semantic key vendor extension.
 */
module.exports = function (input, options, contexts) {
  const path = contexts.path;

  if (path.length >= 2 && path[path.length - 2] === 'properties') {
    const propertyName = path[path.length - 1];
    if (!/Key$/.test(propertyName)) return; // only enforce *Key properties

    if (options) {
      const exceptions = options.exceptions.split(' ').filter(Boolean);
      if (exceptions.includes(propertyName)) return;
    }

    // If it's an inline primitive, require ref usage instead
    if (input && typeof input === 'object' && input.type === 'string' && !('$ref' in input)) {
      return [{
        message: `Property '${path.join('.')}' must use $ref to a semantic key schema (marked with x-semantic-key or x-semantic-type), not an inline primitive string.`,
      }];
    }
  }
};