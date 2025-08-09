import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { SdkEnhancementStrategy } from '../SdkEnhancementOrchestrator';
import { SdkDefinitions } from '../../sdks';

/**
 * Fixes OneOf union types that were incorrectly generated as separate classes
 * due to OpenAPI Generator bug #20304: allOf + $ref + sibling properties issue.
 * 
 * See: https://github.com/OpenAPITools/openapi-generator/issues/20304
 * 
 * The bug causes oneOf unions like:
 * oneOf:
 *   - $ref: "#/components/schemas/ProcessInstanceKey"  
 *   - $ref: "#/components/schemas/AdvancedProcessInstanceKeyFilter"
 * 
 * To be generated as separate classes (e.g., BaseProcessInstanceFilterFieldsProcessInstanceKey)
 * instead of proper TypeScript union types (ProcessInstanceKey | AdvancedProcessInstanceKeyFilter).
 * 
 * This enhancer detects the incorrectly generated classes by their naming pattern and 
 * cross-references with the original YAML specification to restore the correct union types.
 * 
 * TODO: Remove this enhancer when OpenAPI Generator bug #20304 is fixed and released.
 */
export class TypeScriptOneOfUnionEnhancer extends SdkEnhancementStrategy {
    name = 'typescript-oneOf-union-enhancer';
    
    sdkEnhancementStrategies = {
        typescript: this.enhanceTypeScript,
    }

    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    private enhanceTypeScript(sdkPath: string): void {
        console.log('🔧 Fixing OneOf union types...');
        
        // Phase 1: Analyze YAML spec to find all problematic oneOf patterns
        const problematicPatterns = this.findProblematicOneOfPatterns();
        console.log(`  🔍 Found ${problematicPatterns.length} problematic oneOf patterns in YAML spec`);
        
        if (problematicPatterns.length === 0) {
            console.log('  ✓ No problematic oneOf patterns detected in YAML');
            return;
        }

        // Phase 2: Predict what class names OpenAPI Generator would create
        const predictedClasses = this.predictGeneratedClassNames(problematicPatterns);
        console.log(`  🎯 Predicted ${predictedClasses.length} potentially problematic generated classes`);

        // Phase 3: Verify these classes exist in the generated SDK
        const confirmedIssues = this.validatePredictedClasses(sdkPath, predictedClasses);
        console.log(`  📋 Confirmed ${confirmedIssues.length} actual OneOf issues to fix`);

        if (confirmedIssues.length === 0) {
            console.log('  ✓ No confirmed OneOf issues found in generated SDK');
            return;
        }

        // Phase 4: Fix all confirmed issues
        for (const issue of confirmedIssues) {
            this.fixOneOfIssue(sdkPath, issue);
        }
        
        // Phase 5: Fix advanced filter type annotations  
        this.fixAdvancedFilterTypes(sdkPath);
        
        console.log('  ✅ OneOf union types fixed');
    }

    /**
     * Phase 1: Analyze the OpenAPI spec to find all oneOf patterns that trigger the bug.
     * 
     * The bug occurs when:
     * 1. A schema uses allOf to extend/compose schemas
     * 2. One of the properties in that schema is a oneOf with $ref elements
     * 3. OpenAPI Generator incorrectly generates separate classes instead of union types
     */
    private findProblematicOneOfPatterns(): ProblematicOneOfPattern[] {
        const patterns: ProblematicOneOfPattern[] = [];
        
        if (!this.spec.components?.schemas) return patterns;
        
        // Scan all schemas in the spec
        for (const [schemaName, schema] of Object.entries(this.spec.components.schemas)) {
            if (!schema || typeof schema !== 'object') continue;
            
            // Look for schemas that have properties with oneOf
            const oneOfProperties = this.findOneOfProperties(schema);
            
            for (const oneOfProp of oneOfProperties) {
                console.log(`    🔍 Found oneOf property: ${schemaName}.${oneOfProp.propertyName}`);
                
                patterns.push({
                    parentSchemaName: schemaName,
                    propertyName: oneOfProp.propertyName,
                    unionTypes: oneOfProp.unionTypes,
                    description: oneOfProp.description
                });
            }
        }
        
        return patterns;
    }

    /**
     * Find all properties in a schema that use oneOf with $ref elements.
     * This includes properties in allOf referenced schemas.
     */
    private findOneOfProperties(schema: any): OneOfProperty[] {
        const properties: OneOfProperty[] = [];
        
        // Check direct properties
        if (schema.properties) {
            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                const oneOfProp = this.extractOneOfProperty(propName, propSchema);
                if (oneOfProp) {
                    properties.push(oneOfProp);
                }
            }
        }
        
        // Check properties in allOf referenced schemas
        if (schema.allOf) {
            for (const subSchema of schema.allOf) {
                if ('$ref' in subSchema && subSchema.$ref) {
                    const resolvedSchema = this.resolveRef(subSchema.$ref);
                    if (resolvedSchema) {
                        properties.push(...this.findOneOfProperties(resolvedSchema));
                    }
                } else if (subSchema.properties) {
                    for (const [propName, propSchema] of Object.entries(subSchema.properties)) {
                        const oneOfProp = this.extractOneOfProperty(propName, propSchema);
                        if (oneOfProp) {
                            properties.push(oneOfProp);
                        }
                    }
                }
            }
        }
        
        return properties;
    }

    /**
     * Extract oneOf information from a property schema if it uses oneOf with $ref.
     */
    private extractOneOfProperty(propertyName: string, propertySchema: any): OneOfProperty | null {
        if (!propertySchema || !('oneOf' in propertySchema) || !propertySchema.oneOf) {
            return null;
        }
        
        const unionTypes: string[] = [];
        
        // Extract all $ref types from the oneOf
        for (const option of propertySchema.oneOf) {
            if ('$ref' in option && option.$ref) {
                const typeName = option.$ref.split('/').pop();
                if (typeName) {
                    unionTypes.push(typeName);
                }
            }
        }
        
        // Only consider it problematic if it has $ref-based union types
        if (unionTypes.length === 0) {
            return null;
        }
        
        return {
            propertyName,
            unionTypes,
            description: propertySchema.description || ''
        };
    }

    /**
     * Phase 2: Predict what class names OpenAPI Generator would create for these patterns.
     * 
     * The naming convention seems to use underscores in the OpenAPI logs, then converted to camelCase:
     * - BaseProcessInstanceFilterFields_processInstanceKey -> baseProcessInstanceFilterFieldsProcessInstanceKey
     * - VariableFilter_variableKey -> variableFilterVariableKey
     * - JobFilter_jobKey -> jobFilterJobKey
     */
    private predictGeneratedClassNames(patterns: ProblematicOneOfPattern[]): PredictedGeneratedClass[] {
        const predictions: PredictedGeneratedClass[] = [];
        
        for (const pattern of patterns) {
            // Convert property name to PascalCase for class name generation
            const pascalCaseProperty = this.toPascalCase(pattern.propertyName);
            
            // Try both naming conventions that OpenAPI Generator might use:
            // 1. Direct concatenation: ParentSchemaPropertyName
            const directConcatenation = `${pattern.parentSchemaName}${pascalCaseProperty}`;
            
            // 2. CamelCase conversion from underscore: ParentSchema_propertyName -> parentSchemaPropertyName
            const underscoreBasedName = this.convertUnderscoreBasedName(pattern.parentSchemaName, pattern.propertyName);
            
            console.log(`    🎯 Predicting: ${pattern.parentSchemaName}.${pattern.propertyName} -> ${directConcatenation} OR ${underscoreBasedName}`);
            
            // Add both predictions
            predictions.push({
                predictedClassName: directConcatenation,
                originalPattern: pattern
            });
            
            if (directConcatenation !== underscoreBasedName) {
                predictions.push({
                    predictedClassName: underscoreBasedName,
                    originalPattern: pattern
                });
            }
        }
        
        return predictions;
    }

    /**
     * Convert from OpenAPI Generator's underscore-based naming to camelCase class names.
     * Example: BaseProcessInstanceFilterFields_processInstanceKey -> baseProcessInstanceFilterFieldsProcessInstanceKey
     */
    private convertUnderscoreBasedName(parentSchemaName: string, propertyName: string): string {
        // OpenAPI Generator creates: ParentSchema_propertyName
        const underscoreName = `${parentSchemaName}_${propertyName}`;
        
        // Then converts to camelCase
        return this.camelCase(underscoreName.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase()));
    }

    /**
     * Phase 3: Verify these predicted classes actually exist in the generated SDK.
     */
    private validatePredictedClasses(sdkPath: string, predictions: PredictedGeneratedClass[]): OneOfIssue[] {
        const confirmedIssues: OneOfIssue[] = [];
        const modelsDir = path.join(sdkPath, 'model');
        
        if (!fs.existsSync(modelsDir)) return confirmedIssues;
        
        for (const prediction of predictions) {
            // Check if a file with this class name exists
            // OpenAPI Generator uses camelCase for file names (first letter lowercase)
            const camelCaseFileName = this.camelCase(prediction.predictedClassName);
            const filePath = path.join(modelsDir, `${camelCaseFileName}.ts`);
            
            console.log(`    🔍 Looking for file: ${camelCaseFileName}.ts for class ${prediction.predictedClassName}`);
            
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Verify this is actually a class with the expected name
                const classMatch = content.match(new RegExp(`export class ${prediction.predictedClassName}\\b`));
                
                if (classMatch) {
                    console.log(`    ✅ Confirmed issue: ${prediction.predictedClassName} exists and should be ${prediction.originalPattern.unionTypes.join(' | ')}`);
                    
                    confirmedIssues.push({
                        className: prediction.predictedClassName,
                        filePath,
                        content,
                        pattern: {
                            className: prediction.predictedClassName,
                            parentClassName: prediction.originalPattern.parentSchemaName,
                            propertyName: prediction.originalPattern.propertyName
                        },
                        originalSpec: {
                            propertyName: prediction.originalPattern.propertyName,
                            unionTypes: prediction.originalPattern.unionTypes,
                            description: prediction.originalPattern.description
                        }
                    });
                } else {
                    console.log(`    ⚠️  File exists but doesn't contain expected class: ${prediction.predictedClassName}`);
                }
            } else {
                console.log(`    ℹ️  Predicted class not found (might be correctly generated): ${prediction.predictedClassName}`);
            }
        }
        
        return confirmedIssues;
    }

    /**
     * Convert camelCase to PascalCase.
     */
    private toPascalCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private resolveRef(ref: string): any {
        if (!ref.startsWith('#/components/schemas/')) return null;
        const schemaName = ref.split('/').pop();
        if (!schemaName || !this.spec.components?.schemas) return null;
        return this.spec.components.schemas[schemaName];
    }

    private fixOneOfIssue(sdkPath: string, issue: OneOfIssue): void {
        console.log(`    🔧 Fixing ${issue.className} -> ${issue.originalSpec.unionTypes.join(' | ')}`);
        
        // Delete the problematic file
        fs.unlinkSync(issue.filePath);
        
        // Remove the export from models.ts
        this.removeFromModelsExports(sdkPath, issue.className);
        
        // Update any files that import this type to use the union type directly
        this.updateImports(sdkPath, issue);
    }

    private removeFromModelsExports(sdkPath: string, className: string): void {
        const modelsPath = path.join(sdkPath, 'model', 'models.ts');
        if (!fs.existsSync(modelsPath)) return;
        
        let content = fs.readFileSync(modelsPath, 'utf8');
        
        // Remove the export line
        const exportRegex = new RegExp(`export \\* from '\\.\/${this.camelCaseToKebab(className)}';\\n?`, 'g');
        content = content.replace(exportRegex, '');
        
        fs.writeFileSync(modelsPath, content);
    }

    private updateImports(sdkPath: string, issue: OneOfIssue): void {
        const modelsDir = path.join(sdkPath, 'model');
        const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
        
        for (const file of files) {
            const filePath = path.join(modelsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;
            const fileName = this.camelCaseToKebab(issue.className);
            
            // Remove any imports from the deleted file (both named imports and empty imports)
            const importRegex = new RegExp(`import\\s+(?:{[^}]*}\\s+)?from\\s+['"]\\.\/${fileName}['"];?\\n?`, 'g');
            if (importRegex.test(content)) {
                content = content.replace(importRegex, '');
                hasChanges = true;
            }
            
            // For models.ts, also remove the export entry
            if (file === 'models.ts') {
                const exportPattern = new RegExp(`\\s*"${issue.className}":\\s*${issue.className},?\\s*\\n?`, 'g');
                if (exportPattern.test(content)) {
                    content = content.replace(exportPattern, '');
                    hasChanges = true;
                }
            }
            
            // Skip further processing if this file doesn't reference the problematic class
            if (!content.includes(issue.className)) {
                if (hasChanges) {
                    fs.writeFileSync(filePath, content);
                }
                continue;
            }
            
            // Add imports for the union type components if needed
            const unionTypeString = issue.originalSpec.unionTypes.join(' | ');
            
            // Only add imports if the file will actually use the union types
            if (content.includes(unionTypeString) || content.includes(issue.className)) {
                for (const unionType of issue.originalSpec.unionTypes) {
                    if (!content.includes(`import { ${unionType}`) && !content.includes(`${unionType},`)) {
                        // Add import from semanticTypes if it's a semantic type
                        if (this.isSemanticType(unionType)) {
                            content = this.addSemanticTypeImport(content, unionType);
                            hasChanges = true;
                        } else if (this.isAdvancedFilterType(unionType)) {
                            // Add import for advanced filter types
                            content = this.addAdvancedFilterImport(content, unionType);
                            hasChanges = true;
                        }
                    }
                }
            }
            
            // Replace type usage with union type ONLY in property declarations and type annotations,
            // not in import statements or other contexts
            const propertyDeclarationRegex = new RegExp(
                `(^\\s*'[^']*'\\?\\s*:\\s*)${issue.className}(\\s*;?)$`,
                'gm'
            );
            if (propertyDeclarationRegex.test(content)) {
                content = content.replace(propertyDeclarationRegex, `$1${unionTypeString}$2`);
                hasChanges = true;
            }
            
            // Also replace in attributeTypeMap string values
            const attributeMapRegex = new RegExp(
                `("type"\\s*:\\s*")(${issue.className})("\\s*})`,
                'g'
            );
            if (attributeMapRegex.test(content)) {
                content = content.replace(attributeMapRegex, `$1${unionTypeString}$3`);
                hasChanges = true;
            }
            
            if (hasChanges) {
                fs.writeFileSync(filePath, content);
            }
        }
    }

    private isSemanticType(typeName: string): boolean {
        // Check if this is one of our semantic types
        const semanticTypes = [
            'ProcessInstanceKey', 'ProcessDefinitionKey', 'ElementInstanceKey',
            'UserTaskKey', 'VariableKey', 'ScopeKey', 'IncidentKey', 'JobKey',
            'MessageSubscriptionKey', 'MessageCorrelationKey', 'DecisionDefinitionKey',
            'DecisionRequirementsKey', 'AuthorizationKey', 'MessageKey',
            'DecisionInstanceKey', 'SignalKey', 'DeploymentKey', 'FormKey'
        ];
        
        return semanticTypes.includes(typeName);
    }

    private isAdvancedFilterType(typeName: string): boolean {
        // Check if this is one of the advanced filter types
        return typeName.startsWith('Advanced') && typeName.endsWith('Filter');
    }

    private addSemanticTypeImport(content: string, typeName: string): string {
        // Check if there's already a semanticTypes import
        const semanticImportMatch = content.match(/import\s+{([^}]*?)}\s+from\s+['"]\.\.\/semanticTypes['"];/);
        
        if (semanticImportMatch) {
            // Add to existing import if not already present
            const existingImports = semanticImportMatch[1];
            if (!existingImports.includes(typeName)) {
                const newImports = existingImports.trim() + `, ${typeName}`;
                return content.replace(semanticImportMatch[0], 
                    `import { ${newImports} } from '../semanticTypes';`);
            }
        } else {
            // Check if import already exists somewhere else
            if (content.includes(`import { ${typeName}`)) {
                return content;
            }
            
            // Add new import
            const importInsertPoint = content.indexOf('import { RequestFile }');
            if (importInsertPoint !== -1) {
                const beforeImport = content.substring(0, importInsertPoint);
                const afterImport = content.substring(importInsertPoint);
                return beforeImport + `import { ${typeName} } from '../semanticTypes';\n` + afterImport;
            }
        }
        
        return content;
    }

    private addAdvancedFilterImport(content: string, typeName: string): string {
        // Check if the import already exists
        if (content.includes(`import { ${typeName} }`)) {
            return content;
        }
        
        // Convert type name to file name (e.g., AdvancedProcessInstanceKeyFilter -> advancedProcessInstanceKeyFilter)
        const fileName = this.camelCase(typeName);
        
        // Don't add import if it's a self-import (importing the same file)
        if (content.includes(`export class ${typeName}`)) {
            return content;
        }
        
        // Add import for the advanced filter type
        const importInsertPoint = content.indexOf('import { RequestFile }');
        if (importInsertPoint !== -1) {
            const beforeImport = content.substring(0, importInsertPoint);
            const afterImport = content.substring(importInsertPoint);
            return beforeImport + `import { ${typeName} } from './${fileName}';\n` + afterImport;
        }
        
        return content;
    }

    private camelCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    private camelCaseToKebab(str: string): string {
        // For OpenAPI Generator, the file name is just the class name with the first letter lowercase
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    protected getStartMessage(): string {
        return '🔧 Starting TypeScript OneOf union type fixes...';
    }

    protected getCompletionMessage(): string {
        return '✅ TypeScript OneOf union type fixes completed';
    }

    /**
     * Phase 5: Fix advanced filter type annotations that use 'any' instead of semantic types.
     * 
     * OpenAPI Generator sometimes generates advanced filter classes with 'any' types instead
     * of the proper semantic types. This method scans for advanced filter classes and fixes
     * their type annotations to use the correct semantic types.
     */
    private fixAdvancedFilterTypes(sdkPath: string): void {
        console.log('    🔧 Fixing advanced filter type annotations...');
        
        const modelsDir = path.join(sdkPath, 'model');
        const advancedFilterFiles = fs.readdirSync(modelsDir)
            .filter(f => f.startsWith('advanced') && f.endsWith('Filter.ts'));
        
        for (const file of advancedFilterFiles) {
            const filePath = path.join(modelsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;
            
            // Extract the semantic type name from the file name
            // e.g., advancedProcessDefinitionKeyFilter.ts -> ProcessDefinitionKey
            const semanticTypeName = this.extractSemanticTypeFromFileName(file);
            
            if (!semanticTypeName) {
                continue; // Skip if we can't determine the semantic type
            }
            
            // Fix TypeScript property type annotations
            // Replace '$eq'?: any; with '$eq'?: ProcessDefinitionKey;
            const propertyRegex = /('\$(?:eq|neq)'\?\s*:\s*)any/g;
            if (propertyRegex.test(content)) {
                content = content.replace(propertyRegex, `$1${semanticTypeName}`);
                hasChanges = true;
            }
            
            // Fix array property type annotations  
            // Replace '$in'?: Array<any>; with '$in'?: Array<ProcessDefinitionKey>;
            const arrayPropertyRegex = /('\$(?:in|notIn)'\?\s*:\s*Array<)any>/g;
            if (arrayPropertyRegex.test(content)) {
                content = content.replace(arrayPropertyRegex, `$1${semanticTypeName}>`);
                hasChanges = true;
            }
            
            // Fix attributeTypeMap entries
            // Replace "type": "any" with "type": "ProcessDefinitionKey"
            const attributeMapRegex = /("type":\s*")any"/g;
            if (attributeMapRegex.test(content)) {
                content = content.replace(attributeMapRegex, `$1${semanticTypeName}"`);
                hasChanges = true;
            }
            
            // Fix attributeTypeMap array entries  
            // Replace "type": "Array<any>" with "type": "Array<ProcessDefinitionKey>"
            const attributeMapArrayRegex = /("type":\s*"Array<)any>/g;
            if (attributeMapArrayRegex.test(content)) {
                content = content.replace(attributeMapArrayRegex, `$1${semanticTypeName}>`);
                hasChanges = true;
            }
            
            // Add import for the semantic type if needed
            if (hasChanges) {
                content = this.addSemanticTypeImport(content, semanticTypeName);
                fs.writeFileSync(filePath, content);
                console.log(`    ✓ Fixed advanced filter types in ${file}`);
            }
        }
    }

    /**
     * Extract the semantic type name from an advanced filter file name.
     * 
     * @param fileName - e.g., "advancedProcessDefinitionKeyFilter.ts"
     * @returns The semantic type name, e.g., "ProcessDefinitionKey", or null if not found
     */
    private extractSemanticTypeFromFileName(fileName: string): string | null {
        // Remove .ts extension and convert to PascalCase
        const baseName = fileName.replace(/\.ts$/, '');
        
        // Pattern: advanced{SemanticType}Filter
        const match = baseName.match(/^advanced(.+)Filter$/);
        if (!match) return null;
        
        const typePart = match[1];
        
        // Convert from camelCase to PascalCase (first letter uppercase)
        const semanticTypeName = typePart.charAt(0).toUpperCase() + typePart.slice(1);
        
        // Verify this is actually a semantic type we know about
        if (this.isSemanticType(semanticTypeName)) {
            return semanticTypeName;
        }
        
        return null;
    }
}

/**
 * Represents a problematic oneOf pattern found in the OpenAPI spec.
 */
interface ProblematicOneOfPattern {
    parentSchemaName: string;
    propertyName: string;
    unionTypes: string[];
    description: string;
}

/**
 * Represents a oneOf property within a schema.
 */
interface OneOfProperty {
    propertyName: string;
    unionTypes: string[];
    description: string;
}

/**
 * Represents a predicted class name that OpenAPI Generator would create.
 */
interface PredictedGeneratedClass {
    predictedClassName: string;
    originalPattern: ProblematicOneOfPattern;
}

/**
 * Legacy interfaces for backward compatibility with existing fix logic.
 */
interface OneOfBugPattern {
    className: string;
    parentClassName: string;
    propertyName: string;
}

interface OneOfSpec {
    propertyName: string;
    unionTypes: string[];
    description: string;
}

interface OneOfIssue {
    className: string;
    filePath: string;
    content: string;
    pattern: OneOfBugPattern;
    originalSpec: OneOfSpec;
}
