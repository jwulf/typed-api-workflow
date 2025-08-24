/**
 * Ensures presence of required header param when mechanism=idempotency-key.
 */
module.exports = (targetVal, _opts, ctx) => {
  if (!targetVal || typeof targetVal !== 'object') return [];
  const mech = targetVal['x-idempotency-mechanism'];
  if (mech !== 'idempotency-key') return [];

  const expectedHeader =
    targetVal['x-idempotency-key-header'] || 'Idempotency-Key';

  const params = targetVal.parameters || [];
  const hasHeader = params.some(
    (p) =>
      p.in === 'header' &&
      (p.name === expectedHeader ||
        (p.schema && p.schema.title === expectedHeader))
  );

  if (!hasHeader) {
    return [
      {
        message: `Idempotency mechanism requires header parameter '${expectedHeader}'`,
        path: ctx.path.concat(['parameters']),
      },
    ];
  }
  return [];
};