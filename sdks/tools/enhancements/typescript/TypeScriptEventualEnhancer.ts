import * as fs from 'fs';
import * as path from 'path';
import { Project, SyntaxKind, MethodDeclaration, Node } from 'ts-morph';

export interface EventuallyConsistentOperation {
  operationId: string;
  path: string;
  method: string;
  summary: string;
  description: string;
}

export class TypeScriptEventualEnhancer {
  private project: Project;
  private eventuallyConsistentComment: string;

  constructor(eventuallyConsistentComment: string) {
    this.eventuallyConsistentComment = eventuallyConsistentComment;
    this.project = new Project({
      // Don't emit files, we'll handle that manually
      compilerOptions: {
        target: 99, // Latest
        module: 99, // Latest
      },
      useInMemoryFileSystem: false, // Work with real files
    });
  }

  /**
   * Enhance TypeScript API files with eventually consistent documentation
   */
  enhanceTypeScriptFiles(
    sdkPath: string, 
    operations: Map<string, EventuallyConsistentOperation>
  ): number {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! TypeScript SDK not found: ${sdkPath}`);
      return 0;
    }

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

        for (const method of methods) {
          const methodName = method.getName();
          
          // Check if this method corresponds to an eventually consistent operation
          const operation = operations.get(methodName);
          if (!operation) continue;

          // Check if method already has our comment
          if (this.hasEventuallyConsistentComment(method)) {
            continue;
          }

          // Add JSDoc comment
          this.addJSDocComment(method);
          fileModified = true;
        }

        if (fileModified) {
          // Save the file
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
      const beforeTagLines = beforeTag.split('\n');
      for (let i = 0; i < beforeTagLines.length; i++) {
        const line = beforeTagLines[i];
        // If this line has content after the * and /, clean only trailing stars
        if (line.includes('*') && !line.trim().endsWith('/**') && !line.trim().endsWith('*/')) {
          // Remove trailing stars but preserve actual content
          beforeTagLines[i] = line.replace(/\s*\*+\s*$/, '');
        }
      }
      
      const cleanedBeforeTag = beforeTagLines.join('\n');
      
      // Add our comment with proper spacing - add blank line before our comment
      updatedText = cleanedBeforeTag + `\n${indent}*\n${indent}* ${this.eventuallyConsistentComment}\n${indent}*\n` + afterTag;
    } else {
      // No tags found, insert before closing */
      const beforeClosing = jsdocText.substring(0, closingIndex);
      const afterClosing = jsdocText.substring(closingIndex);
      
      updatedText = beforeClosing + `\n${indent}* ${this.eventuallyConsistentComment}\n${indent}` + afterClosing;
    }
    
    // Replace the JSDoc
    jsDoc.replaceWithText(updatedText);
  }

  /**
   * Create new JSDoc comment for a method
   */
  private createNewJSDoc(method: MethodDeclaration): void {
    // Get the indentation by looking at the method's leading trivia
    const methodText = method.getFullText();
    const methodStart = method.getStart();
    const beforeMethodText = method.getSourceFile().getFullText().substring(0, methodStart);
    
    // Find the last newline before the method to determine indentation
    const lines = beforeMethodText.split('\n');
    const lastLine = lines[lines.length - 1];
    
    // Extract indentation from the last line
    const indentMatch = lastLine.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '';
    
    // Create JSDoc comment
    const jsDocComment = `${indent}/**\n${indent} * ${this.eventuallyConsistentComment}\n${indent} */\n`;
    
    // Insert before the method
    method.insertText(0, jsDocComment);
  }

  /**
   * Clean up the project
   */
  dispose(): void {
    // Remove all source files to free memory
    this.project.getSourceFiles().forEach((sf) => sf.forget());
  }
}
