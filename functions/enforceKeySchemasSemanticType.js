/**
 * Spectral custom function: enforce that schemas whose key (name) ends with 'Key'
 * declare the stable semantic marker `x-semantic-type` (or alternatively `x-semantic-key`).
 *
 * Rationale:
 *  - Property/path param rules only guarantee that *used* key schemas are referenced properly.
 *  - This rule ensures governance over the naming surface: any schema named *Key must
 *    explicitly declare its semantic identity, avoiding accidental plain strings named like keys.
 *
 * Whitelist / exceptions:
 *  - options.exceptions may be supplied as one of:
 *      * space separated string ("fooKey barKey")
 *      * array of names
 *      * object with keys to ignore (truthy values)
 *  - Comparison is exact against the schema property name (case sensitive, consistent with other rules).
 *
 * Behavior:
 *  - Invoked for each schema object value; we infer the schema name from contexts.path where the
 *    second-to-last segment is 'schemas'.
 *  - If name ends with 'Key' and not in exceptions list, require at least x-semantic-type OR x-semantic-key.
 *  - Prefer x-semantic-type; if only x-semantic-key present, still pass (transitional allowance).
 *
 * Performance:
 *  - Purely syntactic; no $ref resolution.
 */
module.exports = function enforceKeySchemasSemanticType(targetVal, opts, ctx) {
  const path = ctx.path || [];
  // Expect pattern: ['components','schemas','SchemaName'] when iterating values.
  if (path.length < 3) return; // Not deep enough to be a schema value.
  const maybeSchemas = path[path.length - 2];
  if (maybeSchemas !== 'schemas') return;

  const schemaName = path[path.length - 1];
  if (!/Key$/.test(schemaName)) return; // Only enforce *Key names.

  // Collect exceptions
  const rawExceptions = opts && opts.exceptions;
  let exceptionSet = new Set();
  if (rawExceptions) {
    if (typeof rawExceptions === 'string') {
      rawExceptions.split(/\s+/).filter(Boolean).forEach(e => exceptionSet.add(e));
    } else if (Array.isArray(rawExceptions)) {
      rawExceptions.forEach(e => exceptionSet.add(e));
    } else if (typeof rawExceptions === 'object') {
      Object.keys(rawExceptions).forEach(k => { if (rawExceptions[k]) exceptionSet.add(k); });
    }
  }
  if (exceptionSet.has(schemaName)) return; // Whitelisted.

  if (targetVal && typeof targetVal === 'object') {
    const hasSemanticType = Object.prototype.hasOwnProperty.call(targetVal, 'x-semantic-type');
    const hasLegacySemanticKey = Object.prototype.hasOwnProperty.call(targetVal, 'x-semantic-key');
    if (!hasSemanticType && !hasLegacySemanticKey) {
      return [{
        message: `Schema '${schemaName}' must declare x-semantic-type (or transitional x-semantic-key).`,
        path
      }];
    }
  }
};
