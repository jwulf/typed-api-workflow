/**
 * Validates structure of x-conditional-idempotency vendor extension.
 * Expected shape:
 *   keyFields: [string, ...]
 *   window: { field: string, unit: 'ms' }
 *   duplicatePolicy: 'ignore' | 'return-existing' | 'conflict'? (currently only 'ignore' makes sense, allow ignore)
 *   appliesWhen: 'key-present'
 */
function conditionalIdempotencyStructure(targetVal) {
  const results = [];
  if (!targetVal || typeof targetVal !== 'object') return results;
  const ext = targetVal['x-conditional-idempotency'];
  if (!ext) return results; // nothing to validate
  const pathBase = ['x-conditional-idempotency'];

  const push = (msg, path) => results.push({ message: msg, path });

  // keyFields
  if (!Array.isArray(ext.keyFields) || ext.keyFields.length === 0) {
    push('x-conditional-idempotency.keyFields must be a non-empty array of strings', [...pathBase, 'keyFields']);
  } else if (!ext.keyFields.every(k => typeof k === 'string' && k.trim().length)) {
    push('All keyFields entries must be non-empty strings', [...pathBase, 'keyFields']);
  }

  // window
  if (!ext.window || typeof ext.window !== 'object') {
    push('x-conditional-idempotency.window object is required', [...pathBase, 'window']);
  } else {
    if (typeof ext.window.field !== 'string' || !ext.window.field.trim()) {
      push('window.field must be a non-empty string', [...pathBase, 'window', 'field']);
    }
    if (ext.window.unit !== 'ms') {
      push("window.unit must be 'ms'", [...pathBase, 'window', 'unit']);
    }
  }

  // duplicatePolicy (restrict to ignore for now; could expand later)
  if (ext.duplicatePolicy !== 'ignore') {
    push("duplicatePolicy must be 'ignore' for conditional idempotency (repeat publishes suppressed)", [...pathBase, 'duplicatePolicy']);
  }

  if (ext.appliesWhen !== 'key-present') {
    push("appliesWhen must be 'key-present'", [...pathBase, 'appliesWhen']);
  }

  return results;
}

module.exports = conditionalIdempotencyStructure;
