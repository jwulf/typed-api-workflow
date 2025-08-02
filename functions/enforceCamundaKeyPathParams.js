module.exports = function (targetVal, opts, context) {
  if (!targetVal || typeof targetVal !== 'object') return;

  const path = context.path || [];

  // Ensure we are only validating schemas of path parameters
  const isPathParam = targetVal.in === 'path';
  const isKeyParam = targetVal.name && /Key$/.test(targetVal.name);
  const isException = opts?.exceptions?.includes(targetVal.name);

  if (isPathParam && isKeyParam && !isException) {
    const schema = targetVal.schema;
    
    // Helper function to check if a schema contains CamundaKey indicators
    const containsCamundaKey = (schemaObj) => {
      return schemaObj?.format === 'Camunda Key' || 
             schemaObj?.pattern === '^-?[0-9]+$' ||
             schemaObj?.allOf?.some(item => item.format === 'Camunda Key' || item.pattern === '^-?[0-9]+$');
    };
    
    // Check if the schema indicates it's a CamundaKey (direct, allOf, or oneOf)
    const isCamundaKey = containsCamundaKey(schema) ||
                         schema?.oneOf?.some(option => containsCamundaKey(option));
    
    if (!isCamundaKey) {
      return [
        {
          message: `Path parameter '${targetVal.name}' must use $ref, not a primitive type. It should reference a schema that extends CamundaKey.`,
        },
      ];
    }
  }
};
