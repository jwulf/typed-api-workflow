import { OpenAPIV3 } from 'openapi-types';
import { SdkEnhancementStrategy } from '../SdkEnhancementOrchestrator';
import { SdkDefinitions } from '../../sdks';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Enhances TypeScript filter fields that use oneOf with semantic types
 * 
 * This enhancer fixes the issue where OpenAPI Generator doesn't properly
 * generate union types for filter fields tha        // Target main filter classes that might inherit semantic union fields
        const mainFilterFiles = files.filter(file => {
            return file.endsWith('.ts') && (
                // Classes with FilterFields in the name
                (file.includes('FilterFields.ts') && !file.startsWith('base') && !file.includes('FilterProperty')) ||
                // Classes with Filter in the name that might inherit from FilterFields
                (file.includes('Filter.ts') && !file.startsWith('base') && !file.includes('FilterProperty') && !file.includes('advanced'))
            );
        }); accept both semantic
 * types and filter property objects.
 * 
 * For example, this OpenAPI schema:
 * ```yaml
 * processDefinitionKey:
 *   oneOf:
 *     - $ref: "#/components/schemas/ProcessDefinitionKey"
 *     - $ref: "#/components/schemas/ProcessDefinitionKeyFilterProperty"
 * ```
 * 
 * Should generate TypeScript:
 * ```typescript
 * processDefinitionKey?: ProcessDefinitionKey | ProcessDefinitionKeyFilterProperty | null;
 * ```
 * 
 * But OpenAPI Generator only generates:
 * ```typescript
 * processDefinitionKey?: ProcessDefinitionKeyFilterProperty | null;
 * ```
 * 
 * This enhancer fixes that by detecting these patterns and correcting the union types.
 */
export class TypeScriptCamundaKeyFiltersToTypes extends SdkEnhancementStrategy {
    name = 'TypeScriptCamundaKeyFiltersToTypes';
    
    sdkEnhancementStrategies = {
        typescript: this.enhanceTypeScript,
        csharp: () => {}, // Not implemented
        go: () => {}, // Not implemented
        python: () => {}, // Not implemented
        php: () => {}, // Not implemented
    };
    
    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    getStartMessage(): string {
        return '🔧 Fixing semantic type union fields in filter classes...';
    }

    getCompletionMessage(): string {
        return '✅ All semantic union fields fixed!';
    }

    enhanceTypeScript(sdkPath: string): void {
        console.log('🔧 Fixing semantic type union fields in filter classes...');
        
        // Find all schemas that have semantic type oneOf unions
        const semanticUnionFields = this.findSemanticUnionFields();
        
        if (semanticUnionFields.length === 0) {
            console.log('  → No semantic union fields found');
        } else {
            console.log(`  → Found ${semanticUnionFields.length} semantic union fields to fix`);
            
            for (const field of semanticUnionFields) {
                this.fixSemanticUnionField(sdkPath, field);
            }
        }
        
        // Fix all filter classes with comprehensive pattern matching
        this.fixAllFilterClasses(sdkPath);
        
        // Fix inline class fields that inherit semantic union fields
        this.fixInlineClassFields(sdkPath);
        
        // NEW: Fix attributeTypeMap for union fields to enable proper serialization
        this.fixAttributeTypeMapsForUnionFields(sdkPath, semanticUnionFields);
        
        // NEW: Add union type serialization support to ObjectSerializer
        this.addUnionSerializationSupport(sdkPath);
        
        console.log('  ✓ All semantic union fields fixed');
    }

    private findSemanticUnionFields(): Array<{
        className: string;
        fieldName: string;
        semanticType: string;
        filterPropertyType: string;
    }> {
        const fields: Array<{
            className: string;
            fieldName: string;
            semanticType: string;
            filterPropertyType: string;
        }> = [];

        if (!this.spec.components?.schemas) return fields;

        // First pass: find direct semantic union fields
        for (const [schemaName, schemaOrRef] of Object.entries(this.spec.components.schemas)) {
            if ('$ref' in schemaOrRef) continue;
            
            const schema = schemaOrRef as OpenAPIV3.SchemaObject;
            
            // Check properties for oneOf unions with semantic types
            if (schema.properties) {
                for (const [propName, propSchemaOrRef] of Object.entries(schema.properties)) {
                    if ('$ref' in propSchemaOrRef) continue;
                    
                    const propSchema = propSchemaOrRef as OpenAPIV3.SchemaObject;
                    
                    if (propSchema.oneOf && propSchema.oneOf.length === 2) {
                        const unionAnalysis = this.analyzeSemanticUnion(propSchema.oneOf);
                        if (unionAnalysis) {
                            fields.push({
                                className: schemaName,
                                fieldName: propName,
                                semanticType: unionAnalysis.semanticType,
                                filterPropertyType: unionAnalysis.filterPropertyType
                            });
                        }
                    }
                }
            }
        }

        // Second pass: find classes that inherit from schemas with semantic union fields
        for (const [schemaName, schemaOrRef] of Object.entries(this.spec.components.schemas)) {
            if ('$ref' in schemaOrRef) continue;
            
            const schema = schemaOrRef as OpenAPIV3.SchemaObject;
            
            // Check for allOf inheritance
            if (schema.allOf) {
                for (const allOfItem of schema.allOf) {
                    if ('$ref' in allOfItem) {
                        const refName = this.getRefName(allOfItem.$ref);
                        if (refName) {
                            // Check if the referenced schema has semantic union fields
                            const inheritedFields = fields.filter(f => f.className === refName);
                            for (const inheritedField of inheritedFields) {
                                // Add this field to the inheriting class as well
                                fields.push({
                                    className: schemaName,
                                    fieldName: inheritedField.fieldName,
                                    semanticType: inheritedField.semanticType,
                                    filterPropertyType: inheritedField.filterPropertyType
                                });
                            }
                        }
                    }
                }
            }
        }

        return fields;
    }

    private analyzeSemanticUnion(oneOfItems: (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[]): {
        semanticType: string;
        filterPropertyType: string;
    } | null {
        let semanticType: string | null = null;
        let filterPropertyType: string | null = null;

        for (const item of oneOfItems) {
            if ('$ref' in item) {
                const refName = this.getRefName(item.$ref);
                if (refName) {
                    // Check if it's a semantic type (ends with 'Key')
                    if (refName.endsWith('Key')) {
                        semanticType = refName;
                    }
                    // Check if it's a filter property (ends with 'FilterProperty')
                    else if (refName.endsWith('FilterProperty')) {
                        filterPropertyType = refName;
                    }
                }
            }
        }

        if (semanticType && filterPropertyType) {
            return { semanticType, filterPropertyType };
        }

        return null;
    }

    private getRefName(ref: string): string | null {
        const parts = ref.split('/');
        return parts[parts.length - 1] || null;
    }

    private fixSemanticUnionField(sdkPath: string, field: {
        className: string;
        fieldName: string;
        semanticType: string;
        filterPropertyType: string;
    }): void {
        const fileName = this.camelCaseToSnakeCase(field.className) + '.ts';
        const filePath = path.join(sdkPath, 'model', fileName);
        
        if (!fs.existsSync(filePath)) {
            console.log(`  → File not found: ${fileName}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if semantic type import already exists
        if (!content.includes(`import { ${field.semanticType} }`)) {
            // Add semantic type import
            const importLine = `import { ${field.semanticType} } from '../semanticTypes';`;
            
            // Find the position after the last import
            const lines = content.split('\n');
            let insertIndex = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    insertIndex = i + 1;
                }
            }
            
            lines.splice(insertIndex, 0, importLine);
            content = lines.join('\n');
        }

        // Fix the field type declaration
        const currentFieldPattern = new RegExp(
            `'${field.fieldName}'\\?:\\s*${field.filterPropertyType}\\s*\\|\\s*null;`,
            'g'
        );
        
        const newFieldDeclaration = `'${field.fieldName}'?: ${field.semanticType} | ${field.filterPropertyType} | null;`;
        
        if (currentFieldPattern.test(content)) {
            content = content.replace(currentFieldPattern, newFieldDeclaration);
            fs.writeFileSync(filePath, content);
            console.log(`  ✓ Fixed ${field.className}.${field.fieldName} to accept ${field.semanticType}`);
        } else {
            console.log(`  → ${field.className}.${field.fieldName} field pattern not found or already fixed`);
        }
    }

    private fixAllFilterClasses(sdkPath: string): void {
        const modelDir = path.join(sdkPath, 'model');
        if (!fs.existsSync(modelDir)) {
            return;
        }

        // Extract available semantic types from spec instead of hardcoding
        const availableSemanticTypes = this.extractSemanticTypesFromSpec();
        
        console.log(`  → Found ${availableSemanticTypes.size} semantic types in spec: ${Array.from(availableSemanticTypes).join(', ')}`);

        const files = fs.readdirSync(modelDir);
        
        // Target specific file patterns that need 'any' type replacement
        const filterFiles = files.filter(file => {
            return file.endsWith('.ts') && (
                // Advanced filter classes with Key types
                (file.startsWith('advanced') && file.includes('KeyFilter.ts')) ||
                // Filter property classes with Key types  
                file.endsWith('KeyFilterProperty.ts') ||
                // Base filter field classes (these are the main culprits)
                file.startsWith('baseProcessInstanceFilterFields') ||
                // Job filter classes
                file.startsWith('jobFilter') ||
                // Variable filter classes
                file.startsWith('variableFilter')
            );
        });

        if (filterFiles.length === 0) {
            console.log('  → No filter classes found to fix');
            return;
        }

        console.log(`  → Found ${filterFiles.length} filter classes to analyze and fix`);

        for (const fileName of filterFiles) {
            this.fixFilterClass(sdkPath, fileName, availableSemanticTypes);
        }
    }

    private extractSemanticTypesFromSpec(): Set<string> {
        const semanticTypes = new Set<string>();
        
        if (!this.spec.components?.schemas) return semanticTypes;

        // Find all schemas that end with 'Key' and are likely semantic types
        for (const [schemaName] of Object.entries(this.spec.components.schemas)) {
            if (schemaName.endsWith('Key') && !schemaName.endsWith('FilterProperty')) {
                semanticTypes.add(schemaName);
            }
        }

        return semanticTypes;
    }

    private fixFilterClass(sdkPath: string, fileName: string, availableSemanticTypes: Set<string>): void {
        const filePath = path.join(sdkPath, 'model', fileName);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Extract the semantic type from filename
        const semanticType = this.getSemanticTypeFromFileName(fileName);
        
        if (!semanticType || !availableSemanticTypes.has(semanticType)) {
            return; // Skip files we can't map to semantic types
        }

        // Only add import if not already present and file contains 'any' types
        const needsImport = content.includes(': any') && !content.includes(`import { ${semanticType} } from '../semanticTypes';`);
        
        if (needsImport) {
            content = this.addSemanticTypeImport(content, semanticType);
            hasChanges = true;
        }

        // Replace 'any' types with semantic types for filter operators
        const replacements = this.replaceAnyTypesWithSemanticType(content, semanticType);
        if (replacements.hasChanges) {
            content = replacements.content;
            hasChanges = true;
        }

        // Remove any incorrect imports that we may have added
        content = this.cleanupIncorrectImports(content);

        if (hasChanges) {
            fs.writeFileSync(filePath, content);
            console.log(`  ✓ Fixed ${fileName} to use ${semanticType} instead of 'any'`);
        }
    }

    private getSemanticTypeFromFileName(fileName: string): string | null {
        // Pattern 1: advanced*KeyFilter.ts -> extract *Key
        let match = fileName.match(/^advanced(.+)KeyFilter\.ts$/);
        if (match) {
            return match[1] + 'Key';
        }
        
        // Pattern 2: *KeyFilterProperty.ts -> extract *Key
        match = fileName.match(/^(.+)KeyFilterProperty\.ts$/);
        if (match) {
            const typeName = match[1];
            // Convert camelCase to PascalCase and add Key
            return typeName.charAt(0).toUpperCase() + typeName.slice(1) + 'Key';
        }
        
        // Pattern 3: baseProcessInstanceFilterFields*Key.ts -> ProcessInstanceKey (they all use ProcessInstanceKey)
        if (fileName.startsWith('baseProcessInstanceFilterFields') && fileName.includes('Key')) {
            return 'ProcessInstanceKey';
        }
        
        // Pattern 4: jobFilter*Key.ts -> extract the Key type
        match = fileName.match(/^jobFilter(.+)\.ts$/);
        if (match) {
            const keyPart = match[1];
            // Convert to PascalCase
            const pascalCase = keyPart.charAt(0).toUpperCase() + keyPart.slice(1);
            return pascalCase;
        }
        
        // Pattern 5: variableFilter*Key.ts -> extract the Key type
        match = fileName.match(/^variableFilter(.+)\.ts$/);
        if (match) {
            const keyPart = match[1];
            // Convert to PascalCase
            const pascalCase = keyPart.charAt(0).toUpperCase() + keyPart.slice(1);
            return pascalCase;
        }
        
        return null;
    }

    private cleanupIncorrectImports(content: string): string {
        // Extract semantic types from spec instead of hardcoding
        const knownTypes = Array.from(this.extractSemanticTypesFromSpec());

        // Remove incorrect imports - any import from semanticTypes that's not in our known list
        const importRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]\.\.\/semanticTypes['"];\n?/g;
        
        return content.replace(importRegex, (match, imports) => {
            const importList = imports.split(',').map((imp: string) => imp.trim()).filter((imp: string) => knownTypes.includes(imp));
            
            if (importList.length === 0) {
                return ''; // Remove the entire import line
            } else if (importList.length === 1 && importList[0] === imports.trim()) {
                return match; // Keep as is if it's just one correct import
            } else {
                // Reconstruct with only valid imports
                return `import { ${importList.join(', ')} } from '../semanticTypes';\n`;
            }
        });
    }

    private fixInlineClassFields(sdkPath: string): void {
        const modelDir = path.join(sdkPath, 'model');
        if (!fs.existsSync(modelDir)) {
            return;
        }

        console.log('  → Analyzing spec to find semantic union fields that need fixing...');

        // Build comprehensive mapping from spec analysis
        const semanticFieldMappings = this.buildSemanticFieldMappingsFromSpec();
        
        if (semanticFieldMappings.size === 0) {
            console.log('  → No semantic field mappings found in spec');
            return;
        }

        console.log(`  → Found ${semanticFieldMappings.size} semantic field mappings from spec analysis`);

        const files = fs.readdirSync(modelDir);
        
        // Target main filter classes that might inherit semantic union fields
        const mainFilterFiles = files.filter(file => {
            return file.endsWith('.ts') && (
                (file.includes('FilterFields.ts') && 
                 !file.startsWith('base') &&
                 !file.includes('FilterProperty')) ||
                // Also include main filter classes that inherit from FilterFields via allOf
                (file.endsWith('Filter.ts') && 
                 !file.startsWith('base') &&
                 !file.includes('FilterProperty') &&
                 !file.includes('FilterFields'))
            );
        });

        for (const fileName of mainFilterFiles) {
            this.fixInlineFieldsInFile(sdkPath, fileName, semanticFieldMappings);
        }
    }

    private buildSemanticFieldMappingsFromSpec(): Map<string, { semanticType: string; filterPropertyType: string; fieldName: string }> {
        const mappings = new Map<string, { semanticType: string; filterPropertyType: string; fieldName: string }>();
        
        if (!this.spec.components?.schemas) return mappings;

        // Step 1: Find all schemas with semantic oneOf unions
        const semanticUnionFields = new Map<string, Map<string, { semanticType: string; filterPropertyType: string }>>();
        
        for (const [schemaName, schemaOrRef] of Object.entries(this.spec.components.schemas)) {
            if ('$ref' in schemaOrRef) continue;
            
            const schema = schemaOrRef as OpenAPIV3.SchemaObject;
            const fieldMap = new Map<string, { semanticType: string; filterPropertyType: string }>();
            
            if (schema.properties) {
                for (const [propName, propSchemaOrRef] of Object.entries(schema.properties)) {
                    if ('$ref' in propSchemaOrRef) continue;
                    
                    const propSchema = propSchemaOrRef as OpenAPIV3.SchemaObject;
                    
                    // Look for oneOf with semantic type + filter property
                    if (propSchema.oneOf && propSchema.oneOf.length === 2) {
                        const unionAnalysis = this.analyzeSemanticUnion(propSchema.oneOf);
                        if (unionAnalysis) {
                            fieldMap.set(propName, unionAnalysis);
                        }
                    }
                }
            }
            
            if (fieldMap.size > 0) {
                semanticUnionFields.set(schemaName, fieldMap);
            }
        }

        // Step 2: Build inheritance chains to find which classes inherit semantic fields
        const inheritanceChains = this.buildInheritanceChains();

        // Step 3: For each class that inherits from a base with semantic unions,
        // map the generated inline class name to the semantic type
        for (const [className, baseClasses] of inheritanceChains) {
            for (const baseClass of baseClasses) {
                const baseSemanticFields = semanticUnionFields.get(baseClass);
                if (baseSemanticFields) {
                    for (const [fieldName, unionInfo] of baseSemanticFields) {
                        // Generate the inline class name that OpenAPI generator creates
                        // Pattern: BaseClassNameFieldName (e.g., BaseProcessInstanceFilterFieldsProcessInstanceKey)
                        const inlineClassName = `${baseClass}${this.toPascalCase(fieldName)}`;
                        
                        mappings.set(inlineClassName, {
                            semanticType: unionInfo.semanticType,
                            filterPropertyType: unionInfo.filterPropertyType,
                            fieldName: fieldName
                        });
                        
                        console.log(`    📋 Mapped ${inlineClassName} -> ${unionInfo.semanticType} | ${unionInfo.filterPropertyType} (field: ${fieldName})`);
                    }
                }
            }
        }

        return mappings;
    }

    private buildInheritanceChains(): Map<string, string[]> {
        const chains = new Map<string, string[]>();
        
        if (!this.spec.components?.schemas) return chains;

        for (const [schemaName, schemaOrRef] of Object.entries(this.spec.components.schemas)) {
            if ('$ref' in schemaOrRef) continue;
            
            const schema = schemaOrRef as OpenAPIV3.SchemaObject;
            const baseClasses: string[] = [];
            
            // Check for allOf inheritance
            if (schema.allOf) {
                for (const allOfItem of schema.allOf) {
                    if ('$ref' in allOfItem) {
                        const refName = this.getRefName(allOfItem.$ref);
                        if (refName) {
                            baseClasses.push(refName);
                            
                            // Recursively get base classes of the base class
                            const ancestorChain = chains.get(refName) || [];
                            baseClasses.push(...ancestorChain);
                        }
                    }
                }
            }
            
            if (baseClasses.length > 0) {
                chains.set(schemaName, [...new Set(baseClasses)]); // Remove duplicates
            }
        }

        return chains;
    }

    private toPascalCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private fixInlineFieldsInFile(sdkPath: string, fileName: string, semanticFieldMappings: Map<string, { semanticType: string; filterPropertyType: string; fieldName: string }>): void {
        const filePath = path.join(sdkPath, 'model', fileName);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        const requiredSemanticImports = new Set<string>();
        const requiredFilterPropertyImports = new Set<string>();

        // Find field declarations that use inline classes
        for (const [inlineClassName, mappingInfo] of semanticFieldMappings) {
            // Pattern: 'fieldName'?: InlineClassName;
            const pattern = new RegExp(`'([^']+)'\\?\\s*:\\s*${inlineClassName}(\\s*\\|\\s*null)?;`, 'g');
            
            const replacements = content.matchAll(pattern);
            for (const match of replacements) {
                const fieldName = match[1];
                const nullablePart = match[2] || '';
                
                // Create the union type: SemanticType | FilterPropertyType | null
                const newType = `${mappingInfo.semanticType} | ${mappingInfo.filterPropertyType}${nullablePart}`;
                
                // Replace the field declaration
                const oldDeclaration = match[0];
                const newDeclaration = `'${fieldName}'?: ${newType};`;
                
                content = content.replace(oldDeclaration, newDeclaration);
                requiredSemanticImports.add(mappingInfo.semanticType);
                requiredFilterPropertyImports.add(mappingInfo.filterPropertyType);
                hasChanges = true;
                
                console.log(`    ✓ Fixed ${fileName}: ${fieldName} -> ${newType}`);
            }
        }

        // Add required semantic type imports
        for (const semanticType of requiredSemanticImports) {
            if (!content.includes(`import { ${semanticType} } from '../semanticTypes';`)) {
                content = this.addSemanticTypeImport(content, semanticType);
            }
        }

        // Add required filter property imports
        for (const filterPropertyType of requiredFilterPropertyImports) {
            if (!content.includes(`import { ${filterPropertyType} } from './${this.camelCaseToSnakeCase(filterPropertyType)}';`)) {
                content = this.addFilterPropertyImport(content, filterPropertyType);
            }
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content);
        }
    }

    private addFilterPropertyImport(content: string, filterPropertyTypeName: string): string {
        // Convert PascalCase to camelCase for filename
        const fileName = this.camelCaseToSnakeCase(filterPropertyTypeName);
        const importLine = `import { ${filterPropertyTypeName} } from './${fileName}';`;
        
        // Find the position after the last import
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                insertIndex = i + 1;
            }
        }
        
        lines.splice(insertIndex, 0, importLine);
        return lines.join('\n');
    }

    private addSemanticTypeImport(content: string, semanticTypeName: string): string {
        // Find the line with RequestFile import and add after it, or add after last import
        const requestFileImportMatch = content.match(/^import \{ RequestFile \} from '\.\/models';$/m);
        if (requestFileImportMatch) {
            return content.replace(
                requestFileImportMatch[0],
                `${requestFileImportMatch[0]}\nimport { ${semanticTypeName} } from '../semanticTypes';`
            );
        }
        
        // If no RequestFile import, find the last import line
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                insertIndex = i + 1;
            }
        }
        
        lines.splice(insertIndex, 0, `import { ${semanticTypeName} } from '../semanticTypes';`);
        return lines.join('\n');
    }

    private replaceAnyTypesWithSemanticType(content: string, semanticTypeName: string): { content: string; hasChanges: boolean } {
        let hasChanges = false;
        let newContent = content;
        
        // Replace 'any' with semantic type in property declarations
        const propertyReplacements = [
            { from: /'\$eq'\?\s*:\s*any;/g, to: `'$eq'?: ${semanticTypeName};` },
            { from: /'\$neq'\?\s*:\s*any;/g, to: `'$neq'?: ${semanticTypeName};` },
            { from: /'\$in'\?\s*:\s*Array<any>;/g, to: `'$in'?: Array<${semanticTypeName}>;` },
            { from: /'\$notIn'\?\s*:\s*Array<any>;/g, to: `'$notIn'?: Array<${semanticTypeName}>;` }
        ];
        
        for (const replacement of propertyReplacements) {
            const beforeReplace = newContent;
            newContent = newContent.replace(replacement.from, replacement.to);
            if (newContent !== beforeReplace) hasChanges = true;
        }
        
        // Replace 'any' with semantic type in attributeTypeMap
        const typeMapReplacements = [
            { from: /"type":\s*"any"/g, to: `"type": "${semanticTypeName}"` },
            { from: /"type":\s*"Array<any>"/g, to: `"type": "Array<${semanticTypeName}>"` }
        ];
        
        for (const replacement of typeMapReplacements) {
            const beforeReplace = newContent;
            newContent = newContent.replace(replacement.from, replacement.to);
            if (newContent !== beforeReplace) hasChanges = true;
        }
        
        return { content: newContent, hasChanges };
    }

    private camelCaseToSnakeCase(str: string): string {
        // For filter property classes, just convert the first letter to lowercase
        // since OpenAPI Generator uses camelCase for file names
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    private fixAttributeTypeMapsForUnionFields(sdkPath: string, semanticUnionFields: Array<{
        className: string;
        fieldName: string;
        semanticType: string;
        filterPropertyType: string;
    }>): void {
        console.log('  → Fixing attributeTypeMap entries for union fields...');
        
        const modelDir = path.join(sdkPath, 'model');
        if (!fs.existsSync(modelDir)) return;

        // Group fields by class name for efficient processing
        const fieldsByClass = new Map<string, Array<{fieldName: string, semanticType: string, filterPropertyType: string}>>();
        for (const field of semanticUnionFields) {
            if (!fieldsByClass.has(field.className)) {
                fieldsByClass.set(field.className, []);
            }
            fieldsByClass.get(field.className)!.push({
                fieldName: field.fieldName,
                semanticType: field.semanticType,
                filterPropertyType: field.filterPropertyType
            });
        }

        // Fix each class file
        for (const [className, fields] of fieldsByClass) {
            this.fixClassAttributeTypeMap(sdkPath, className, fields);
        }

        // Also fix main filter classes that inherit these union fields
        this.fixMainFilterClassAttributeTypeMaps(sdkPath);
    }

    private fixClassAttributeTypeMap(sdkPath: string, className: string, fields: Array<{fieldName: string, semanticType: string, filterPropertyType: string}>): void {
        const fileName = this.camelCaseToSnakeCase(className) + '.ts';
        const filePath = path.join(sdkPath, 'model', fileName);
        
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        for (const field of fields) {
            // Update attributeTypeMap entry for union field
            // Change from: "type": "FilterPropertyType"
            // To: "type": "SemanticType | FilterPropertyType"
            const oldTypePattern = new RegExp(
                `("name":\\s*"${field.fieldName}"[^}]*"type":\\s*)"${field.filterPropertyType}"`,
                'g'
            );
            
            const newType = `"${field.semanticType} | ${field.filterPropertyType}"`;
            
            if (oldTypePattern.test(content)) {
                content = content.replace(oldTypePattern, `$1${newType}`);
                hasChanges = true;
                console.log(`    ✓ Fixed attributeTypeMap for ${className}.${field.fieldName}`);
            }
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content);
        }
    }

    private fixMainFilterClassAttributeTypeMaps(sdkPath: string): void {
        const modelDir = path.join(sdkPath, 'model');
        const files = fs.readdirSync(modelDir);
        
        // Target main filter classes
        const mainFilterFiles = files.filter(file => {
            return file.endsWith('.ts') && (
                (file.includes('Filter.ts') && 
                 !file.startsWith('base') &&
                 !file.includes('FilterProperty') &&
                 !file.includes('advanced')) ||
                (file.includes('FilterFields.ts') && 
                 !file.startsWith('base') &&
                 !file.includes('FilterProperty'))
            );
        });

        for (const fileName of mainFilterFiles) {
            this.fixMainFilterAttributeTypeMap(sdkPath, fileName);
        }
    }

    private fixMainFilterAttributeTypeMap(sdkPath: string, fileName: string): void {
        const filePath = path.join(sdkPath, 'model', fileName);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Fix attributeTypeMap entries that reference inline classes
        // Change from: "type": "BaseProcessInstanceFilterFieldsProcessInstanceKey"
        // To: "type": "ProcessInstanceKey | ProcessInstanceKeyFilterProperty"
        
        const inlineClassPatterns = [
            {
                from: /"type":\s*"BaseProcessInstanceFilterFieldsProcessInstanceKey"/g,
                to: '"type": "ProcessInstanceKey | ProcessInstanceKeyFilterProperty"'
            },
            {
                from: /"type":\s*"BaseProcessInstanceFilterFieldsParentProcessInstanceKey"/g,
                to: '"type": "ProcessInstanceKey | ProcessInstanceKeyFilterProperty"'
            },
            {
                from: /"type":\s*"BaseProcessInstanceFilterFieldsParentElementInstanceKey"/g,
                to: '"type": "ElementInstanceKey | ElementInstanceKeyFilterProperty"'
            }
        ];

        for (const pattern of inlineClassPatterns) {
            if (pattern.from.test(content)) {
                content = content.replace(pattern.from, pattern.to);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content);
            console.log(`    ✓ Fixed attributeTypeMap for ${fileName}`);
        }
    }

    private addUnionSerializationSupport(sdkPath: string): void {
        console.log('  → Adding union type serialization support to ObjectSerializer...');
        
        const modelsFilePath = path.join(sdkPath, 'model', 'models.ts');
        if (!fs.existsSync(modelsFilePath)) {
            console.log('    → models.ts not found, skipping serialization enhancement');
            return;
        }

        let content = fs.readFileSync(modelsFilePath, 'utf8');
        
        // Check if union serialization support already exists
        if (content.includes('// Union type serialization support')) {
            console.log('    → Union serialization support already exists');
            return;
        }

        // Add union type detection and serialization logic
        const unionSerializationCode = this.generateUnionSerializationCode();
        
        // Insert before the serialize method
        const serializeMethodMatch = content.match(/(public static serialize\(data: any, type: string\): any \{)/);
        if (serializeMethodMatch) {
            const insertIndex = content.indexOf(serializeMethodMatch[0]);
            content = content.slice(0, insertIndex) + unionSerializationCode + '\n\n    ' + content.slice(insertIndex);
            
            // Now update the serialize method to handle union types
            content = this.updateSerializeMethod(content);
            
            // Update the deserialize method to handle union types  
            content = this.updateDeserializeMethod(content);
            
            fs.writeFileSync(modelsFilePath, content);
            console.log('    ✓ Added union type serialization support to ObjectSerializer');
        } else {
            console.log('    → Could not find serialize method, skipping union serialization enhancement');
        }
    }

    private generateUnionSerializationCode(): string {
        return `    // Union type serialization support
    private static isUnionType(type: string): boolean {
        return type.includes(' | ');
    }

    private static serializeUnionType(data: any, type: string): any {
        const unionTypes = type.split(' | ').map(t => t.trim());
        
        // If data is a string and one of the union types is a semantic type (ends with 'Key')
        const semanticType = unionTypes.find(t => t.endsWith('Key'));
        const filterPropertyType = unionTypes.find(t => t.endsWith('FilterProperty'));
        
        if (typeof data === 'string' && semanticType) {
            // Data is a semantic type - serialize as string
            return data;
        } else if (typeof data === 'object' && data !== null && filterPropertyType) {
            // Data is a filter property object - serialize using the filter property type
            return ObjectSerializer.serialize(data, filterPropertyType);
        } else if (semanticType && filterPropertyType) {
            // Default to filter property type for backward compatibility
            return ObjectSerializer.serialize(data, filterPropertyType);
        }
        
        // Fallback to first type in union
        return ObjectSerializer.serialize(data, unionTypes[0]);
    }

    private static deserializeUnionType(data: any, type: string): any {
        const unionTypes = type.split(' | ').map(t => t.trim());
        
        // If data is a string and one of the union types is a semantic type
        const semanticType = unionTypes.find(t => t.endsWith('Key'));
        const filterPropertyType = unionTypes.find(t => t.endsWith('FilterProperty'));
        
        if (typeof data === 'string' && semanticType) {
            // Data is a string - deserialize as semantic type
            return ObjectSerializer.deserialize(data, semanticType);
        } else if (typeof data === 'object' && data !== null && filterPropertyType) {
            // Data is an object - deserialize as filter property
            return ObjectSerializer.deserialize(data, filterPropertyType);
        }
        
        // Fallback to first type in union
        return ObjectSerializer.deserialize(data, unionTypes[0]);
    }`;
    }

    private updateSerializeMethod(content: string): string {
        // Find the serialize method and add union type handling at the beginning
        const serializeMethodRegex = /(public static serialize\(data: any, type: string\): any \{\s*)/;
        const unionCheckCode = `
        // Handle union types
        if (ObjectSerializer.isUnionType(type)) {
            return ObjectSerializer.serializeUnionType(data, type);
        }
        `;
        
        return content.replace(serializeMethodRegex, `$1${unionCheckCode}`);
    }

    private updateDeserializeMethod(content: string): string {
        // Find the deserialize method and add union type handling at the beginning
        const deserializeMethodRegex = /(public static deserialize\(data: any, type: string\): any \{\s*)/;
        const unionCheckCode = `
        // Handle union types
        if (ObjectSerializer.isUnionType(type)) {
            return ObjectSerializer.deserializeUnionType(data, type);
        }
        `;
        
        return content.replace(deserializeMethodRegex, `$1${unionCheckCode}`);
    }
}
