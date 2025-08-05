/**
 * This function ensures that only our allowed vendor extensions are used. 
 * This ensures that we don't have misspelt vendor extensions. 
 */
function vendorExtensionWhitelist(targetVal, opts) {
  const allowedExtensions = opts.allowedExtensions || [];
  const results = [];

  function traverseObject(obj, path = []) {
    if (obj && typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = [...path, key];
        
        // Check if this is a vendor extension
        if (key.startsWith('x-') && !allowedExtensions.includes(key)) {
          results.push({
            message: `Vendor extension '${key}' is not in the approved whitelist. Allowed extensions: ${allowedExtensions.join(', ')}`,
            path: currentPath
          });
        }
        
        // Recursively check nested objects/arrays
        if (typeof value === 'object' && value !== null) {
          traverseObject(value, currentPath);
        }
      }
    }
  }

  traverseObject(targetVal);
  return results;
}

module.exports = vendorExtensionWhitelist;
