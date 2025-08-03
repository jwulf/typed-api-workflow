#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class EventuallyConsistentEnhancer {
  constructor(specPath) {
    this.spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
    this.eventuallyConsistentOperations = this.extractEventuallyConsistentOperations();
    console.log(`Found ${this.eventuallyConsistentOperations.size} eventually consistent operations:`, Array.from(this.eventuallyConsistentOperations.keys()));
  }

  // Configuration - single place to update the comment
  static EVENTUALLY_CONSISTENT_COMMENT = 'This endpoint is eventually consistent with the system state.';

  extractEventuallyConsistentOperations() {
    const operations = new Map();
    
    for (const [pathKey, pathValue] of Object.entries(this.spec.paths || {})) {
      for (const [method, operation] of Object.entries(pathValue)) {
        if (operation && typeof operation === 'object' && operation['x-eventually-consistent']) {
          const operationId = operation.operationId;
          if (operationId) {
            operations.set(operationId, {
              operationId,
              path: pathKey,
              method: method.toUpperCase(),
              summary: operation.summary || '',
              description: operation.description || ''
            });
          }
        }
      }
    }
    
    return operations;
  }

  enhanceAllSDKs(baseDir) {
    if (this.eventuallyConsistentOperations.size === 0) {
      console.log('⏭️  No eventually consistent operations found. Skipping...');
      return;
    }

    console.log('📝 Adding eventually consistent documentation...');
    
    this.enhanceTypeScript(path.join(baseDir, 'typescript'));
    this.enhanceCSharp(path.join(baseDir, 'csharp'));
    this.enhanceGo(path.join(baseDir, 'go'));
    this.enhancePython(path.join(baseDir, 'python'));
    this.enhancePHP(path.join(baseDir, 'php'));
    
    console.log('✅ All SDKs enhanced with eventually consistent documentation!');
  }

  // ===== TYPESCRIPT =====
  enhanceTypeScript(sdkPath) {
    if (!fs.existsSync(sdkPath)) {
      console.log(`  ! TypeScript SDK not found: ${sdkPath}`);
      return;
    }
    
    console.log('📝 Enhancing TypeScript SDK...');
    
    // Try multiple possible API directory structures
    const possibleApiDirs = [
      path.join(sdkPath, 'apis'),
      path.join(sdkPath, 'api'),
      path.join(sdkPath, 'src/apis'),
      path.join(sdkPath, 'src/api')
    ];
    
    let foundApiDir = false;
    for (const apiDir of possibleApiDirs) {
      if (fs.existsSync(apiDir)) {
        this.updateTypeScriptApiFiles(apiDir);
        foundApiDir = true;
        break;
      }
    }
    
    if (!foundApiDir) {
      console.log(`  ! No TypeScript API directory found`);
    }
  }

  updateTypeScriptApiFiles(apiDir) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.ts'));
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      let changed = false;

      for (const operation of this.eventuallyConsistentOperations.values()) {
        // Multiple patterns to catch different method declaration styles
        const patterns = [
          // Standard async method
          new RegExp(`(\\s*)(public\\s+async\\s+\\w+\\s+${operation.operationId}\\s*\\([^)]*\\)[^{]*{)`, 'g'),
          // Method without async
          new RegExp(`(\\s*)(public\\s+\\w+\\s+${operation.operationId}\\s*\\([^)]*\\)[^{]*{)`, 'g'),
          // Arrow function style
          new RegExp(`(\\s*)(${operation.operationId}\\s*=\\s*async\\s*\\([^)]*\\)\\s*=>\\s*{)`, 'g'),
          // Function declaration
          new RegExp(`(\\s*)(function\\s+${operation.operationId}\\s*\\([^)]*\\)[^{]*{)`, 'g')
        ];

        for (const methodPattern of patterns) {
          content = content.replace(methodPattern, (match, indent, methodDecl) => {
            // Check if already has our comment
            if (match.includes(EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT)) {
              return match;
            }
            
            // Add JSDoc comment
            const comment = `${indent}/**\n${indent} * ${EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT}\n${indent} */\n`;
            return `${comment}${indent}${methodDecl}`;
          });
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
        changed = true;
      }
    }
    
    if (updatedFiles > 0) {
      console.log(`  ✓ Updated ${updatedFiles} TypeScript API files`);
    }
  }

  // ===== C# =====
  enhanceCSharp(sdkPath) {
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

  updateCSharpApiFiles(apiDir) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.cs'));
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of this.eventuallyConsistentOperations.values()) {
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
  enhanceGo(sdkPath) {
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

      for (const operation of this.eventuallyConsistentOperations.values()) {
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
  enhancePython(sdkPath) {
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

  updatePythonApiFiles(apiDir) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.py') && f !== '__init__.py');
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of this.eventuallyConsistentOperations.values()) {
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
  enhancePHP(sdkPath) {
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

  updatePHPApiFiles(apiDir) {
    const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.php'));
    let updatedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(apiDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      for (const operation of this.eventuallyConsistentOperations.values()) {
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

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node enhance-eventually-consistent.js <spec-file> <sdks-directory>');
    console.log('Example: node enhance-eventually-consistent.js rest-api.domain.yaml ./sdks');
    console.log('');
    console.log('This script adds documentation to methods for endpoints that have');
    console.log('the x-eventually-consistent: true vendor extension.');
    console.log('');
    console.log('The comment added is:');
    console.log(`"${EventuallyConsistentEnhancer.EVENTUALLY_CONSISTENT_COMMENT}"`);
    console.log('');
    console.log('To change this comment, edit the EVENTUALLY_CONSISTENT_COMMENT constant');
    console.log('in this file and regenerate all SDKs.');
    process.exit(1);
  }
  
  let [specFile, sdksDir] = args;
  
  if (!path.isAbsolute(specFile)) {
    specFile = path.resolve(process.cwd(), specFile);
  }
  if (!path.isAbsolute(sdksDir)) {
    sdksDir = path.resolve(process.cwd(), sdksDir);
  }
  
  if (!fs.existsSync(specFile)) {
    console.error(`Error: Spec file not found: ${specFile}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(sdksDir)) {
    console.error(`Error: SDKs directory not found: ${sdksDir}`);
    process.exit(1);
  }
  
  try {
    const enhancer = new EventuallyConsistentEnhancer(specFile);
    enhancer.enhanceAllSDKs(sdksDir);
  } catch (error) {
    console.error('Error enhancing SDKs:', error.message);
    process.exit(1);
  }
}

module.exports = { EventuallyConsistentEnhancer };