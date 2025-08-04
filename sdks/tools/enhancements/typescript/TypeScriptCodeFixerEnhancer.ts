import * as fs from 'fs';
import * as path from 'path';
import { SdkEnhancementStrategy } from "../SdkEnhancementOrchestrator";
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions } from "../../sdks";

/**
 * Fixes TypeScript code generation issues in the generated SDK
 * This enhancer addresses known issues with the OpenAPI TypeScript generator:
 * 1. Invalid "extends any" class declarations from additionalProperties: true
 * 
 * Note: Semantic type import fixes are handled by the SemanticTypeEnhancer
 */
export class TypeScriptCodeFixerEnhancer extends SdkEnhancementStrategy {
    name = 'typescript-code-fixer';
    sdkEnhancementStrategies = {
        typescript: this.enhanceTypeScript,
    }

    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    enhanceTypeScript(basePath: string): void {
        console.log('� Fixing TypeScript code generation issues...');
        
        const modelDir = path.join(basePath, 'model');
        
        if (!fs.existsSync(modelDir)) {
            console.log('Model directory not found, skipping TypeScript code fixes');
            return;
        }

        this.fixInvalidExtendsAny(modelDir);
        
        console.log('  ✓ TypeScript code fixes completed');
    }

    protected getStartMessage(): string {
        return '📝 Fixing TypeScript code generation issues...';
    }

    protected getCompletionMessage(): string {
        return '✅ All TypeScript code generation issues fixed!';
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
}
