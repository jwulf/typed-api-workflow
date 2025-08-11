import * as fs from 'fs';
import * as path from 'path';
import { Project, SyntaxKind, MethodDeclaration, Node, ClassDeclaration } from 'ts-morph';

export interface EventuallyConsistentOperation {
  operationId: string;
  path: string;
  method: string;
  summary: string;
  description: string;
}

/**
 * This adds a JSDoc comment and a decorator to all eventually consistent methods.
 */

export class TypeScriptEventualEnhancer {
  name = 'TypeScriptEventualEnhancer'
  private project: Project;
  private eventuallyConsistentComment: string;
  private addEventuallyProperty: boolean;

  constructor(eventuallyConsistentComment: string, addEventuallyProperty: boolean = true) {
    this.eventuallyConsistentComment = eventuallyConsistentComment;
    this.addEventuallyProperty = addEventuallyProperty;
    this.project = new Project({
      compilerOptions: {
        target: 99, // Latest
        module: 99, // Latest
      },
      useInMemoryFileSystem: false,
    });
  }

  /**
   * Clean up resources (for compatibility with original interface)
   */
  dispose(): void {
    // ts-morph project cleanup is automatic, but we can be explicit
    if (this.project) {
      // The project will be garbage collected
    }
  }

  /**
   * Enhance TypeScript API files with eventually consistent decorators
   */
  enhanceTypeScriptFiles(
    sdkPath: string, 
    operations: Map<string, EventuallyConsistentOperation>
  ): number {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! TypeScript SDK not found: ${sdkPath}`);
      return 0;
    }

    // Note: tsconfig.json updates are now handled by TypeScriptTsConfigEnhancer
    // Copy the EventuallyConsistentDecorator to ergonomics directory
    this.copyEventuallyConsistentDecorator(sdkPath);

    // Try multiple possible API directory structures
    const possibleApiDirs = [
      path.join(sdkPath, 'apis'),
      path.join(sdkPath, 'api'),
      path.join(sdkPath, 'src/apis'),
      path.join(sdkPath, 'src/api')
    ];

    let foundApiDir: string | null = null;
    for (const apiDir of possibleApiDirs) {
      if (fs.existsSync(apiDir)) {
        foundApiDir = apiDir;
        break;
      }
    }

    if (!foundApiDir) {
      console.log(`  ! No TypeScript API directory found`);
      return 0;
    }

    const updatedFiles = this.updateTypeScriptApiFiles(foundApiDir, operations);

    // Generate eventuality types and factory function
    this.generateEventualityTypes(sdkPath, operations);
    this.copyWithEventualityFactory(sdkPath);
    this.updateMainIndex(sdkPath);

    return updatedFiles;
  }

  /**
   * Generate EventualityTypes.ts with enhanced type definitions
   */
  private generateEventualityTypes(sdkPath: string, operations: Map<string, EventuallyConsistentOperation>): void {
    const eventualityTypesPath = path.join(sdkPath, 'EventualityTypes.ts');
    
    // Group operations by API class
    const apiClasses = new Map<string, string[]>();
    
    for (const [operationId, operation] of operations) {
      // Extract API class name from operation path or use heuristics
      const apiClassName = this.getApiClassNameFromOperation(operation);
      if (!apiClasses.has(apiClassName)) {
        apiClasses.set(apiClassName, []);
      }
      apiClasses.get(apiClassName)!.push(operationId);
    }

    let content = `/**
 * Enhanced type definitions for eventually consistent API methods
 * Auto-generated - do not edit manually
 */

import type { EventuallyConsistentMethod } from './ergonomics/EventuallyConsistentDecorator';
`;

    // Add imports for each API class
    for (const apiClassName of apiClasses.keys()) {
      const fileName = this.getApiFileName(apiClassName);
      content += `import type { ${apiClassName} } from './api/${fileName}';\n`;
    }

    content += '\n';

    // Generate enhanced type for each API class
    for (const [apiClassName, methodNames] of apiClasses) {
      content += `export type ${apiClassName}WithEventuality = ${apiClassName} & {\n`;
      
      for (const methodName of methodNames) {
        content += `  ${methodName}: ${apiClassName}['${methodName}'] & EventuallyConsistentMethod<${apiClassName}['${methodName}']>;\n`;
      }
      
      content += '};\n\n';
    }

    fs.writeFileSync(eventualityTypesPath, content, 'utf8');
    console.log(`  ✓ Generated EventualityTypes.ts with ${apiClasses.size} enhanced API classes`);
  }

  /**
   * Copy WithEventuality factory function from source
   */
  private copyWithEventualityFactory(sdkPath: string): void {
    const sourceFactoryPath = path.join(__dirname, '..', '..', '..', 'ergonomics', 'typescript', 'WithEventuality.ts');
    const targetFactoryPath = path.join(sdkPath, 'ergonomics', 'WithEventuality.ts');
    
    if (fs.existsSync(sourceFactoryPath)) {
      // Read the source file
      let content = fs.readFileSync(sourceFactoryPath, 'utf8');
      
      // Add warning header
      const warningHeader = `// GENERATED FILE - DO NOT EDIT
// This file is auto-generated from the source template.
// Manual changes will be overwritten during the next SDK generation.

`;
      
      // Prepend warning to content
      content = warningHeader + content;
      
      // Write to target with warning
      fs.writeFileSync(targetFactoryPath, content, 'utf8');
      console.log(`  ✓ Copied WithEventuality.ts to ${path.relative(sdkPath, targetFactoryPath)}`);
    } else {
      throw new Error(`WithEventuality.ts not found at ${sourceFactoryPath}`);
    }
  }

  /**
   * Update main api.ts to export eventuality utilities
   */
  private updateMainIndex(sdkPath: string): void {
    const indexPath = path.join(sdkPath, 'api.ts');
    
    if (!fs.existsSync(indexPath)) {
      console.log(`  ! api.ts not found at ${indexPath}`);
      return;
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Check if exports already exist
    if (content.includes('WithEventuality') || content.includes('EventualityTypes')) {
      console.log(`  → Eventuality exports already present in api.ts`);
      return;
    }

    // Add exports at the end
    content += `
// Eventuality enhancements
export { WithEventuality } from './ergonomics/WithEventuality';
export type * from './EventualityTypes';
`;

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`  ✓ Updated api.ts with eventuality exports`);
  }

  /**
   * Extract API class name from operation metadata
   */
  private getApiClassNameFromOperation(operation: EventuallyConsistentOperation): string {
    // Use the path to determine the API class
    // Map from path segments to actual API class names (singular)
    const pathParts = operation.path.split('/').filter(part => part.length > 0);
    
    if (pathParts.length === 0) return 'DefaultApi';
    
    const resourceName = pathParts[0];
    
    // Mapping from plural path segments to singular API class names
    const pathToClassMapping: Record<string, string> = {
      'jobs': 'JobApi',
      'tenants': 'TenantApi',
      'user-tasks': 'UserTaskApi',
      'variables': 'VariableApi',
      'process-definitions': 'ProcessDefinitionApi',
      'process-instances': 'ProcessInstanceApi',
      'element-instances': 'ElementInstanceApi',
      'decision-definitions': 'DecisionDefinitionApi',
      'decision-requirements': 'DecisionRequirementsApi',
      'decision-instances': 'DecisionInstanceApi',
      'authorizations': 'AuthorizationApi',
      'roles': 'RoleApi',
      'groups': 'GroupApi',
      'mapping-rules': 'MappingRuleApi',
      'message-subscriptions': 'MessageSubscriptionApi',
      'users': 'UserApi',
      'setup': 'SetupApi',
      'incidents': 'IncidentApi',
      'metrics': 'SystemApi',
      'batch-operations': 'BatchOperationApi',
      'batch-operation-items': 'BatchOperationApi',  // batch operation items are part of BatchOperationApi
      'messages': 'MessageApi'
    };
    
    // Use mapping if available, otherwise generate from resource name
    if (pathToClassMapping[resourceName]) {
      return pathToClassMapping[resourceName];
    }
    
    // Convert kebab-case to PascalCase and add Api suffix (fallback)
    const className = resourceName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Api';
    
    return className;
  }

  /**
   * Convert API class name to file name
   */
  private getApiFileName(apiClassName: string): string {
    // Convert PascalCase to camelCase
    // ProcessInstanceApi -> processInstanceApi
    return apiClassName.charAt(0).toLowerCase() + apiClassName.slice(1);
  }

  /**
   * Update TypeScript API files with eventually consistent decorators
   */
  private updateTypeScriptApiFiles(apiDir: string, operations: Map<string, EventuallyConsistentOperation>): number {
    let updatedFiles = 0;
    const files = fs.readdirSync(apiDir).filter(file => file.endsWith('.ts'));
    
    console.log(`    → Found ${files.length} TypeScript API files`);
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      if (this.updateApiFile(filePath, operations)) {
        updatedFiles++;
      }
    }
    
    return updatedFiles;
  }

  /**
   * Copy EventuallyConsistentDecorator.ts to ergonomics directory
   */
  private copyEventuallyConsistentDecorator(sdkPath: string): void {
    const ergonomicsDir = path.join(sdkPath, 'ergonomics');
    
    // Create ergonomics directory if it doesn't exist
    if (!fs.existsSync(ergonomicsDir)) {
      fs.mkdirSync(ergonomicsDir, { recursive: true });
    }
    
    // Copy the decorator file from the tools directory
    const sourceDecoratorPath = path.join(__dirname, '..', '..', '..', 'ergonomics', 'typescript', 'EventuallyConsistentDecorator.ts');
    const targetDecoratorPath = path.join(ergonomicsDir, 'EventuallyConsistentDecorator.ts');
    
    if (fs.existsSync(sourceDecoratorPath)) {
      fs.copyFileSync(sourceDecoratorPath, targetDecoratorPath);
      console.log(`  ✓ Copied EventuallyConsistentDecorator.ts to ${ergonomicsDir}`);
    } else {
      throw new Error(`EventuallyConsistentDecorator.ts not found at ${sourceDecoratorPath}`);
    }
  }

  /**
   * Update sdk tsconfig.json to enable experimental decorators
   */
  // Note: updateTsConfig method removed - now handled by TypeScriptTsConfigEnhancer

  private updateApiFile(filePath: string, operations: Map<string, EventuallyConsistentOperation>): boolean {
    try {
      console.log(`      → Processing ${path.basename(filePath)}`);
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      let fileModified = false;

      try {
        // Find all method declarations
        const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);
        const eventuallyConsistentMethods: MethodDeclaration[] = [];
        
        console.log(`        → Found ${methods.length} methods in ${path.basename(filePath)}`);

        for (const method of methods) {
          const methodName = method.getName();
          
          // Check if this method corresponds to an eventually consistent operation
          const operation = operations.get(methodName);
          if (!operation) continue;

          console.log(`        → Found eventually consistent method: ${methodName}`);

          // Check if method already has our decorator
          if (this.hasEventuallyConsistentDecorator(method)) {
            console.log(`        → Method ${methodName} already has decorator, skipping`);
            continue;
          }

          // Add JSDoc comment (keep for documentation)
          this.addJSDocComment(method);
          
          // Add decorator if requested
          if (this.addEventuallyProperty) {
            console.log(`        → Adding decorator to ${methodName}`);
            this.addEventuallyConsistentDecorator(method);
            eventuallyConsistentMethods.push(method);
          }
          
          fileModified = true;
        }

        if (fileModified && this.addEventuallyProperty && eventuallyConsistentMethods.length > 0) {
          // Add import for the decorator
          this.addDecoratorImport(sourceFile);
          
          // Save the file
          console.log(`        → Saving ${path.basename(filePath)} with ${eventuallyConsistentMethods.length} enhanced methods`);
          sourceFile.saveSync();
          return true;
        } else if (fileModified) {
          // Save the file even if just JSDoc was added
          sourceFile.saveSync();
          return true;
        }

      } catch (error) {
        console.warn(`  ! Error processing ${path.basename(filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        // Remove from project to avoid memory leaks
        sourceFile.forget();
      }
    } catch (error) {
      console.warn(`  ! Error loading ${path.basename(filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return false;
  }

  /**
   * Check if a method already has the @eventuallyconsistent decorator
   */
  private hasEventuallyConsistentDecorator(method: MethodDeclaration): boolean {
    const decorators = method.getDecorators();
    return decorators.some(decorator => decorator.getName() === 'eventuallyconsistent');
  }

  /**
   * Add @eventuallyconsistent decorator to a method
   */
  private addEventuallyConsistentDecorator(method: MethodDeclaration): void {
    method.addDecorator({
      name: 'eventuallyconsistent'
    });
  }

  /**
   * Add import for the decorator from ergonomics directory
   */
  private addDecoratorImport(sourceFile: any): void {
    const imports = sourceFile.getImportDeclarations();
    const hasDecoratorImport = imports.some((imp: any) => 
      imp.getModuleSpecifierValue().includes('EventuallyConsistentDecorator')
    );
    
    if (!hasDecoratorImport) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '../ergonomics/EventuallyConsistentDecorator',
        namedImports: ['eventuallyconsistent']
      });
    }
  }

  /**
   * Check if a method already has the eventually consistent comment
   */
  private hasEventuallyConsistentComment(method: MethodDeclaration): boolean {
    const jsDocs = method.getJsDocs();
    
    for (const jsDoc of jsDocs) {
      const fullText = jsDoc.getFullText();
      if (fullText.includes(this.eventuallyConsistentComment)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Add JSDoc comment to a method
   */
  private addJSDocComment(method: MethodDeclaration): void {
    const existingJsDocs = method.getJsDocs();
    
    if (existingJsDocs.length > 0) {
      // Update existing JSDoc
      const lastJsDoc = existingJsDocs[existingJsDocs.length - 1];
      this.updateExistingJSDoc(lastJsDoc, method);
    } else {
      // Create new JSDoc
      this.createNewJSDoc(method);
    }
  }

  /**
   * Update existing JSDoc by adding our comment
   */
  private updateExistingJSDoc(jsDoc: Node, method: MethodDeclaration): void {
    const jsdocText = jsDoc.getFullText();
    
    // Find the first JSDoc tag (like @summary, @param, etc.) or the closing */
    const tagMatch = jsdocText.match(/(\s*\*\s*@\w+)/);
    const closingIndex = jsdocText.lastIndexOf('*/');
    
    if (closingIndex === -1) return;
    
    // Determine indentation by looking at existing comment lines
    const lines = jsdocText.split('\n');
    let indent = '     '; // Default indentation
    
    for (const line of lines) {
      const match = line.match(/^(\s*)\*/);
      if (match && match[1]) {
        indent = match[1];
        break;
      }
    }
    
    let updatedText: string;
    
    if (tagMatch) {
      // Insert before the first JSDoc tag
      const insertPoint = tagMatch.index!;
      const beforeTag = jsdocText.substring(0, insertPoint);
      const afterTag = jsdocText.substring(insertPoint);
      
      // Clean up the beforeTag text - remove any trailing stars or extra content, but preserve description
      const cleanedBeforeTag = this.cleanJSDocText(beforeTag);
      
      updatedText = cleanedBeforeTag + 
        `${indent}*\n${indent}* ${this.eventuallyConsistentComment}\n${indent}*\n${indent}` +
        afterTag;
    } else {
      // Insert before the closing */
      const beforeClosing = jsdocText.substring(0, closingIndex);
      const afterClosing = jsdocText.substring(closingIndex);
      
      // Clean up the beforeClosing text
      const cleanedBeforeClosing = this.cleanJSDocText(beforeClosing);
      
      updatedText = cleanedBeforeClosing + 
        `${indent}*\n${indent}* ${this.eventuallyConsistentComment}\n${indent}*\n${indent}` +
        afterClosing;
    }
    
    jsDoc.replaceWithText(updatedText);
  }

  /**
   * Clean JSDoc text by removing trailing content after the main description
   */
  private cleanJSDocText(text: string): string {
    // Remove any trailing whitespace, asterisks, or newlines at the end
    let cleaned = text.replace(/(\s*\*\s*)*\s*$/, '');
    
    // Ensure it ends with proper formatting
    if (!cleaned.endsWith('*')) {
      cleaned += '*';
    }
    
    return cleaned;
  }

  /**
   * Create new JSDoc comment
   */
  private createNewJSDoc(method: MethodDeclaration): void {
    const jsDocText = `/**
     * ${this.eventuallyConsistentComment}
     */`;
    
    method.insertText(0, jsDocText + '\n    ');
  }
}
