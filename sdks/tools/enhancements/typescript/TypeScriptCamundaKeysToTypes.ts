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
    
    for (const [name, type] of Array.from(this.semanticTypes.entries())) {
      code += `/**\n * ${type.description}\n */\n`;
      code += `export type ${name} = CamundaKey<'${name}'>;\n\n`;
      
      code += `export namespace ${name} {\n`;
      code += `  /**\n   * Create a new ${name} with validation\n   */\n`;
      code += `  export function create(value: string): ${name} {\n`;
      code += `    if (!isValid(value)) {\n`;
      code += `      throw new Error(\`Invalid ${name}: \${value}\`);\n`;
      code += `    }\n`;
      code += `    return value as unknown as ${name};\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Get the string value of a ${name}\n   */\n`;
      code += `  export function getValue(key: ${name}): string {\n`;
      code += `    return key as unknown as string;\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Compare two ${name} instances for equality\n   */\n`;
      code += `  export function equals(a: ${name}, b: ${name}): boolean {\n`;
      code += `    return (a as unknown as string) === (b as unknown as string);\n`;
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
            content = content.replace(pattern, `'$1'?: ${typeName}`);
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

    // Enhance serialize method
    const serializeEnhancement = this.generateSerializeEnhancement();
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

  generateSerializeEnhancement(): string {
    const semanticTypeNames = Array.from(this.semanticTypes.keys());
    let enhancement = '\n        // Semantic type handling - convert branded types to strings for JSON\n';
    
    for (const typeName of semanticTypeNames) {
      enhancement += `        else if (type === "${typeName}") {\n`;
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
      enhancement += `            return ${typeName}.create(data as string);\n`;
      enhancement += `        }\n`;
    }
    
    return enhancement;
  }

  updateTypeScriptIndex(sdkPath: string) {
    const indexPath = path.join(sdkPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      if (!content.includes('semanticTypes')) {
        content += '\nexport * from "./semanticTypes";\n';
        fs.writeFileSync(indexPath, content);
        console.log(`  ✓ Updated index.ts`);
      }
    }
  }
}
