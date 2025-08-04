#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions } from '../sdks';
import { SdkEnhancementStrategy } from './SdkEnhancementOrchestrator';
import { TypeScriptEventualEnhancer } from './typescript/TypeScriptEventualEnhancer';

export class EventuallyConsistentEnhancer extends SdkEnhancementStrategy {
  name = 'enhance-eventually-consistent';
    sdkEnhancementStrategies = {
    typescript: this.enhanceTypeScript,
    csharp: this.enhanceCSharp,
    go: this.enhanceGo,
    python: this.enhancePython,
    php: this.enhancePHP,
  }
  spec: OpenAPIV3.Document;
  eventuallyConsistentOperations: Map<string, {
    operationId: string;
    path: string;
    method: string;
    summary: string;
    description: string;
  }>;
  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks); // Call parent constructor
    this.spec = spec
    this.eventuallyConsistentOperations = this.extractEventuallyConsistentOperations();
    console.log(`Found ${this.eventuallyConsistentOperations.size} eventually consistent operations:`, Array.from(this.eventuallyConsistentOperations.keys()));
  }

  // Configuration - single place to update the comment
  static EVENTUALLY_CONSISTENT_COMMENT = 'This endpoint is eventually consistent with the system state.';

  extractEventuallyConsistentOperations() {
    const operations = new Map<string, {
      operationId: string;
      path: string;
      method: string;
      summary: string;
      description: string;
    }>();
    
    if (!this.spec.paths) return operations;
    
    for (const [pathKey, pathItem] of Object.entries(this.spec.paths)) {
      if (!pathItem) continue;
      
      // Check if the path itself is marked as eventually consistent
      const extendedPathItem = pathItem as OpenAPIV3.PathItemObject & { 'x-eventually-consistent'?: boolean };
      const pathIsEventuallyConsistent = extendedPathItem['x-eventually-consistent'];
      
      // Check each HTTP method directly
      const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'] as const;
      
      for (const method of httpMethods) {
        const operation = pathItem[method];
        
        if (operation && typeof operation === 'object' && 'operationId' in operation) {
          // Type assertion for the custom extension
          const extendedOperation = operation as OpenAPIV3.OperationObject & { 'x-eventually-consistent'?: boolean };
          
          // Check if operation is eventually consistent (either at path level or operation level)
          const isEventuallyConsistent = pathIsEventuallyConsistent || extendedOperation['x-eventually-consistent'];
          
          if (isEventuallyConsistent) {
            const operationId = extendedOperation.operationId;
            if (operationId) {
              operations.set(operationId, {
                operationId,
                path: pathKey,
                method: method.toUpperCase(),
                summary: extendedOperation.summary || '',
                description: extendedOperation.description || ''
              });
            }
          }
        }
      }
    }
    
    return operations;
  }

  // Template method hooks
  protected shouldProceed(): boolean {
    return this.eventuallyConsistentOperations.size > 0;
  }

  protected getSkipMessage(): string {
    return '⏭️  No eventually consistent operations found. Skipping...';
  }

  protected getStartMessage(): string {
    return '📝 Adding eventually consistent documentation...';
  }

  protected getCompletionMessage(): string {
    return '✅ All SDKs enhanced with eventually consistent documentation!';
  }

  // ===== TYPESCRIPT =====
  enhanceTypeScript(sdkPath: string) {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! TypeScript SDK not found: ${sdkPath}`);
      return;
    }
    
    console.log('📝 Enhancing TypeScript SDK...');
    
    // Use AST-based enhancer for TypeScript
    const tsEnhancer = new TypeScriptEventualEnhancer(EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT);
    
    try {
      const updatedFiles = tsEnhancer.enhanceTypeScriptFiles(sdkPath, this.eventuallyConsistentOperations);
      
      if (updatedFiles > 0) {
        console.log(`  ✓ Updated ${updatedFiles} TypeScript API files`);
      }
    } finally {
      // Clean up resources
      tsEnhancer.dispose();
    }
  }

  // ===== C# =====
  enhanceCSharp(sdkPath: string) {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! C# SDK not found: ${sdkPath}`);
      return;
    }
    
    console.log('📝 Enhancing C# SDK...');
    
    const possibleApiDirs = [
      path.join(sdkPath, 'src/main/CSharp/YourCompany.ProcessApi/Api'),
      path.join(sdkPath, 'src/Api'),
      path.join(sdkPath, 'Api')
    ];
    
    let foundApiDir = false;
    for (const apiDir of possibleApiDirs) {
      if (fs.existsSync(apiDir)) {
        this.updateCSharpApiFiles(apiDir);
        foundApiDir = true;
        break;
      }
    }
    
    if (!foundApiDir) {
      console.log(`  ! No C# API directory found`);
    }
  }

  updateCSharpApiFiles(apiDir: string) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.cs'));
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of Array.from(this.eventuallyConsistentOperations.values())) {
        // Multiple patterns for C# method declarations
        const patterns = [
          // Async methods with Task return type
          new RegExp(`(\\s*)(public\\s+async\\s+Task<[^>]+>\\s+${operation.operationId}[^{]*{)`, 'g'),
          // Async methods with Task return type (no generic)
          new RegExp(`(\\s*)(public\\s+async\\s+Task\\s+${operation.operationId}[^{]*{)`, 'g'),
          // Non-async methods
          new RegExp(`(\\s*)(public\\s+[^\\s]+\\s+${operation.operationId}[^{]*{)`, 'g')
        ];

        for (const methodPattern of patterns) {
          content = content.replace(methodPattern, (match, indent, methodDecl) => {
            if (match.includes(EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT)) {
              return match;
            }
            
            const comment = `${indent}/// <summary>\n${indent}/// ${EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT}\n${indent}/// </summary>\n`;
            return `${comment}${indent}${methodDecl}`;
          });
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
      }
    }
    
    if (updatedFiles > 0) {
      console.log(`  ✓ Updated ${updatedFiles} C# API files`);
    }
  }

  // ===== GO =====
  enhanceGo(sdkPath: string) {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! Go SDK not found: ${sdkPath}`);
      return;
    }
    
    console.log('📝 Enhancing Go SDK...');
    
    const files = fs.readdirSync(sdkPath).filter(f => f.endsWith('.go') && !f.includes('_test'));
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(sdkPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of Array.from(this.eventuallyConsistentOperations.values())) {
        // Go function patterns
        const patterns = [
          // Method with receiver
          new RegExp(`(\\s*)(func\\s+\\([^)]+\\)\\s+${operation.operationId}\\s*\\([^{]*{)`, 'g'),
          // Regular function
          new RegExp(`(\\s*)(func\\s+${operation.operationId}\\s*\\([^{]*{)`, 'g')
        ];

        for (const funcPattern of patterns) {
          content = content.replace(funcPattern, (match, indent, funcDecl) => {
            if (match.includes(EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT)) {
              return match;
            }
            
            const comment = `${indent}// ${EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT}\n`;
            return `${comment}${indent}${funcDecl}`;
          });
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
      }
    }
    
    if (updatedFiles > 0) {
      console.log(`  ✓ Updated ${updatedFiles} Go API files`);
    }
  }

  // ===== PYTHON =====
  enhancePython(sdkPath: string) {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! Python SDK not found: ${sdkPath}`);
      return;
    }
    
    console.log('📝 Enhancing Python SDK...');
    
    const possibleApiDirs = [
      path.join(sdkPath, 'openapi_client/api'),
      path.join(sdkPath, 'api'),
      path.join(sdkPath, 'src/api')
    ];
    
    let foundApiDir = false;
    for (const apiDir of possibleApiDirs) {
      if (fs.existsSync(apiDir)) {
        this.updatePythonApiFiles(apiDir);
        foundApiDir = true;
        break;
      }
    }
    
    if (!foundApiDir) {
      console.log(`  ! No Python API directory found`);
    }
  }

  updatePythonApiFiles(apiDir: string) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.py') && f !== '__init__.py');
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of Array.from(this.eventuallyConsistentOperations.values())) {
        // Python method patterns
        const patterns = [
          // Regular method definition
          new RegExp(`(\\s*)(def\\s+${operation.operationId}\\s*\\([^:]*\\):)`, 'g'),
          // Async method definition
          new RegExp(`(\\s*)(async\\s+def\\s+${operation.operationId}\\s*\\([^:]*\\):)`, 'g')
        ];

        for (const methodPattern of patterns) {
          content = content.replace(methodPattern, (match, indent, methodDef) => {
            // Check if method already has our docstring by looking at the next few lines
            const lines = content.split('\n');
            const methodLineIndex = lines.findIndex(line => line.includes(methodDef.trim()));
            
            if (methodLineIndex >= 0) {
              // Look at the next few lines for existing docstring
              for (let i = 1; i <= 3; i++) {
                if (methodLineIndex + i < lines.length) {
                  const nextLine = lines[methodLineIndex + i];
                  if (nextLine.includes(EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT)) {
                    return match; // Already has our comment
                  }
                }
              }
            }
            
            const docstring = `${indent}    """${EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT}"""\n`;
            return `${indent}${methodDef}\n${docstring}`;
          });
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
      }
    }
    
    if (updatedFiles > 0) {
      console.log(`  ✓ Updated ${updatedFiles} Python API files`);
    }
  }

  // ===== PHP =====
  enhancePHP(sdkPath: string) {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! PHP SDK not found: ${sdkPath}`);
      return;
    }
    
    console.log('📝 Enhancing PHP SDK...');
    
    const possibleApiDirs = [
      path.join(sdkPath, 'lib/Api'),
      path.join(sdkPath, 'Api'),
      path.join(sdkPath, 'src/Api')
    ];
    
    let foundApiDir = false;
    for (const apiDir of possibleApiDirs) {
      if (fs.existsSync(apiDir)) {
        this.updatePHPApiFiles(apiDir);
        foundApiDir = true;
        break;
      }
    }
    
    if (!foundApiDir) {
      console.log(`  ! No PHP API directory found`);
    }
  }

  updatePHPApiFiles(apiDir: string) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.php'));
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of Array.from(this.eventuallyConsistentOperations.values())) {
        // PHP method patterns
        const patterns = [
          // Public method
          new RegExp(`(\\s*)(public\\s+function\\s+${operation.operationId}\\s*\\([^{]*{)`, 'g'),
          // Protected method
          new RegExp(`(\\s*)(protected\\s+function\\s+${operation.operationId}\\s*\\([^{]*{)`, 'g'),
          // Private method
          new RegExp(`(\\s*)(private\\s+function\\s+${operation.operationId}\\s*\\([^{]*{)`, 'g')
        ];

        for (const methodPattern of patterns) {
          content = content.replace(methodPattern, (match, indent, methodDecl) => {
            if (match.includes(EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT)) {
              return match;
            }
            
            const comment = `${indent}/**\n${indent} * ${EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT}\n${indent} */\n`;
            return `${comment}${indent}${methodDecl}`;
          });
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
      }
    }
    
    if (updatedFiles > 0) {
      console.log(`  ✓ Updated ${updatedFiles} PHP API files`);
    }
  }
}

