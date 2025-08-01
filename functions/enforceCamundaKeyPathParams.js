module.exports = function (targetVal, opts, context) {
  if (!targetVal || typeof targetVal !== 'object') return;

  const path = context.path || [];

  // Ensure we are only validating schemas of path parameters
  const isPathParam = path.includes('parameters') && path.some(p => typeof p === 'object' && p.in === 'path');
  const isKeyParam = targetVal.name && /Key$/.test(targetVal.name);
  const isException = opts?.exceptions?.includes(targetVal.name);

  console.log(`Validating path parameter: ${targetVal.name}, isPathParam: ${isPathParam}, isKeyParam: ${isKeyParam}, isException: ${isException}`);
  if (isPathParam && isKeyParam && !isException) {
    const schema = targetVal.schema;
    if (!schema?.$ref) {
      return [
        {
          message: `Path parameter '${targetVal.name}' must use $ref, not a primitive type. It should reference a schema that extends CamundaKey.`,
        },
      ];
    }
  }
};
