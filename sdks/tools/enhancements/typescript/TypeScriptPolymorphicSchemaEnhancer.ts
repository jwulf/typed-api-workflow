import * as fs from 'fs';
import * as path from 'path';
import { SdkEnhancementStrategy } from "../SdkEnhancementOrchestrator";
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions } from "../../sdks";

/**
 * Generates proper TypeScript union types for polymorphic schemas
 * This enhancer addresses known issues with the OpenAPI TypeScript generator:
 * 1. Invalid "extends any" class declarations from additionalProperties: true
 * 2. Incorrect union type generation for schemas marked with x-polymorphic-schema
 * 
 * For schemas marked with x-polymorphic-schema: true, this enhancer:
 * - Converts merged classes to proper discriminated union types
 * - Maintains individual variant classes for each oneOf option
 * - Updates models.ts to handle union types correctly
 * 
 * Note: Semantic type import fixes are handled by the SemanticTypeEnhancer
 */
export class TypeScriptPolymorphicSchemaEnhancer extends SdkEnhancementStrategy {
    name = 'typescript-polymorphic-schema';
    sdkEnhancementStrategies = {
        typescript: this.enhanceTypeScript,
    }

    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    enhanceTypeScript(basePath: string): void {
        console.log('📝 Generating proper union types for polymorphic schemas...');
        
        const modelDir = path.join(basePath, 'model');
        
        if (!fs.existsSync(modelDir)) {
            console.log('Model directory not found, skipping polymorphic schema enhancements');
            return;
        }

        this.fixInvalidExtendsAny(modelDir);
        this.fixPolymorphicSchemaTypes(modelDir);
        
        console.log('  ✓ Polymorphic schema enhancements completed');
    }

    protected getStartMessage(): string {
        return '📝 Generating proper union types for polymorphic schemas...';
    }

    protected getCompletionMessage(): string {
        return '✅ All polymorphic schema enhancements completed!';
    }

    /**
     * Fixes the "extends any" issue in generated classes
     * This happens when OpenAPI schemas have additionalProperties: true
     */
    private fixInvalidExtendsAny(modelDir: string): void {
        console.log('📝 Fixing invalid "extends any" declarations...');
        
        const files = fs.readdirSync(modelDir).filter(file => file.endsWith('.ts'));
        let fixedCount = 0;
        
        for (const file of files) {
            const filePath = path.join(modelDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Check if file has the "extends any" issue
            if (content.includes('extends any')) {
                console.log(`  ✓ Fixing invalid "extends any" in ${file}`);
                
                // Replace "extends any" with proper interface approach
                content = content.replace(
                    /export class (\w+) extends any \{/g,
                    'export class $1 {\n    [key: string]: any;'
                );
                
                // Remove the super.getAttributeTypeMap() call since there's no super class
                content = content.replace(
                    /return super\.getAttributeTypeMap\(\)\.concat\((\w+)\.attributeTypeMap\);/g,
                    'return $1.attributeTypeMap;'
                );
                
                fs.writeFileSync(filePath, content, 'utf8');
                fixedCount++;
            }
        }
        
        if (fixedCount > 0) {
            console.log(`  ✓ Fixed ${fixedCount} files with "extends any" issues`);
        } else {
            console.log('  ✓ No "extends any" issues found');
        }
    }

    /**
     * Converts incorrectly generated merged classes to proper discriminated union types
     * for schemas marked with x-polymorphic-schema
     */
    private fixPolymorphicSchemaTypes(modelDir: string): void {
        console.log('📝 Converting polymorphic schemas to proper union types...');
        
        // Find schemas marked with x-polymorphic-schema in the original spec
        const unionSchemas = this.findPolymorphicSchemas();
        
        if (unionSchemas.length === 0) {
            console.log('  ✓ No polymorphic schemas requiring conversion found');
            return;
        }

        let fixedCount = 0;
        
        for (const unionSchema of unionSchemas) {
            const unionFilePath = path.join(modelDir, `${this.camelCaseToKebabCase(unionSchema.name)}.ts`);
            
            if (fs.existsSync(unionFilePath)) {
                console.log(`  ✓ Converting merged class to union type: ${unionSchema.name}`);
                
                // Generate proper union type
                const unionTypeDefinition = this.generateUnionTypeDefinition(unionSchema);
                fs.writeFileSync(unionFilePath, unionTypeDefinition, 'utf8');
                
                // Also fix the models.ts file to remove the union type from typeMap
                this.fixModelsFile(modelDir, unionSchema.name);
                
                fixedCount++;
            }
        }
        
        if (fixedCount > 0) {
            console.log(`  ✓ Fixed ${fixedCount} union types`);
        } else {
            console.log('  ✓ No union type files found to fix');
        }
    }

    /**
     * Remove union types from the typeMap in models.ts since they are not classes
     */
    private fixModelsFile(modelDir: string, unionTypeName: string): void {
        const modelsFilePath = path.join(modelDir, 'models.ts');
        
        if (fs.existsSync(modelsFilePath)) {
            let content = fs.readFileSync(modelsFilePath, 'utf8');
            
            // Remove the union type from the typeMap
            const entryPattern = new RegExp(`    "${unionTypeName}": ${unionTypeName},?\n`, 'g');
            content = content.replace(entryPattern, '');
            
            fs.writeFileSync(modelsFilePath, content, 'utf8');
        }
    }

    /**
     * Find schemas in the spec that are marked with x-polymorphic-schema
     */
    private findPolymorphicSchemas(): Array<{ name: string, oneOf: string[], description?: string }> {
        const schemas = this.spec.components?.schemas || {};
        const unionSchemas: Array<{ name: string, oneOf: string[], description?: string }> = [];
        
        for (const [schemaName, schema] of Object.entries(schemas)) {
            if (typeof schema === 'object' && 'x-polymorphic-schema' in schema && schema['x-polymorphic-schema']) {
                const oneOf = (schema as any).oneOf;
                if (oneOf && Array.isArray(oneOf)) {
                    const variants = oneOf
                        .filter((variant: any) => variant.$ref)
                        .map((variant: any) => variant.$ref.split('/').pop());
                    
                    unionSchemas.push({
                        name: schemaName,
                        oneOf: variants,
                        description: (schema as any).description
                    });
                }
            }
        }
        
        return unionSchemas;
    }

    /**
     * Convert PascalCase to camelCase for file names (first letter lowercase)
     */
    private camelCaseToKebabCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    /**
     * Generate proper TypeScript union type definition
     */
    private generateUnionTypeDefinition(unionSchema: { name: string, oneOf: string[], description?: string }): string {
        const imports = unionSchema.oneOf.map(variant => 
            `import { ${variant} } from './${this.camelCaseToKebabCase(variant)}';`
        ).join('\n');

        const unionType = unionSchema.oneOf.join(' | ');
        const description = unionSchema.description || `Union type for ${unionSchema.name}`;

        return `/**
 * Orchestration Cluster REST API
 * API for communicating with a Camunda 8 cluster.
 *
 * The version of the OpenAPI document: 0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

${imports}

/**
 * ${description}
 */
export type ${unionSchema.name} = ${unionType};
`;
    }
}
