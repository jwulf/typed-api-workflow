/**
 * This file is an enhanced version of camunda/camunda-docs/api/camunda/generation-strategy.js 
 * It supports the the transform of the new spec for docs. 
 * It strips out the constraint metadata for the CamundaKey types, adds eventually consistent admonitions, and removes vendor extensions.
 */

const removeDuplicateVersionBadge = require("../remove-duplicate-version-badge");
const fs = require("fs");
const yaml = require("js-yaml");

function preGenerateDocs(config) {
  const originalSpec = fs.readFileSync(config.specPath, "utf8");

  console.log("adjusting C8 spec file...");

  // Apply transforms cumulatively in order, passing the current spec to each.
  // Previously, each helper received the original spec and produced a full-document
  // replacement, causing later steps to overwrite earlier ones (e.g., flattening).
  let updatedSpec = originalSpec;

  for (const update of addDisclaimer(updatedSpec)) {
    updatedSpec = updatedSpec.replace(update.from, update.to);
  }
  for (const update of addAlphaAdmonition()) {
    updatedSpec = updatedSpec.replace(update.from, update.to);
  }
  for (const update of addFrequentlyLinkedDocs(config.version)) {
    updatedSpec = updatedSpec.replace(update.from, update.to);
  }
  for (const update of flattenPathParams(updatedSpec)) {
    updatedSpec = updatedSpec.replace(update.from, update.to);
  }
  for (const update of stripCamundaKeyConstraintsForDocs(updatedSpec)) {
    updatedSpec = updatedSpec.replace(update.from, update.to);
  }

  fs.writeFileSync(config.specPath, updatedSpec);

  // Add eventual consistency admonitions based on vendor extension `x-eventually-consistent: true`
  addEventualConsistencyAdmonition(config.specPath);

  // This must happen after eventual consistency admonitions (and any other transforms that need vendor extensions)
  // Remove all vendor extensions. Docusaurus does not like them. See: https://github.com/PaloAltoNetworks/docusaurus-openapi-docs/issues/891
  removeVendorExtensions(config.specPath);
}

// This will break if the specification title is changed
function postGenerateDocs(config) {
  removeDuplicateVersionBadge(
    `${config.outputDir}/orchestration-cluster-api.info.mdx`
  );
  // Replace consistency marker tokens with MDX components and add imports
  replaceConsistencyMarkersWithComponents(config.outputDir);
  console.log(`✅ Added eventual consistency admonitions`);
}

function addDisclaimer(originalSpec) {
  // Make this a repeatable task by checking if it's run already.
  if (
    originalSpec.includes(
      "Disclaimer: This is a modified version of the Camunda REST API specification, optimized for the documentation."
    )
  ) {
    console.log("skipping addDisclaimer...");
    return [];
  }

  // Adds a disclaimer to the very beginning of the file, so that people know this isn't the true spec.
  return [
    {
      from: /^/,
      to: `# Disclaimer: This is a modified version of the Camunda REST API specification, optimized for the documentation.

`,
    },
  ];
}

function addAlphaAdmonition() {
  // This task is inherently repeatable, because the `match` is replaced by something that won't match again.

  return [
    {
      // Matches an empty line, followed by an alpha warning, with these capture groups:
      //  $1: the blank line before the warning
      //  $2: the indentation before the warning
      //  $3: the warning text
      from: /^([^\S\n]*\n)([^\S\n]*)(This endpoint is an alpha feature and may be subject to change\n[\s]*in future releases.\n)/gm,

      // Surrounds the warning with `:::note` and `:::`, creating an admonition.
      to: "$1$2:::note\n$2$3$2:::\n",
    },
  ];
}

function addFrequentlyLinkedDocs(version) {
  // This task is inherently repeatable, because the `match` is replaced by something that won't match again.

  // The path to the alpha doc varies by version.
  const otherAlphaPaths = {
    8.6: "/reference/alpha-features.md",
    8.5: "/reference/alpha-features.md",
    8.4: "/reference/alpha-features.md",
    8.3: "/reference/alpha-features.md",
  };
  const alphaPath =
    otherAlphaPaths[version] ||
    "/components/early-access/alpha/alpha-features.md";

  // Adds links to the Camunda Alpha REST API documentation, so that they don't have to live in the upstream spec.
  return [
    {
      from: /The Orchestration cluster API \(REST\) Overview page/g,
      to: "The [Orchestration cluster API (REST) Overview page](/apis-tools/orchestration-cluster-api-rest/orchestration-cluster-api-rest-overview.md#query-api)",
    },
    {
      from: /endpoint is an alpha feature/g,
      to: `endpoint is an [alpha feature](${alphaPath})`,
    },
  ];
}

// Make path parameters more readable by flattening them into inline primitive types, so they display as `string<ProcessInstanceKey>` instead of `object`.
// Flattens $ref-based path parameter schemas into inline primitive types
// by resolving one level of allOf inheritance. Preserves format, pattern, and description.
// This is necessary because the Camunda REST API uses schema inheritance to express domain types for
// Camunda keys, which results in a complex schema structure
//   e.g. { $ref: "#/components/schemas/ProcessInstanceKey" },
//          allOf: [ { $ref: "#/components/schemas/CamundaKey
// If we don't flatten this, the docs say it is a complex object, which is not true.
// We also modify the format to include the schema name, so that it is clear what domain type it is.
//   e.g. format: "string<ProcessInstanceKey>"
// Otherwise Docusaurus will not render the type correctly, and it will be displayed as the generic `Camunda Key`
function flattenPathParams(originalSpec) {
  const doc = yaml.load(originalSpec);

  const schemas = doc.components?.schemas || {};

  // Traverse all paths and operations
  for (const path of Object.values(doc.paths || {})) {
    for (const operation of Object.values(path)) {
      const parameters = operation.parameters;
      if (!Array.isArray(parameters)) continue;

      for (const param of parameters) {
        if (param.schema && param.schema.$ref) {
          const ref = param.schema.$ref;
          const match = ref.match(/^#\/components\/schemas\/(.+)$/);
          if (!match) continue;

          const schemaName = match[1];
          const schema = schemas[schemaName];
          if (!schema || !schema.allOf) continue;

          // Flatten one level of allOf: [ {$ref}, {description} ]
          const refSchema = schema.allOf.find((entry) => entry.$ref);
          const extraProps = schema.allOf.find(
            (entry) => entry.description || entry.type
          );

          const baseMatch = refSchema?.$ref?.match(
            /^#\/components\/schemas\/(.+)$/
          );
          if (!baseMatch) continue;

          const baseSchema = schemas[baseMatch[1]];
          if (!baseSchema) continue;

          // Merge baseSchema + extraProps
          const merged = {
            type: baseSchema.type,
            format: `string<${schemaName}>`, // baseSchema.format,
            pattern: baseSchema.pattern,
            example: baseSchema.example,
            minLength: baseSchema.minLength,
            maxLength: baseSchema.maxLength,
            description: extraProps?.description || baseSchema.description,
          };

          // Replace the $ref schema with the flattened one
          param.schema = merged;
        }
      }
    }
  }

  return [
    {
      from: /[\s\S]*/, // match entire document
      to: yaml.dump(doc, { lineWidth: -1 }), // prevent line wrapping
    },
  ];
}

/**
 * Get rid of the constraints on CamundaKey schemas. We don't want to clutter the docs with these constraints,
 * but we do want them to be present in the schema for validation purposes.
 */
function stripCamundaKeyConstraintsForDocs(originalSpec) {
  const doc = yaml.load(originalSpec);

  const camundaKey = doc.components?.schemas?.CamundaKey;
  if (camundaKey) {
    delete camundaKey.pattern;
    delete camundaKey.minLength;
    delete camundaKey.maxLength;
  }

  return [
    {
      from: /[\s\S]*/, // match entire document
      to: yaml.dump(doc, { lineWidth: -1 }),
    },
  ];
}

/**
 * Add a documentation note for eventual consistency to all endpoints that need it.
 */
function addEventualConsistencyAdmonition(specFilePath) {

  const EVENTUAL_CONSISTENCY_VENDOR_EXTENSION='x-eventually-consistent'
  try {
    // Read and parse the YAML file
    const fileContents = fs.readFileSync(specFilePath, 'utf8');
    const spec = yaml.load(fileContents);
    let admonitionsAdded = 0
    // Process each path and operation for eventual consistency
    if (spec.paths) {
      Object.keys(spec.paths).forEach(pathKey => {
        const pathItem = spec.paths[pathKey];


        Object.keys(pathItem).forEach(method => {
          const operation = pathItem[method];

          // Skip non-operation properties (like x-eventually-consistent, parameters, etc.)
          if (!operation || typeof operation !== 'object' || !['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'].includes(method)) {
            return;
          }

          // Check if this operation has the eventual consistency marker (either on the operation or inherited from path)
          const operationHasEventualConsistency = operation[EVENTUAL_CONSISTENCY_VENDOR_EXTENSION] === true;

          const operationHasStrongConsistency = operation[EVENTUAL_CONSISTENCY_VENDOR_EXTENSION] === false;

          const token = operationHasEventualConsistency ? '\n\n[[CONSISTENCY:EVENTUAL]]\n\n' : operationHasStrongConsistency ? '\n\n[[CONSISTENCY:STRONG]]\n\n' : '';
          if (operation.description) {
            operation.description = token + operation.description;
            } else {
              operation.description = token.trim();
            }
            admonitionsAdded++
        });
      });
    }

    // Write the updated spec back to the file
    const updatedYaml = yaml.dump(spec, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
    fs.writeFileSync(specFilePath, updatedYaml, 'utf8');

    console.log(`✅ Added ${admonitionsAdded} eventual consistency admonitions`);
  } catch (error) {
    console.error('❌ Error processing eventual consistency:', error);
  }
}

// Remove all vendor extensions recursively (x-eventually-consistent, x-semantic-type, etc.)
function removeVendorExtensions(specFilePath) {
  function recursivelyRemoveVendorExtension(obj) {
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        obj.forEach(item => recursivelyRemoveVendorExtension(item));
      } else {
        Object.keys(obj).forEach(key => {
          if (key.startsWith('x-')) {
            delete obj[key];
          } else {
            recursivelyRemoveVendorExtension(obj[key]);
          }
        });
      }
    }
  }

  try {
    // Read and parse the YAML file
    const fileContents = fs.readFileSync(specFilePath, 'utf8');
    const spec = yaml.load(fileContents);

    recursivelyRemoveVendorExtension(spec)

    // Write the updated spec back to the file
    const updatedYaml = yaml.dump(spec, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
    fs.writeFileSync(specFilePath, updatedYaml, 'utf8');

    console.log('✅ Removed all vendor extensions');
  } catch (error) {
    console.error('❌ Error removing vendor extensions:', error);
  }
}

module.exports = {
  preGenerateDocs,
  postGenerateDocs,
};

// ---- Helpers to replace placeholder tokens with MDX components in generated files ----
function replaceConsistencyMarkersWithComponents(outputDir) {
  try {
    const fs = require('fs');

    const files = listFilesRecursive(outputDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      const hasEC = content.includes('[[CONSISTENCY:EVENTUAL]]');
      const hasSC = content.includes('[[CONSISTENCY:STRONG]]');
      if (!hasEC && !hasSC) continue;

      let updated = content;
      // Ensure imports exist (insert after frontmatter if present)
      const importEC = "import MarkerEventuallyConsistentExtension from '@site/src/mdx/MarkerEventuallyConsistentExtension';";
      const importSC = "import MarkerStronglyConsistentExtension from '@site/src/mdx/MarkerStronglyConsistentExtension';";

      const lines = updated.split('\n');
      let insertIdx = 0;
      if (lines[0] && lines[0].startsWith('---')) {
        // Skip frontmatter
        const endIdx = lines.indexOf('---', 1);
        insertIdx = endIdx >= 0 ? endIdx + 1 : 0;
      }
      const alreadyHasEC = updated.includes(importEC);
      const alreadyHasSC = updated.includes(importSC);
      const importsToAdd = [];
      if (hasEC && !alreadyHasEC) importsToAdd.push(importEC);
      if (hasSC && !alreadyHasSC) importsToAdd.push(importSC);
      if (importsToAdd.length) {
        lines.splice(insertIdx, 0, ...importsToAdd, '');
        updated = lines.join('\n');
      }

      // Replace tokens with components
      if (hasEC) {
        updated = updated.replaceAll('[[CONSISTENCY:EVENTUAL]]', '<MarkerEventuallyConsistentExtension />');
      }
      if (hasSC) {
        updated = updated.replaceAll('[[CONSISTENCY:STRONG]]', '<MarkerStronglyConsistentExtension />');
      }
      if (updated !== content) fs.writeFileSync(file, updated, 'utf8');
    }
  } catch (err) {
    console.error('❌ Error replacing consistency markers in output MDX:', err);
  }
}

function listFilesRecursive(dir) {
  const fs = require('fs');
  const path = require('path');
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...listFilesRecursive(p));
    else out.push(p);
  }
  return out;
}
