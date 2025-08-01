/**
 * This is a custom Spectral function that checks if properties ending with 'Key' are defined correctly.
 * It ensures that such properties use a $ref to a schema that extends CamundaKey,
 * rather than using a primitive type like 'string'.
 */
module.exports = function (input, options, contexts) {
  const path = contexts.path;

  if (path.length >= 2 && path[path.length - 2] === 'properties') {
    // If the last item is included in the excluded options, skip validation
    if (options) {
      const exceptions = options.exceptions.split(' ');
      if (Array.isArray(exceptions) && exceptions.length > 0 && exceptions.includes(path[path.length - 1])) {
        return;
      }
    }
    // The second-to-last item is 'properties', so this is not a type definition
    if (input.type === 'string') {
      return [{
        message: `Property '${path.join('.')}' must use $ref, not a primitive type. This is a CamundaKey property, so it must reference a schema that extends CamundaKey.`,
      }];
    }
  }
};