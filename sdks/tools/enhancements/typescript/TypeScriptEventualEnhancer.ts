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

    // Update tsconfig.json to enable decorators
    this.updateTsConfig(sdkPath);

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

    return this.updateTypeScriptApiFiles(foundApiDir, operations);
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
    const sourceDecoratorPath = path.join(__dirname, 'ergonomics', 'EventuallyConsistentDecorator.ts');
    const targetDecoratorPath = path.join(ergonomicsDir, 'EventuallyConsistentDecorator.ts');
    
    if (fs.existsSync(sourceDecoratorPath)) {
      fs.copyFileSync(sourceDecoratorPath, targetDecoratorPath);
    } else {
      console.warn(`  ! EventuallyConsistentDecorator.ts not found at ${sourceDecoratorPath}`);
    }
  }

  /**
   * Update sdk tsconfig.json to enable experimental decorators
   */
  private updateTsConfig(sdkPath: string): void {
    const tsconfigPath = path.join(sdkPath, 'tsconfig.json');
    
    if (!fs.existsSync(tsconfigPath)) {
      console.log(`  ! TypeScript config not found: ${tsconfigPath}`);
      return;
    }

    try {
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(tsconfigContent);

      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
      }

      // Add decorator support
      tsconfig.compilerOptions.experimentalDecorators = true;
      tsconfig.compilerOptions.emitDecoratorMetadata = true;

      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4), 'utf8');
      console.log(`  ✓ Updated tsconfig.json to enable decorators`);
    } catch (error) {
      console.warn(`  ! Error updating tsconfig.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private updateTypeScriptApiFiles(
    apiDir: string, 
    operations: Map<string, EventuallyConsistentOperation>
  ): number {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.ts'));
    let updatedFiles = 0;

    for (const file of files) {
      const filePath = path.join(apiDir, file);
      
      // Add the file to the project
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      let fileModified = false;

      try {
        // Find all method declarations
        const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);
        const eventuallyConsistentMethods: MethodDeclaration[] = [];

        for (const method of methods) {
          const methodName = method.getName();
          
          // Check if this method corresponds to an eventually consistent operation
          const operation = operations.get(methodName);
          if (!operation) continue;

          // Check if method already has our decorator
          if (this.hasEventuallyConsistentDecorator(method)) {
            continue;
          }

          // Add JSDoc comment (keep for documentation)
          this.addJSDocComment(method);
          
          // Add decorator if requested
          if (this.addEventuallyProperty) {
            this.addEventuallyConsistentDecorator(method);
            eventuallyConsistentMethods.push(method);
          }
          
          fileModified = true;
        }

        if (fileModified && this.addEventuallyProperty && eventuallyConsistentMethods.length > 0) {
          // Add import for the decorator
          this.addDecoratorImport(sourceFile);
          
          // Save the file
          sourceFile.saveSync();
          updatedFiles++;
        } else if (fileModified) {
          // Save the file even if just JSDoc was added
          sourceFile.saveSync();
          updatedFiles++;
        }

      } catch (error) {
        console.warn(`  ! Error processing ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        // Remove from project to avoid memory leaks
        sourceFile.forget();
      }
    }

    return updatedFiles;
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
