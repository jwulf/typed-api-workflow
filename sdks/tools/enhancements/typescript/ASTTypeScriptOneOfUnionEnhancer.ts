import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { OpenAPIV3 } from 'openapi-types';
import { SdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { SdkDefinitions } from '../../sdks';

/**
 * AST-based version of TypeScriptOneOfUnionEnhancer that uses the TypeScript Compiler API
 * for precise and reliable code transformations instead of fragile regex patterns.
 * 
 * Fixes OneOf union types that were incorrectly generated as separate classes
 * due to an OpenAPI Generator issue.
 * 
 * The bug causes oneOf unions like:
 * oneOf:
 *   - $ref: "#/components/schemas/ProcessInstanceKey"  
 *   - $ref: "#/components/schemas/AdvancedProcessInstanceKeyFilter"
 * 
 * To be generated as separate classes (e.g., BaseProcessInstanceFilterFieldsProcessInstanceKey)
 * instead of proper TypeScript union types (ProcessInstanceKey | AdvancedProcessInstanceKeyFilter).
 */
export class ASTTypeScriptOneOfUnionEnhancer extends SdkEnhancementStrategy {
    name = 'ast-typescript-oneOf-union-enhancer';
    
    sdkEnhancementStrategies = {
        typescript: this.enhanceTypeScript,
    }

    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    private enhanceTypeScript(sdkPath: string): void {
        console.log('🔧 Fixing OneOf union types with AST...');
        
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

        // Phase 4: Fix all confirmed issues using AST
        this.fixAllOneOfIssuesWithAST(sdkPath, confirmedIssues);
        
        // Phase 5: Fix advanced filter type annotations  
        this.fixAdvancedFilterTypesWithAST(sdkPath);
        
        console.log('  ✅ OneOf union types fixed with AST');
    }

    /**
     * Fix all OneOf issues using TypeScript AST transformations
     */
    private fixAllOneOfIssuesWithAST(sdkPath: string, confirmedIssues: OneOfIssue[]): void {
        console.log(`  📋 Fixing ${confirmedIssues.length} OneOf issues with AST transformations`);
        
        // Group issues by the files they affect
        const fileChanges = new Map<string, Array<{issue: OneOfIssue, unionType: string}>>();
        
        // First pass: delete problematic files and collect changes needed
        for (const issue of confirmedIssues) {
            console.log(`    🔧 Processing ${issue.className} -> ${issue.originalSpec.unionTypes.join(' | ')}`);
            
            if (issue.isEmbedded) {
                // For embedded issues, fix the property type directly in the parent class
                this.fixEmbeddedOneOfPropertyWithAST(issue);
            } else {
                // For separate class issues, delete the problematic file
                fs.unlinkSync(issue.filePath);
                this.removeFromModelsExportsWithAST(sdkPath, issue.className);
                
                // Collect the changes needed for each file that imports this deleted class
                const unionTypeString = issue.originalSpec.unionTypes.join(' | ');
                const modelsDir = path.join(sdkPath, 'model');
                const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
                
                for (const file of files) {
                    const filePath = path.join(modelsDir, file);
                    if (fs.existsSync(filePath)) {
                        const sourceFile = this.parseTypeScriptFile(filePath);
                        if (this.containsReference(sourceFile, issue.className)) {
                            if (!fileChanges.has(filePath)) {
                                fileChanges.set(filePath, []);
                            }
                            fileChanges.get(filePath)!.push({issue, unionType: unionTypeString});
                        }
                    }
                }
            }
        }
        
        // Second pass: apply all changes to each file using AST
        for (const [filePath, changes] of fileChanges.entries()) {
            const fileName = path.basename(filePath);
            console.log(`    🔧 Applying ${changes.length} AST changes to ${fileName}`);
            
            this.transformFileWithAST(filePath, changes);
        }
    }

    /**
     * Parse a TypeScript file into an AST
     */
    private parseTypeScriptFile(filePath: string): ts.SourceFile {
        const content = fs.readFileSync(filePath, 'utf8');
        return ts.createSourceFile(
            filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        );
    }

    /**
     * Check if a source file contains references to a specific class name
     */
    private containsReference(sourceFile: ts.SourceFile, className: string): boolean {
        let found = false;
        
        function visit(node: ts.Node): void {
            if (found) return;
            
            // Check identifiers
            if (ts.isIdentifier(node) && node.text === className) {
                found = true;
                return;
            }
            
            // Check string literals (for import paths, etc.)
            if (ts.isStringLiteral(node) && node.text.includes(className)) {
                found = true;
                return;
            }
            
            ts.forEachChild(node, visit);
        }
        
        visit(sourceFile);
        return found;
    }

    /**
     * Transform a TypeScript file using AST transformations
     */
    private transformFileWithAST(filePath: string, changes: Array<{issue: OneOfIssue, unionType: string}>): void {
        const sourceFile = this.parseTypeScriptFile(filePath);
        const fileName = path.basename(filePath);
        
        // Collect all union types we need to import
        const unionTypesToImport = new Set<string>();
        const deletedClasses = new Set<string>();
        
        for (const {issue} of changes) {
            deletedClasses.add(issue.className);
            for (const unionType of issue.originalSpec.unionTypes) {
                unionTypesToImport.add(unionType);
            }
        }

        // Create transformer
        const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
            return (sourceFile) => {
                const visitor = (node: ts.Node): ts.Node | ts.Node[] | undefined => {
                    // Transform import declarations
                    if (ts.isImportDeclaration(node)) {
                        return this.transformImportDeclaration(node, deletedClasses, unionTypesToImport);
                    }
                    
                    // Transform export declarations (for models.ts)
                    if (ts.isExportDeclaration(node) && fileName === 'models.ts') {
                        return this.transformExportDeclaration(node, deletedClasses);
                    }
                    
                    // Transform property signatures (property declarations)
                    if (ts.isPropertySignature(node)) {
                        return this.transformPropertySignature(node, changes);
                    }
                    
                    // Transform object literal properties (for attributeTypeMap and models.ts exports)
                    if (ts.isPropertyAssignment(node)) {
                        return this.transformPropertyAssignment(node, changes);
                    }
                    
                    // Transform type references in other contexts
                    if (ts.isTypeReferenceNode(node)) {
                        for (const {issue} of changes) {
                            if (ts.isIdentifier(node.typeName) && node.typeName.text === issue.className) {
                                // Replace with union type
                                return this.createUnionTypeNode(issue.originalSpec.unionTypes);
                            }
                        }
                    }
                    
                    // Handle object literal properties for models.ts export object
                    if (fileName === 'models.ts' && ts.isObjectLiteralExpression(node)) {
                        const filteredProperties = node.properties.filter(prop => {
                            if (ts.isPropertyAssignment(prop)) {
                                const keyName = this.getPropertyAssignmentKey(prop);
                                return keyName ? !deletedClasses.has(keyName) : true;
                            }
                            return true;
                        });
                        
                        if (filteredProperties.length !== node.properties.length) {
                            return ts.factory.createObjectLiteralExpression(filteredProperties);
                        }
                    }
                    
                    return ts.visitEachChild(node, visitor, context);
                };
                
                let result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;
                
                // Add necessary imports
                result = this.addNecessaryImports(result, unionTypesToImport);
                
                return result;
            };
        };

        // Apply transformation
        const result = ts.transform(sourceFile, [transformer]);
        const transformedSourceFile = result.transformed[0];
        
        // Print the transformed AST back to TypeScript code
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        const transformedCode = printer.printFile(transformedSourceFile);
        
        // Write the transformed code back to the file
        fs.writeFileSync(filePath, transformedCode);
        console.log(`    ✓ Updated ${fileName} with AST transformations`);
        
        result.dispose();
    }

    /**
     * Transform import declarations to remove deleted classes and add union types
     */
    private transformImportDeclaration(
        node: ts.ImportDeclaration, 
        deletedClasses: Set<string>, 
        unionTypesToImport: Set<string>
    ): ts.ImportDeclaration | undefined {
        if (!node.importClause || !node.importClause.namedBindings) {
            return node;
        }

        const namedBindings = node.importClause.namedBindings;
        if (!ts.isNamedImports(namedBindings)) {
            return node;
        }

        // Filter out deleted classes from import elements
        const filteredElements = namedBindings.elements.filter(element => {
            const importName = element.name.text;
            return !deletedClasses.has(importName);
        });

        // If no elements left, remove the entire import
        if (filteredElements.length === 0) {
            return undefined;
        }

        // If elements were removed, create a new import declaration
        if (filteredElements.length !== namedBindings.elements.length) {
            const newNamedBindings = ts.factory.createNamedImports(filteredElements);
            const newImportClause = ts.factory.createImportClause(
                false,
                node.importClause.name,
                newNamedBindings
            );
            return ts.factory.createImportDeclaration(
                node.modifiers,
                newImportClause,
                node.moduleSpecifier,
                node.assertClause
            );
        }

        return node;
    }

    /**
     * Transform export declarations to remove deleted classes (for models.ts)
     */
    private transformExportDeclaration(
        node: ts.ExportDeclaration, 
        deletedClasses: Set<string>
    ): ts.ExportDeclaration | undefined {
        if (!node.exportClause || !ts.isNamedExports(node.exportClause)) {
            return node;
        }

        // Filter out deleted classes from export elements
        const filteredElements = node.exportClause.elements.filter(element => {
            const exportName = element.name.text;
            return !deletedClasses.has(exportName);
        });

        // If no elements left, remove the entire export
        if (filteredElements.length === 0) {
            return undefined;
        }

        // If elements were removed, create a new export declaration
        if (filteredElements.length !== node.exportClause.elements.length) {
            const newNamedExports = ts.factory.createNamedExports(filteredElements);
            return ts.factory.createExportDeclaration(
                node.modifiers,
                false,
                newNamedExports,
                node.moduleSpecifier,
                node.assertClause
            );
        }

        return node;
    }

    /**
     * Transform property signatures to replace deleted class types with union types
     */
    private transformPropertySignature(
        node: ts.PropertySignature, 
        changes: Array<{issue: OneOfIssue, unionType: string}>
    ): ts.PropertySignature {
        if (!node.type) {
            return node;
        }

        // Check if this property type needs to be replaced
        for (const {issue, unionType} of changes) {
            if (this.typeReferencesClass(node.type, issue.className)) {
                // Create union type node
                const unionTypeNode = this.createUnionTypeNode(issue.originalSpec.unionTypes);
                
                // Create new property signature with union type
                return ts.factory.createPropertySignature(
                    node.modifiers,
                    node.name,
                    node.questionToken,
                    unionTypeNode
                );
            }
        }

        return node;
    }

    /**
     * Transform property assignments (for attributeTypeMap entries)
     */
    private transformPropertyAssignment(
        node: ts.PropertyAssignment, 
        changes: Array<{issue: OneOfIssue, unionType: string}>
    ): ts.PropertyAssignment {
        // Check if this is a "type" property in attributeTypeMap
        if (ts.isStringLiteral(node.name) && node.name.text === 'type') {
            if (ts.isStringLiteral(node.initializer)) {
                const typeName = node.initializer.text;
                
                // Find if this type is one of our deleted classes
                for (const {issue, unionType} of changes) {
                    if (typeName === issue.className) {
                        // Replace with union type string
                        return ts.factory.createPropertyAssignment(
                            node.name,
                            ts.factory.createStringLiteral(unionType)
                        );
                    }
                }
            }
        }

        return node;
    }

    /**
     * Check if a type node references a specific class name
     */
    private typeReferencesClass(typeNode: ts.TypeNode, className: string): boolean {
        if (ts.isTypeReferenceNode(typeNode)) {
            if (ts.isIdentifier(typeNode.typeName) && typeNode.typeName.text === className) {
                return true;
            }
        }
        
        // Check union types, intersection types, etc.
        if ('types' in typeNode && Array.isArray((typeNode as any).types)) {
            for (const subType of (typeNode as any).types) {
                if (this.typeReferencesClass(subType, className)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Get the property name from a property signature
     */
    private getPropertyName(node: ts.PropertySignature | ts.PropertyDeclaration): string | null {
        if (ts.isStringLiteral(node.name)) {
            return node.name.text;
        }
        if (ts.isIdentifier(node.name)) {
            return node.name.text;
        }
        return null;
    }

    /**
     * Get the key name from a property assignment
     */
    private getPropertyAssignmentKey(node: ts.PropertyAssignment): string | null {
        if (ts.isStringLiteral(node.name)) {
            return node.name.text;
        }
        if (ts.isIdentifier(node.name)) {
            return node.name.text;
        }
        return null;
    }

    /**
     * Create a union type node from an array of type names
     */
    private createUnionTypeNode(typeNames: string[]): ts.TypeNode {
        const typeNodes = typeNames.map(typeName => 
            ts.factory.createTypeReferenceNode(typeName)
        );
        
        if (typeNodes.length === 1) {
            return typeNodes[0];
        }
        
        return ts.factory.createUnionTypeNode(typeNodes);
    }

    /**
     * Add necessary imports for union types to a source file
     */
    private addNecessaryImports(sourceFile: ts.SourceFile, unionTypesToImport: Set<string>): ts.SourceFile {
        if (unionTypesToImport.size === 0) {
            return sourceFile;
        }

        const statements = [...sourceFile.statements];
        const existingImports = this.getExistingImports(sourceFile);
        
        // Separate semantic types and advanced filter types
        const semanticTypes: string[] = [];
        const advancedFilterTypes: string[] = [];
        
        for (const typeName of unionTypesToImport) {
            if (this.isSemanticType(typeName) && !existingImports.has(typeName)) {
                semanticTypes.push(typeName);
            } else if (this.isAdvancedFilterType(typeName) && !existingImports.has(typeName)) {
                advancedFilterTypes.push(typeName);
            }
        }

        // Add semantic types import
        if (semanticTypes.length > 0) {
            const semanticImport = this.createSemanticTypesImport(semanticTypes);
            statements.unshift(semanticImport);
        }

        // Add advanced filter imports
        for (const filterType of advancedFilterTypes) {
            const filterImport = this.createAdvancedFilterImport(filterType);
            statements.unshift(filterImport);
        }

        return ts.factory.updateSourceFile(sourceFile, statements);
    }

    /**
     * Get existing imports from a source file
     */
    private getExistingImports(sourceFile: ts.SourceFile): Set<string> {
        const imports = new Set<string>();
        
        for (const statement of sourceFile.statements) {
            if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings) {
                const namedBindings = statement.importClause.namedBindings;
                if (ts.isNamedImports(namedBindings)) {
                    for (const element of namedBindings.elements) {
                        imports.add(element.name.text);
                    }
                }
            }
        }
        
        return imports;
    }

    /**
     * Create an import declaration for semantic types
     */
    private createSemanticTypesImport(typeNames: string[]): ts.ImportDeclaration {
        const importSpecifiers = typeNames.map(typeName =>
            ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(typeName))
        );
        
        const namedImports = ts.factory.createNamedImports(importSpecifiers);
        const importClause = ts.factory.createImportClause(false, undefined, namedImports);
        
        return ts.factory.createImportDeclaration(
            undefined,
            importClause,
            ts.factory.createStringLiteral('../semanticTypes')
        );
    }

    /**
     * Create an import declaration for an advanced filter type
     */
    private createAdvancedFilterImport(typeName: string): ts.ImportDeclaration {
        const fileName = this.camelCase(typeName);
        
        const importSpecifier = ts.factory.createImportSpecifier(
            false, 
            undefined, 
            ts.factory.createIdentifier(typeName)
        );
        
        const namedImports = ts.factory.createNamedImports([importSpecifier]);
        const importClause = ts.factory.createImportClause(false, undefined, namedImports);
        
        return ts.factory.createImportDeclaration(
            undefined,
            importClause,
            ts.factory.createStringLiteral(`./${fileName}`)
        );
    }

    /**
     * Fix embedded oneOf properties using AST
     */
    private fixEmbeddedOneOfPropertyWithAST(issue: OneOfIssue): void {
        console.log(`    🔧 Fixing embedded property ${issue.pattern.propertyName} in ${issue.className}`);
        
        // For embedded properties, we need to construct the correct union types
        // Extract semantic type name from the property name
        const semanticTypeName = this.extractSemanticTypeFromPropertyName(issue.pattern.propertyName);
        if (!semanticTypeName) {
            console.log(`    ⚠️  Could not extract semantic type for ${issue.pattern.propertyName}`);
            return;
        }
        
        const advancedFilterName = `Advanced${semanticTypeName}Filter`;
        const correctUnionTypes = [semanticTypeName, advancedFilterName];
        
        console.log(`    🎯 Creating union: ${correctUnionTypes.join(' | ')}`);
        
        const sourceFile = this.parseTypeScriptFile(issue.filePath);
        
        const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
            return (sourceFile) => {
                console.log(`    🔍 Processing file: ${issue.filePath}`);
                let transformationCount = 0;
                
                const visitor = (node: ts.Node): ts.Node => {
                    // Debug all node types to understand the structure
                    if (ts.isClassDeclaration(node)) {
                        console.log(`    📦 Found class declaration: ${node.name?.text}`);
                    }
                    
                    // Check for property signatures (interfaces/types)
                    if (ts.isPropertySignature(node)) {
                        const parent = node.parent;
                        const isInClassDeclaration = parent && (ts.isClassDeclaration(parent) || ts.isInterfaceDeclaration(parent));
                        
                        if (isInClassDeclaration) {
                            const propertyName = this.getPropertyName(node);
                            console.log(`    🔍 Visiting property signature: ${propertyName} (line ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1})`);
                            
                            if (node.type && propertyName === issue.pattern.propertyName) {
                                console.log(`    ⚡ FOUND TARGET PROPERTY SIGNATURE: ${propertyName}`);
                                // Transform logic here...
                            }
                        }
                    }
                    
                    // Check for property declarations (classes)
                    if (ts.isPropertyDeclaration(node)) {
                        const parent = node.parent;
                        const isInClassDeclaration = parent && ts.isClassDeclaration(parent);
                        
                        if (isInClassDeclaration) {
                            const propertyName = this.getPropertyName(node);
                            console.log(`    🔍 Visiting property declaration: ${propertyName} (line ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1})`);
                            
                            if (node.type && propertyName === issue.pattern.propertyName) {
                                console.log(`    ⚡ FOUND TARGET PROPERTY DECLARATION: ${propertyName}`);
                                console.log(`    📋 Current property type: ${node.type.getText(sourceFile)}`);
                                console.log(`    🔧 Has question token: ${!!node.questionToken}`);
                                
                                // Create union type node with correct types (never include null for optional properties)
                                const finalUnionTypes = [...correctUnionTypes];
                                console.log(`    🎯 Creating new union: ${finalUnionTypes.join(' | ')}`);
                                const unionTypeNode = this.createUnionTypeNode(finalUnionTypes);
                                
                                // Create new property declaration with union type
                                const newProperty = ts.factory.createPropertyDeclaration(
                                    node.modifiers,
                                    node.name,
                                    node.questionToken,
                                    unionTypeNode,
                                    node.initializer
                                );
                                transformationCount++;
                                console.log(`    ✅ TRANSFORMATION ${transformationCount}: Created new property declaration`);
                                return newProperty;
                            }
                        }
                    }
                    
                    return ts.visitEachChild(node, visitor, context);
                };
                
                let result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;
                
                // Add necessary imports
                const unionTypesToImport = new Set(correctUnionTypes);
                result = this.addNecessaryImports(result, unionTypesToImport);
                
                return result;
            };
        };

        // Apply transformation
        const result = ts.transform(sourceFile, [transformer]);
        const transformedSourceFile = result.transformed[0];
        
        // Print and save
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        const transformedCode = printer.printFile(transformedSourceFile);
        fs.writeFileSync(issue.filePath, transformedCode);
        
        console.log(`    ✓ Fixed embedded property ${issue.pattern.propertyName} with AST`);
        result.dispose();
    }

    /**
     * Remove class from models.ts exports using AST
     */
    private removeFromModelsExportsWithAST(sdkPath: string, className: string): void {
        const modelsPath = path.join(sdkPath, 'model', 'models.ts');
        if (!fs.existsSync(modelsPath)) return;
        
        const sourceFile = this.parseTypeScriptFile(modelsPath);
        const camelCaseFileName = this.camelCaseToKebab(className);
        
        const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
            return (sourceFile) => {
                const visitor = (node: ts.Node): ts.Node | ts.Node[] | undefined => {
                    // Remove export declarations that reference the deleted file
                    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
                        if (ts.isStringLiteral(node.moduleSpecifier)) {
                            const modulePath = node.moduleSpecifier.text;
                            if (modulePath === `./${camelCaseFileName}`) {
                                return undefined; // Remove this export
                            }
                        }
                    }
                    
                    return ts.visitEachChild(node, visitor, context);
                };
                
                return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
            };
        };

        const result = ts.transform(sourceFile, [transformer]);
        const transformedSourceFile = result.transformed[0];
        
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        const transformedCode = printer.printFile(transformedSourceFile);
        fs.writeFileSync(modelsPath, transformedCode);
        
        result.dispose();
    }

    /**
     * Fix advanced filter type annotations using AST
     */
    private fixAdvancedFilterTypesWithAST(sdkPath: string): void {
        console.log('    🔧 Fixing advanced filter type annotations with AST...');
        
        const modelsDir = path.join(sdkPath, 'model');
        const advancedFilterFiles = fs.readdirSync(modelsDir)
            .filter(f => f.startsWith('advanced') && f.endsWith('Filter.ts'));
        
        for (const file of advancedFilterFiles) {
            const filePath = path.join(modelsDir, file);
            const semanticTypeName = this.extractSemanticTypeFromFileName(file);
            
            if (!semanticTypeName) continue;
            
            this.transformAdvancedFilterFileWithAST(filePath, semanticTypeName);
        }
    }

    /**
     * Transform an advanced filter file using AST
     */
    private transformAdvancedFilterFileWithAST(filePath: string, semanticTypeName: string): void {
        const sourceFile = this.parseTypeScriptFile(filePath);
        const fileName = path.basename(filePath);
        
        const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
            return (sourceFile) => {
                const visitor = (node: ts.Node): ts.Node => {
                    // Transform property signatures with 'any' types
                    if (ts.isPropertySignature(node) && node.type) {
                        const propertyName = this.getPropertyName(node);
                        console.log(`    🔍 Found property: ${propertyName}, type kind: ${ts.SyntaxKind[node.type.kind]}`);
                        
                        // Fix simple properties: '$eq'?: any; -> '$eq'?: SemanticType;
                        if ((propertyName === '$eq' || propertyName === '$neq') && 
                            node.type.kind === ts.SyntaxKind.AnyKeyword) {
                            
                            console.log(`    ✅ Transforming simple property: ${propertyName} from any to ${semanticTypeName}`);
                            return ts.factory.createPropertySignature(
                                node.modifiers,
                                node.name,
                                node.questionToken,
                                ts.factory.createTypeReferenceNode(semanticTypeName)
                            );
                        }
                        
                        // Fix array properties: '$in'?: Array<any>; -> '$in'?: Array<SemanticType>;
                        if ((propertyName === '$in' || propertyName === '$notIn') &&
                            ts.isTypeReferenceNode(node.type) &&
                            ts.isIdentifier(node.type.typeName) &&
                            node.type.typeName.text === 'Array' &&
                            node.type.typeArguments &&
                            node.type.typeArguments.length === 1) {
                            
                            const typeArg = node.type.typeArguments[0];
                            console.log(`    🔍 Found array property: ${propertyName}, array type arg kind: ${ts.SyntaxKind[typeArg.kind]}`);
                            if (typeArg.kind === ts.SyntaxKind.AnyKeyword) {
                                
                                console.log(`    ✅ Transforming array property: ${propertyName} from Array<any> to Array<${semanticTypeName}>`);
                                const newTypeArg = ts.factory.createTypeReferenceNode(semanticTypeName);
                                const newArrayType = ts.factory.createTypeReferenceNode(
                                    'Array',
                                    [newTypeArg]
                                );
                                
                                return ts.factory.createPropertySignature(
                                    node.modifiers,
                                    node.name,
                                    node.questionToken,
                                    newArrayType
                                );
                            }
                        }
                    }
                    
                    // Check for property declarations too (in case it's a class, not interface)
                    if (ts.isPropertyDeclaration(node) && node.type) {
                        const propertyName = this.getPropertyName(node);
                        console.log(`    🔍 Found property declaration: ${propertyName}, type kind: ${ts.SyntaxKind[node.type.kind]}`);
                        
                        // Fix simple properties: '$eq'?: any; -> '$eq'?: SemanticType;
                        if ((propertyName === '$eq' || propertyName === '$neq') && 
                            node.type.kind === ts.SyntaxKind.AnyKeyword) {
                            
                            console.log(`    ✅ Transforming simple property declaration: ${propertyName} from any to ${semanticTypeName}`);
                            return ts.factory.createPropertyDeclaration(
                                node.modifiers,
                                node.name,
                                node.questionToken,
                                ts.factory.createTypeReferenceNode(semanticTypeName),
                                node.initializer
                            );
                        }
                        
                        // Fix array properties: '$in'?: Array<any>; -> '$in'?: Array<SemanticType>;
                        if ((propertyName === '$in' || propertyName === '$notIn') &&
                            ts.isTypeReferenceNode(node.type) &&
                            ts.isIdentifier(node.type.typeName) &&
                            node.type.typeName.text === 'Array' &&
                            node.type.typeArguments &&
                            node.type.typeArguments.length === 1) {
                            
                            const typeArg = node.type.typeArguments[0];
                            console.log(`    🔍 Found array property declaration: ${propertyName}, array type arg kind: ${ts.SyntaxKind[typeArg.kind]}`);
                            if (typeArg.kind === ts.SyntaxKind.AnyKeyword) {
                                
                                console.log(`    ✅ Transforming array property declaration: ${propertyName} from Array<any> to Array<${semanticTypeName}>`);
                                const newTypeArg = ts.factory.createTypeReferenceNode(semanticTypeName);
                                const newArrayType = ts.factory.createTypeReferenceNode(
                                    'Array',
                                    [newTypeArg]
                                );
                                
                                return ts.factory.createPropertyDeclaration(
                                    node.modifiers,
                                    node.name,
                                    node.questionToken,
                                    newArrayType,
                                    node.initializer
                                );
                            }
                        }
                    }
                    
                    // Transform attributeTypeMap string values
                    if (ts.isPropertyAssignment(node) && 
                        ts.isStringLiteral(node.name) && 
                        node.name.text === 'type' &&
                        ts.isStringLiteral(node.initializer)) {
                        
                        const typeValue = node.initializer.text;
                        if (typeValue === 'any') {
                            return ts.factory.createPropertyAssignment(
                                node.name,
                                ts.factory.createStringLiteral(semanticTypeName)
                            );
                        } else if (typeValue === 'Array<any>') {
                            return ts.factory.createPropertyAssignment(
                                node.name,
                                ts.factory.createStringLiteral(`Array<${semanticTypeName}>`)
                            );
                        }
                    }
                    
                    return ts.visitEachChild(node, visitor, context);
                };
                
                let result = ts.visitNode(sourceFile, visitor) as ts.SourceFile;
                
                // Add semantic type import
                const unionTypesToImport = new Set([semanticTypeName]);
                result = this.addNecessaryImports(result, unionTypesToImport);
                
                return result;
            };
        };

        const result = ts.transform(sourceFile, [transformer]);
        const transformedSourceFile = result.transformed[0];
        
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        const transformedCode = printer.printFile(transformedSourceFile);
        fs.writeFileSync(filePath, transformedCode);
        
        console.log(`    ✓ Fixed advanced filter types in ${fileName} with AST`);
        result.dispose();
    }

    // Reuse existing methods from the original enhancer...
    // [All the analysis methods remain the same as they work with the YAML spec]
    
    private findProblematicOneOfPatterns(): ProblematicOneOfPattern[] {
        const patterns: ProblematicOneOfPattern[] = [];
        
        if (!this.spec.components?.schemas) return patterns;
        
        for (const [schemaName, schema] of Object.entries(this.spec.components.schemas)) {
            if (!schema || typeof schema !== 'object') continue;
            
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

    private findOneOfProperties(schema: any): OneOfProperty[] {
        const properties: OneOfProperty[] = [];
        
        if (schema.properties) {
            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                const oneOfProp = this.extractOneOfProperty(propName, propSchema);
                if (oneOfProp) {
                    properties.push(oneOfProp);
                }
            }
        }
        
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

    private extractOneOfProperty(propertyName: string, propertySchema: any): OneOfProperty | null {
        if (!propertySchema || !('oneOf' in propertySchema) || !propertySchema.oneOf) {
            return null;
        }
        
        const unionTypes: string[] = [];
        
        for (const option of propertySchema.oneOf) {
            if ('$ref' in option && option.$ref) {
                const typeName = option.$ref.split('/').pop();
                if (typeName) {
                    unionTypes.push(typeName);
                }
            }
        }
        
        if (unionTypes.length === 0) {
            return null;
        }
        
        return {
            propertyName,
            unionTypes,
            description: propertySchema.description || ''
        };
    }

    private predictGeneratedClassNames(patterns: ProblematicOneOfPattern[]): PredictedGeneratedClass[] {
        const predictions: PredictedGeneratedClass[] = [];
        
        for (const pattern of patterns) {
            const pascalCaseProperty = this.toPascalCase(pattern.propertyName);
            const directConcatenation = `${pattern.parentSchemaName}${pascalCaseProperty}`;
            const underscoreBasedName = this.convertUnderscoreBasedName(pattern.parentSchemaName, pattern.propertyName);
            
            console.log(`    🎯 Predicting: ${pattern.parentSchemaName}.${pattern.propertyName} -> ${directConcatenation} OR ${underscoreBasedName}`);
            
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

    private convertUnderscoreBasedName(parentSchemaName: string, propertyName: string): string {
        const underscoreName = `${parentSchemaName}_${propertyName}`;
        return this.camelCase(underscoreName.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase()));
    }

    private validatePredictedClasses(sdkPath: string, predictions: PredictedGeneratedClass[]): OneOfIssue[] {
        const confirmedIssues: OneOfIssue[] = [];
        const modelsDir = path.join(sdkPath, 'model');
        
        if (!fs.existsSync(modelsDir)) return confirmedIssues;
        
        for (const prediction of predictions) {
            const camelCaseFileName = this.camelCase(prediction.predictedClassName);
            const filePath = path.join(modelsDir, `${camelCaseFileName}.ts`);
            
            console.log(`    🔍 Looking for file: ${camelCaseFileName}.ts for class ${prediction.predictedClassName}`);
            
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
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
                
                const embeddedIssue = this.checkEmbeddedOneOfIssue(sdkPath, prediction.originalPattern);
                if (embeddedIssue) {
                    confirmedIssues.push(embeddedIssue);
                }
            }
        }
        
        return confirmedIssues;
    }

    private checkEmbeddedOneOfIssue(sdkPath: string, pattern: ProblematicOneOfPattern): OneOfIssue | null {
        const modelsDir = path.join(sdkPath, 'model');
        const parentFileName = this.camelCase(pattern.parentSchemaName);
        const parentFilePath = path.join(modelsDir, `${parentFileName}.ts`);
        
        if (!fs.existsSync(parentFilePath)) {
            return null;
        }
        
        const content = fs.readFileSync(parentFilePath, 'utf8');
        const semanticTypeName = this.extractSemanticTypeFromPattern(pattern);
        if (!semanticTypeName) return null;
        
        const advancedFilterName = `Advanced${semanticTypeName}Filter`;
        const propertyRegex = new RegExp(`'${pattern.propertyName}'\\?:\\s*${advancedFilterName}(?:\\s*\\|\\s*null)?;`);
        const propertyMatch = content.match(propertyRegex);
        
        if (propertyMatch) {
            console.log(`    ✅ Confirmed embedded issue: ${pattern.parentSchemaName}.${pattern.propertyName} has wrong type (missing ${semanticTypeName})`);
            
            return {
                className: pattern.parentSchemaName,
                filePath: parentFilePath,
                content,
                pattern: {
                    className: pattern.parentSchemaName,
                    parentClassName: pattern.parentSchemaName,
                    propertyName: pattern.propertyName
                },
                originalSpec: {
                    propertyName: pattern.propertyName,
                    unionTypes: pattern.unionTypes,
                    description: pattern.description
                },
                isEmbedded: true
            };
        }
        
        return null;
    }

    private extractSemanticTypeFromPattern(pattern: ProblematicOneOfPattern): string | null {
        for (const unionType of pattern.unionTypes) {
            if (!unionType.includes('Advanced') && !unionType.includes('Filter')) {
                return unionType;
            }
        }
        return null;
    }

    private extractSemanticTypeFromPropertyName(propertyName: string): string | null {
        // Convert camelCase property names to PascalCase semantic types
        // e.g., processDefinitionKey -> ProcessDefinitionKey
        //       processInstanceKey -> ProcessInstanceKey
        //       elementInstanceKey -> ElementInstanceKey
        //       variableKey -> VariableKey
        //       scopeKey -> ScopeKey
        //       jobKey -> JobKey
        
        const mapping: { [key: string]: string } = {
            'processDefinitionKey': 'ProcessDefinitionKey',
            'processInstanceKey': 'ProcessInstanceKey',
            'parentProcessInstanceKey': 'ProcessInstanceKey',
            'parentElementInstanceKey': 'ElementInstanceKey',
            'elementInstanceKey': 'ElementInstanceKey',
            'ancestorElementInstanceKey': 'ElementInstanceKey',
            'variableKey': 'VariableKey',
            'scopeKey': 'ScopeKey',
            'jobKey': 'JobKey'
        };
        
        return mapping[propertyName] || null;
    }

    private extractSemanticTypeFromFileName(fileName: string): string | null {
        const baseName = fileName.replace(/\.ts$/, '');
        const match = baseName.match(/^advanced(.+)Filter$/);
        if (!match) return null;
        
        const typePart = match[1];
        const semanticTypeName = typePart.charAt(0).toUpperCase() + typePart.slice(1);
        
        if (this.isSemanticType(semanticTypeName)) {
            return semanticTypeName;
        }
        
        return null;
    }

    private isSemanticType(typeName: string): boolean {
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
        return typeName.startsWith('Advanced') && typeName.endsWith('Filter');
    }

    private toPascalCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private camelCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    private camelCaseToKebab(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    private resolveRef(ref: string): any {
        if (!ref.startsWith('#/components/schemas/')) return null;
        const schemaName = ref.split('/').pop();
        if (!schemaName || !this.spec.components?.schemas) return null;
        return this.spec.components.schemas[schemaName];
    }

    protected getStartMessage(): string {
        return '🔧 Starting AST-based TypeScript OneOf union type fixes...';
    }

    protected getCompletionMessage(): string {
        return '✅ AST-based TypeScript OneOf union type fixes completed';
    }
}

// Reuse existing interfaces
interface ProblematicOneOfPattern {
    parentSchemaName: string;
    propertyName: string;
    unionTypes: string[];
    description: string;
}

interface OneOfProperty {
    propertyName: string;
    unionTypes: string[];
    description: string;
}

interface PredictedGeneratedClass {
    predictedClassName: string;
    originalPattern: ProblematicOneOfPattern;
}

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
    isEmbedded?: boolean;
}
