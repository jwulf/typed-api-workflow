/**
 * Ensures presence of required header param when mechanism=idempotency-key.
 * Supports mechanism declared either directly on the operation (vendor extension)
 * or inside the x-operation-kind metadata object.
 */
module.exports = (targetVal, _opts, ctx) => {
  if (!targetVal || typeof targetVal !== 'object') return [];

  // Prefer operation-level vendor extension first.
  let mech = targetVal['x-idempotency-mechanism'];
  let hdrName = targetVal['x-idempotency-key-header'];

  // Fallback: look inside x-operation-kind extension structure (object or array with $ref + overrides)
  if (!mech) {
    const opKindExt = targetVal['x-operation-kind'];
    if (opKindExt) {
      const metaObjects = Array.isArray(opKindExt) ? opKindExt : [opKindExt];
      for (const m of metaObjects) {
        if (m && typeof m === 'object') {
          if (!mech && m.idempotencyMechanism) mech = m.idempotencyMechanism;
          if (!hdrName && m.idempotencyKeyHeader) hdrName = m.idempotencyKeyHeader;
        }
      }
    }
  }

  if (mech !== 'idempotency-key') return [];

  const expectedHeader = hdrName || 'Idempotency-Key';
  const params = targetVal.parameters || [];

  const hasHeader = params.some(
    (p) => p && p.in === 'header' && p.name === expectedHeader
  );

  if (!hasHeader) {
    return [
      {
        message: `Idempotency mechanism requires header parameter '${expectedHeader}'`,
        path: ctx.path.concat(['parameters'])
      }
    ];
  }
  return [];
};
