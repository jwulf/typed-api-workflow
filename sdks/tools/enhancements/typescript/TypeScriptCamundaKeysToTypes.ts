import { OpenAPIV3 } from 'openapi-types';
import * as fs from 'fs';
import * as path from 'path';

export interface SemanticType {
  name: string;
  description: string;
  pattern: string | null;
  minLength?: number;
  maxLength?: number;
}

/**
 * Converts CamundaKeys into nominal types.
 */
export class TypeScriptCamundaKeysToTypes {
  name = 'TypeScriptCamundaKeysToTypes'
  private semanticTypes: Map<string, SemanticType>;

  constructor(semanticTypes: Map<string, SemanticType>) {
    this.semanticTypes = semanticTypes;
  }

  enhanceTypeScript(sdkPath: string) {
    const typesCode = this.generateTypeScriptTypes();
    const typesFilePath = path.join(sdkPath, 'semanticTypes.ts');
    fs.writeFileSync(typesFilePath, typesCode);
    
    this.updateTypeScriptModels(sdkPath);
    this.updateTypeScriptIndex(sdkPath);
    this.enhanceObjectSerializer(sdkPath);
    
    console.log(`  ✓ Created ${typesFilePath}`);
  }

  generateTypeScriptTypes() {
    let code = '// Auto-generated semantic types using CamundaKey pattern for true nominal typing\n\n';
    
    // Add the base CamundaKey interface
    code += '/**\n';
    code += ' * Base interface for nominal typing of Camunda domain values.\n';
    code += ' * This prevents accidental assignment between different semantic types.\n';
    code += ' */\n';
    code += 'interface CamundaKey<T> extends String {\n';
    code += '  readonly __type: T;\n';
    code += '}\n\n';
    
    const allTypes = Array.from(this.semanticTypes.entries());
    for (const [name, type] of allTypes) {
      code += `/**\n * ${type.description}\n */\n`;
      code += `export type ${name} = CamundaKey<'${name}'>;\n\n`;
      
      code += `export namespace ${name} {\n`;
      if (type.pattern) {
        code += `  // Expose compiled validation pattern for reuse\n`;
        code += `  export const pattern = /${type.pattern}/;\n\n`;
      }
      code += `  /**\n   * Create a new ${name} with validation\n   */\n`;
      code += `  export function create(value: string): ${name} {\n`;
      code += `    if (!isValid(value)) {\n`;
      code += `      throw new Error(\`Invalid ${name}: \${value}\`);\n`;
      code += `    }\n`;
      code += `    const branded = Object.assign(new String(value), { __type: '${name}' as const });\n`;
      code += `    return branded as unknown as ${name};\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Get the string value of a ${name}\n   */\n`;
      code += `  export function getValue(key: ${name}): string {\n`;
      code += `    if (!key || typeof key !== 'object' || (key as any).__type !== '${name}') {\n`;
      code += `      throw new Error(\`Invalid ${name}: expected object with __type='${name}', got \${(key as any)?.__type}\`);\n`;
      code += `    }\n`;
      code += `    return String(key);\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Compare two ${name} instances for equality\n   */\n`;
      code += `  export function equals(a: ${name}, b: ${name}): boolean {\n`;
      code += `    return String(a) === String(b);\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Validate a string value for ${name}\n   */\n`;
      code += `  export function isValid(value: string): boolean {\n`;
      code += `    if (!value) return false;\n`;
      if (type.pattern) {
        code += `    if (!/${type.pattern}/.test(value)) return false;\n`;
      }
      if (type.minLength !== undefined) {
        code += `    if (value.length < ${type.minLength}) return false;\n`;
      }
      if (type.maxLength !== undefined) {
        code += `    if (value.length > ${type.maxLength}) return false;\n`;
      }
      code += `    return true;\n`;
      code += `  }\n`;

      code += `}\n\n`;
    }
    // Export a small registry for generic access
    code += 'export const SemanticRegistry = {\n';
    for (const [name, type] of allTypes) {
      const parts: string[] = [
        `  ${name}: { isValid: ${name}.isValid, create: ${name}.create, getValue: ${name}.getValue`,
      ];
      if (type.pattern) parts.push(`pattern: ${name}.pattern`);
      if (type.minLength !== undefined) parts.push(`minLength: ${type.minLength}`);
      if (type.maxLength !== undefined) parts.push(`maxLength: ${type.maxLength}`);
      code += parts.join(', ') + ' },\n';
    }
    code += '} as const;\n\n';

    return code;
  }

  updateTypeScriptModels(sdkPath: string) {
    const modelsDir = path.join(sdkPath, 'model');
    if (!fs.existsSync(modelsDir)) {
      console.log(`  ! Models directory not found: ${modelsDir}`);
      return;
    }
    
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
    
    for (const file of files) {
      const filePath = path.join(modelsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      // Fix any incorrect semantic type imports first
      changed = this.fixIncorrectSemanticTypeImports(content, filePath) || changed;
      content = fs.readFileSync(filePath, 'utf8'); // Re-read after potential fixes
      
      // First, replace property declarations and attributeTypeMap entries
      for (const typeName of Array.from(this.semanticTypes.keys())) {
        // Convert PascalCase to camelCase for property matching
        const camelCaseTypeName = typeName.charAt(0).toLowerCase() + typeName.slice(1);
        
        // Replace property declarations - handle both single quotes and double quotes
        // Check both PascalCase and camelCase versions
        const patterns = [
          // PascalCase patterns (e.g., 'ProcessDefinitionKey')
          new RegExp(`'(\\w*${typeName})'\\??: string`, 'g'),
          new RegExp(`"(\\w*${typeName})"\\??: string`, 'g'),
          new RegExp(`'(\\w*${typeName})': string`, 'g'),
          new RegExp(`"(\\w*${typeName})": string`, 'g'),
          new RegExp(`'(\\w*${typeName})'\\??: any`, 'g'),
          new RegExp(`"(\\w*${typeName})"\\??: any`, 'g'),
          // camelCase patterns (e.g., 'processDefinitionKey')
          new RegExp(`'(\\w*${camelCaseTypeName})'\\??: string`, 'g'),
          new RegExp(`"(\\w*${camelCaseTypeName})"\\??: string`, 'g'),
          new RegExp(`'(\\w*${camelCaseTypeName})': string`, 'g'),
          new RegExp(`"(\\w*${camelCaseTypeName})": string`, 'g'),
          new RegExp(`'(\\w*${camelCaseTypeName})'\\??: any`, 'g'),
          new RegExp(`"(\\w*${camelCaseTypeName})"\\??: any`, 'g'),
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            // Preserve required/optional marker when replacing the type
            content = content.replace(pattern, (match: string, propName: string) => {
              const isOptional = match.includes("?:");
              return `'${propName}'${isOptional ? '?:' : ':'} ${typeName}`;
            });
            changed = true;
          }
        }

        // Fix attributeTypeMap entries - this is critical for ObjectSerializer to work properly
        const attributeTypeMapPatterns = [
          // Match entries with "any" type that should be semantic types
          new RegExp(`(\\s*{[^}]*"name":\\s*"\\w*${camelCaseTypeName}"[^}]*"type":\\s*)"any"`, 'g'),
          new RegExp(`(\\s*{[^}]*"name":\\s*"\\w*${typeName}"[^}]*"type":\\s*)"any"`, 'g'),
          // Also match string types that should be semantic types
          new RegExp(`(\\s*{[^}]*"name":\\s*"\\w*${camelCaseTypeName}"[^}]*"type":\\s*)"string"`, 'g'),
          new RegExp(`(\\s*{[^}]*"name":\\s*"\\w*${typeName}"[^}]*"type":\\s*)"string"`, 'g'),
        ];
        
        for (const mapPattern of attributeTypeMapPatterns) {
          if (mapPattern.test(content)) {
            content = content.replace(mapPattern, `$1"${typeName}"`);
            changed = true;
          }
        }
      }
      
      // After all type replacements, add imports for semantic types that are now used
      const needsImport = Array.from(this.semanticTypes.keys()).some(typeName => 
        content.includes(`: ${typeName}`) || content.includes(`"${typeName}"`)
      );
      
      if (needsImport && !content.includes('semanticTypes')) {
        // Get all the semantic types that are actually used in this file
        const usedTypes = Array.from(this.semanticTypes.keys()).filter(typeName => 
          content.includes(`: ${typeName}`) || content.includes(`"${typeName}"`)
        );
        
        if (usedTypes.length > 0) {
          // Find the position after the last import statement
          const lines = content.split('\n');
          let insertIndex = 0;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
              insertIndex = i + 1;
            } else if (lines[i].trim() === '' && insertIndex > 0) {
              // Found an empty line after imports
              insertIndex = i;
              break;
            } else if (!lines[i].startsWith('import ') && !lines[i].startsWith('/**') && lines[i].trim() !== '' && insertIndex > 0) {
              // Found first non-import, non-comment line
              insertIndex = i;
              break;
            }
          }
          
          // Insert the import statement
          const importStatement = `import { ${usedTypes.join(', ')} } from '../semanticTypes';`;
          lines.splice(insertIndex, 0, importStatement);
          content = lines.join('\n');
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated ${file}`);
      }
    }
  }

  /**
   * Fixes incorrect semantic type imports that reference non-existent individual files
   * instead of the centralized semanticTypes.ts
   */
  private fixIncorrectSemanticTypeImports(content: string, filePath: string): boolean {
    let changed = false;
    let updatedContent = content;
    
    // Check for any semantic type imports that reference individual files
    const incorrectImports: string[] = [];
    const referencedTypes: string[] = [];
    
    for (const semanticType of Array.from(this.semanticTypes.keys())) {
      // Look for various import patterns for this semantic type
      const patterns = [
        new RegExp(`import \\{ ${semanticType} \\} from '\\./.*${semanticType.toLowerCase()}';`, 'gi'),
        new RegExp(`import \\{ ${semanticType} \\} from '\\.\/${semanticType.toLowerCase()}';`, 'gi'),
        new RegExp(`import \\{ ${semanticType} \\} from '\\.\\\/${semanticType.toLowerCase()}';`, 'gi')
      ];
      
      for (const pattern of patterns) {
        const matches = updatedContent.match(pattern);
        if (matches) {
          incorrectImports.push(...matches);
          if (!referencedTypes.includes(semanticType)) {
            referencedTypes.push(semanticType);
          }
          changed = true;
        }
      }
    }
    
    // Remove all incorrect imports
    for (const incorrectImport of incorrectImports) {
      updatedContent = updatedContent.replace(incorrectImport, '');
    }
    
    // Clean up any empty lines left by removed imports
    updatedContent = updatedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // If we removed imports, add the correct import
    if (changed && referencedTypes.length > 0) {
      // Add the correct import at the top
      const importStatement = `import { ${referencedTypes.join(', ')} } from '../semanticTypes';`;
      
      // Find where to insert the import (after existing imports)
      const lines = updatedContent.split('\n');
      let insertIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') || lines[i].startsWith('import{')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '' && insertIndex > 0) {
          // Found empty line after imports
          break;
        } else if (!lines[i].startsWith('import ') && !lines[i].startsWith('/*') && 
                   !lines[i].startsWith(' *') && !lines[i].startsWith('*/') && 
                   lines[i].trim() !== '' && insertIndex > 0) {
          // Found non-import, non-comment line
          break;
        }
      }
      
      // Insert the import
      lines.splice(insertIndex, 0, importStatement);
      updatedContent = lines.join('\n');
      
      fs.writeFileSync(filePath, updatedContent);
      console.log(`  ✓ Fixed semantic type imports in ${path.basename(filePath)}`);
    }
    
    return changed;
  }

  enhanceObjectSerializer(sdkPath: string) {
    const modelsPath = path.join(sdkPath, 'model/models.ts');
    if (!fs.existsSync(modelsPath)) {
      console.log(`  ! Models file not found: ${modelsPath}`);
      return;
    }

    let content = fs.readFileSync(modelsPath, 'utf8');
    
    // Check if we've already enhanced the ObjectSerializer
    if (content.includes('// Semantic type handling')) {
      console.log(`  ✓ ObjectSerializer already enhanced`);
  return;
    }

    // Add or merge import for semantic types at the top
    const semanticTypeNames = Array.from(this.semanticTypes.keys());
    
    // Check if semantic types import already exists and merge if needed
    const existingImportRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]\.\.\/semanticTypes['"]/;
    const existingMatch = content.match(existingImportRegex);
    
    if (existingMatch) {
      // Parse existing imports
      const existingImports = existingMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0);
      
      // Merge with new semantic types (remove duplicates)
      const allImports = [...new Set([...existingImports, ...semanticTypeNames])];
      const mergedImportStatement = `import { ${allImports.join(', ')} } from '../semanticTypes';`;
      
      // Replace the existing import
      content = content.replace(existingImportRegex, mergedImportStatement + '\n');
    } else {
      // Insert new import after existing imports
      const semanticTypeImports = semanticTypeNames.join(', ');
      const importStatement = `import { ${semanticTypeImports} } from '../semanticTypes';\n`;
      
      const importMatch = content.match(/^(import.*?\n)+/m);
      if (importMatch && importMatch.index !== undefined) {
        const lastImportIndex = importMatch.index + importMatch[0].length;
        content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
      } else {
        content = importStatement + content;
      }
    }

  // Discover alias unions in generated models so we can handle them at runtime
  const aliasUnions = this.discoverAliasUnions(path.join(sdkPath, 'model'));

  // Enhance serialize method
  const serializeEnhancement = this.generateSerializeEnhancement(aliasUnions);
    content = content.replace(
      /(public static serialize\(data: any, type: string\): any \{\s*if \(data == undefined\) \{\s*return data;\s*\})/,
      `$1${serializeEnhancement}`
    );

    // Enhance deserialize method  
    const deserializeEnhancement = this.generateDeserializeEnhancement();
    content = content.replace(
      /(public static deserialize\(data: any, type: string\): any \{\s*\/\/ polymorphism may change the actual type\.\s*type = ObjectSerializer\.findCorrectType\(data, type\);\s*if \(data == undefined\) \{\s*return data;\s*\})/,
      `$1${deserializeEnhancement}`
    );

    fs.writeFileSync(modelsPath, content);
    console.log(`  ✓ Enhanced ObjectSerializer with semantic type support`);
  }

  /**
   * Generate the serialize enhancement, including:
   * - Alias union handling (e.g., SearchQueryPageRequest) detected from model files
   * - Safer union handling that avoids picking the wrong branch by checking for extraneous keys
   * - Semantic type handling for all discovered semantic types
   */
  generateSerializeEnhancement(aliasUnions: Record<string, string[]>): string {
    const semanticTypeNames = Array.from(this.semanticTypes.keys());
    let enhancement = '\n        // Handle alias union types detected from the generated models (e.g., StrictUnion<A | B>)\n';
    for (const [alias, variants] of Object.entries(aliasUnions)) {
      enhancement += `        else if (type === "${alias}" && data && typeof data === 'object') {\n`;
      enhancement += `            const unionTypes = [${variants.map(v => `"${v}"`).join(', ')}];\n`;
      enhancement += `            let lastError: Error | null = null;\n`;
      enhancement += `            for (const unionType of unionTypes) {\n`;
      enhancement += `                try {\n`;
      enhancement += `                    // Skip union candidates that don't match the shape (extraneous keys)\n`;
      enhancement += `                    if (typeMap[unionType]) {\n`;
      enhancement += `                        const attributeTypes = typeMap[unionType].getAttributeTypeMap();\n`;
      enhancement += `                        const allowed = new Set(attributeTypes.map((a: any) => a.name));\n`;
      enhancement += `                        const dataKeys = Object.keys(data);\n`;
      enhancement += `                        const hasExtraneous = dataKeys.some(k => !allowed.has(k));\n`;
      enhancement += `                        if (hasExtraneous) {\n`;
      enhancement += `                            continue;\n`;
      enhancement += `                        }\n`;
      enhancement += `                    }\n`;
      enhancement += `                    return ObjectSerializer.serialize(data, unionType);\n`;
      enhancement += `                } catch (error) {\n`;
      enhancement += `                    lastError = error as Error;\n`;
      enhancement += `                }\n`;
      enhancement += `            }\n`;
      enhancement += `            throw new Error(\`No valid union type found for alias ${alias}. Last error: \${lastError?.message}.\`);\n`;
      enhancement += `        }\n`;
    }

    // Fallback: ensure SearchQueryPageRequest is handled even if not detected yet (pipeline order)
    if (!aliasUnions["SearchQueryPageRequest"]) {
      const variants = ["OffsetPagination", "CursorForwardPagination", "CursorBackwardPagination"];
      enhancement += `        else if (type === "SearchQueryPageRequest" && data && typeof data === 'object') {\n`;
      enhancement += `            const unionTypes = [${variants.map(v => `"${v}"`).join(', ')}];\n`;
      enhancement += `            // Try to discriminate by keys first\n`;
      enhancement += `            if (Object.prototype.hasOwnProperty.call(data, 'after')) {\n`;
      enhancement += `                return ObjectSerializer.serialize(data, "CursorForwardPagination");\n`;
      enhancement += `            } else if (Object.prototype.hasOwnProperty.call(data, 'before')) {\n`;
      enhancement += `                return ObjectSerializer.serialize(data, "CursorBackwardPagination");\n`;
      enhancement += `            }\n`;
      enhancement += `            let lastError: Error | null = null;\n`;
      enhancement += `            for (const unionType of unionTypes) {\n`;
      enhancement += `                try {\n`;
      enhancement += `                    if (typeMap[unionType]) {\n`;
      enhancement += `                        const attributeTypes = typeMap[unionType].getAttributeTypeMap();\n`;
      enhancement += `                        const allowed = new Set(attributeTypes.map((a: any) => a.name));\n`;
      enhancement += `                        const dataKeys = Object.keys(data);\n`;
      enhancement += `                        const hasExtraneous = dataKeys.some(k => !allowed.has(k));\n`;
      enhancement += `                        if (hasExtraneous) {\n`;
      enhancement += `                            continue;\n`;
      enhancement += `                        }\n`;
      enhancement += `                    }\n`;
      enhancement += `                    return ObjectSerializer.serialize(data, unionType);\n`;
      enhancement += `                } catch (error) {\n`;
      enhancement += `                    lastError = error as Error;\n`;
      enhancement += `                }\n`;
      enhancement += `            }\n`;
      enhancement += `            throw new Error(\`No valid union type found for alias SearchQueryPageRequest. Last error: \${lastError?.message}.\`);\n`;
      enhancement += `        }\n`;
    }

    enhancement += '        // Handle inline union types with proper validation for both semantic types and complex objects\n';
    enhancement += '        else if (type.includes(\'|\') && data && typeof data === \'object\') {\n';
    enhancement += '            const unionTypes = type.split(\' | \').map(t => t.trim());\n';
    enhancement += '            \n';
    enhancement += '            // If data has __type, validate semantic type directly\n';
    enhancement += '            if (data.__type) {\n';
    enhancement += '                const actualType = data.__type;\n';
    enhancement += '                if (unionTypes.includes(actualType)) {\n';
    enhancement += '                    return ObjectSerializer.serialize(data, actualType);\n';
    enhancement += '                } else {\n';
    enhancement += '                    throw new Error(`Invalid union type: got ${actualType} but expected ${type}`);\n';
    enhancement += '                }\n';
    enhancement += '            }\n';
    enhancement += '            \n';
    enhancement += '            // For complex objects without __type, try each union type until one succeeds (skip mismatched shapes)\n';
    enhancement += '            let lastError: Error | null = null;\n';
    enhancement += '            for (const unionType of unionTypes) {\n';
    enhancement += '                try {\n';
    enhancement += '                    if (typeMap[unionType]) {\n';
    enhancement += '                        const attributeTypes = typeMap[unionType].getAttributeTypeMap();\n';
    enhancement += '                        const allowed = new Set(attributeTypes.map((a: any) => a.name));\n';
    enhancement += '                        const dataKeys = Object.keys(data);\n';
    enhancement += '                        const hasExtraneous = dataKeys.some(k => !allowed.has(k));\n';
    enhancement += '                        if (hasExtraneous) {\n';
    enhancement += '                            continue;\n';
    enhancement += '                        }\n';
    enhancement += '                    }\n';
    enhancement += '                    return ObjectSerializer.serialize(data, unionType);\n';
    enhancement += '                } catch (error) {\n';
    enhancement += '                    lastError = error as Error;\n';
    enhancement += '                    // Continue to next union type\n';
    enhancement += '                }\n';
    enhancement += '            }\n';
    enhancement += '            \n';
    enhancement += '            // If no union type worked, throw the last error with context\n';
    enhancement += '            throw new Error(`No valid union type found for data. Last error: ${lastError?.message}. Expected: ${type}`);\n';
    enhancement += '        }\n';
    enhancement += '        // Semantic type handling - convert branded types to strings for JSON\n';
    
    for (const typeName of semanticTypeNames) {
      enhancement += `        else if (type === "${typeName}") {\n`;
      enhancement += `            // Allow passing either the branded type or a raw string; validate raw strings locally (configurable)\n`;
      enhancement += `            const __vmode = (typeof process !== 'undefined' && (process as any).env && (process as any).env.CAMUNDA_SDK_VALIDATION) || 'strict';\n`;
      enhancement += `            if (__vmode === 'none') {\n`;
      enhancement += `                // Skip validation entirely\n`;
      enhancement += `                return typeof data === 'string' ? data : ${typeName}.getValue(data as ${typeName});\n`;
      enhancement += `            }\n`;
      enhancement += `            if (typeof data === 'string') {\n`;
      enhancement += `                try {\n`;
      enhancement += `                    return ${typeName}.getValue(${typeName}.create(data as string));\n`;
      enhancement += `                } catch (e) {\n`;
      enhancement += `                    if (__vmode === 'warn') {\n`;
      enhancement += `                        if (typeof console !== 'undefined' && console.warn) { console.warn('Semantic validation failed for ${typeName}:', String(e)); }\n`;
      enhancement += `                        return data;\n`;
      enhancement += `                    }\n`;
      enhancement += `                    throw e;\n`;
      enhancement += `                }\n`;
      enhancement += `            }\n`;
      enhancement += `            return ${typeName}.getValue(data as ${typeName});\n`;
      enhancement += `        }\n`;
    }
    
    return enhancement;
  }

  generateDeserializeEnhancement(): string {
    const semanticTypeNames = Array.from(this.semanticTypes.keys());
    let enhancement = '\n        // Semantic type handling - convert JSON strings to branded types\n';
    
    for (const typeName of semanticTypeNames) {
      enhancement += `        else if (type === "${typeName}") {\n`;
      enhancement += `            const __vmode = (typeof process !== 'undefined' && (process as any).env && (process as any).env.CAMUNDA_SDK_VALIDATION) || 'strict';\n`;
      enhancement += `            if (__vmode === 'none') { return data as string; }\n`;
      enhancement += `            try {\n`;
      enhancement += `                return ${typeName}.create(data as string);\n`;
      enhancement += `            } catch (e) {\n`;
      enhancement += `                if (__vmode === 'warn') {\n`;
      enhancement += `                    if (typeof console !== 'undefined' && console.warn) { console.warn('Semantic validation failed for ${typeName} (deserialize):', String(e)); }\n`;
      enhancement += `                    return data as string;\n`;
      enhancement += `                }\n`;
      enhancement += `                throw e;\n`;
      enhancement += `            }\n`;
      enhancement += `        }\n`;
    }
    
    return enhancement;
  }

  updateTypeScriptIndex(sdkPath: string) {
    // Check for both index.ts and api.ts (OpenAPI Generator uses api.ts)
    const possibleEntryFiles = ['index.ts', 'api.ts'];
    
    for (const entryFile of possibleEntryFiles) {
      const entryPath = path.join(sdkPath, entryFile);
      if (fs.existsSync(entryPath)) {
        let content = fs.readFileSync(entryPath, 'utf8');
        if (!content.includes('semanticTypes')) {
          // Add semantic types export
          const exportLine = '\n// Semantic types for nominal typing\nexport * from \'./semanticTypes\';\n';
          
          // For api.ts, insert after model exports but before eventuality enhancements
          if (entryFile === 'api.ts' && content.includes('// Eventuality enhancements')) {
            content = content.replace('// Eventuality enhancements', `${exportLine}\n// Eventuality enhancements`);
          } else {
            // For index.ts or if no eventuality section found, append at the end
            content += exportLine;
          }
          
          fs.writeFileSync(entryPath, content);
          console.log(`  ✓ Updated ${entryFile} to export semantic types`);
        }
      }
    }
  }

  /**
   * Scan generated model files to detect exported type alias unions, like:
   *   export type X = StrictUnion<A | B | C>;
   *   export type Y = A | B;
   * Returns a map of alias -> [variantTypeNames]
   */
  private discoverAliasUnions(modelsDir: string): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    if (!fs.existsSync(modelsDir)) return result;

    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
    const strictUnionRegex = /export\s+type\s+(\w+)\s*=\s*StrictUnion\s*<([^>]+)>\s*;/m;
    const plainUnionRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+\|[^;]+);/m;

    for (const file of files) {
      const filePath = path.join(modelsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      let m = content.match(strictUnionRegex);
      if (m) {
        const alias = m[1];
        const body = m[2];
        const variants = body.split('|').map(s => s.trim())
          .map(s => s.replace(/\s+extends\s+[^|]+/g, '')) // drop extends if any
          .map(s => s.replace(/[^A-Za-z0-9_]/g, ' ').trim().split(/\s+/)[0]) // first token
          .filter(Boolean);
        if (variants.length > 0) result[alias] = variants;
        continue;
      }

      m = content.match(plainUnionRegex);
      if (m) {
        const alias = m[1];
        const body = m[2];
        const variants = body.split('|').map(s => s.trim())
          .map(s => s.replace(/[^A-Za-z0-9_]/g, ' ').trim().split(/\s+/)[0])
          .filter(Boolean);
        if (variants.length > 0) result[alias] = variants;
      }
    }

    if (Object.keys(result).length > 0) {
      console.log(`  ✓ Detected alias unions: ${Object.keys(result).join(', ')}`);
    }
    return result;
  }
}
