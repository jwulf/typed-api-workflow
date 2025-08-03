#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class SemanticTypeEnhancer {
  constructor(specPath) {
    this.spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
    this.semanticTypes = this.extractSemanticTypes();
    console.log(`Found ${this.semanticTypes.size} semantic types:`, Array.from(this.semanticTypes.keys()));
  }

  extractSemanticTypes() {
    const types = new Map();
    
    const processSchema = (name, schema, visited = new Set()) => {
      if (visited.has(name)) return; // Prevent circular references
      visited.add(name);
      
      if (schema['x-semantic-type']) {
        types.set(schema['x-semantic-type'], {
          name: schema['x-semantic-type'],
          description: schema.description || '',
          pattern: this.resolvePattern(schema, visited),
          minLength: this.resolveMinLength(schema, visited),
          maxLength: this.resolveMaxLength(schema, visited)
        });
      }
      
      // Handle allOf inheritance
      if (schema.allOf) {
        for (const subSchema of schema.allOf) {
          if (subSchema.$ref) {
            const refName = this.getRefName(subSchema.$ref);
            const refSchema = this.resolveRef(subSchema.$ref);
            processSchema(refName, refSchema, visited);
          } else {
            processSchema(name, { ...schema, ...subSchema }, visited);
          }
        }
      }
    };

    for (const [name, schema] of Object.entries(this.spec.components?.schemas || {})) {
      processSchema(name, schema);
    }
    
    return types;
  }

  getRefName(ref) {
    return ref.split('/').pop();
  }

  resolvePattern(schema, visited = new Set()) {
    if (schema.pattern) return schema.pattern;
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        if (subSchema.$ref) {
          const refName = this.getRefName(subSchema.$ref);
          if (!visited.has(refName)) {
            const resolved = this.resolveRef(subSchema.$ref);
            const pattern = this.resolvePattern(resolved, visited);
            if (pattern) return pattern;
          }
        } else if (subSchema.pattern) {
          return subSchema.pattern;
        }
      }
    }
    return null;
  }

  resolveMinLength(schema, visited = new Set()) {
    if (schema.minLength !== undefined) return schema.minLength;
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        if (subSchema.$ref) {
          const refName = this.getRefName(subSchema.$ref);
          if (!visited.has(refName)) {
            const resolved = this.resolveRef(subSchema.$ref);
            const minLength = this.resolveMinLength(resolved, visited);
            if (minLength !== undefined) return minLength;
          }
        } else if (subSchema.minLength !== undefined) {
          return subSchema.minLength;
        }
      }
    }
    return undefined;
  }

  resolveMaxLength(schema, visited = new Set()) {
    if (schema.maxLength !== undefined) return schema.maxLength;
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        if (subSchema.$ref) {
          const refName = this.getRefName(subSchema.$ref);
          if (!visited.has(refName)) {
            const resolved = this.resolveRef(subSchema.$ref);
            const maxLength = this.resolveMaxLength(resolved, visited);
            if (maxLength !== undefined) return maxLength;
          }
        } else if (subSchema.maxLength !== undefined) {
          return subSchema.maxLength;
        }
      }
    }
    return undefined;
  }

  resolveRef(ref) {
    const parts = ref.replace('#/', '').split('/');
    let current = this.spec;
    for (const part of parts) {
      current = current[part];
    }
    return current;
  }

  enhanceAllSDKs(baseDir) {
    console.log('Enhancing TypeScript SDK...');
    this.enhanceTypeScript(path.join(baseDir, 'typescript'));
    
    console.log('Enhancing C# SDK...');
    this.enhanceCSharp(path.join(baseDir, 'csharp'));
    
    console.log('Enhancing Go SDK...');
    this.enhanceGo(path.join(baseDir, 'go'));
    
    console.log('Enhancing Python SDK...');
    this.enhancePython(path.join(baseDir, 'python'));
    
    console.log('Enhancing PHP SDK...');
    this.enhancePHP(path.join(baseDir, 'php'));
    
    console.log('All SDKs enhanced successfully!');
  }

  // ===== TYPESCRIPT =====
  enhanceTypeScript(sdkPath) {
    const typesCode = this.generateTypeScriptTypes();
    const typesFilePath = path.join(sdkPath, 'semanticTypes.ts');
    fs.writeFileSync(typesFilePath, typesCode);
    
    this.updateTypeScriptModels(sdkPath);
    this.updateTypeScriptIndex(sdkPath);
    
    console.log(`  ✓ Created ${typesFilePath}`);
  }

  generateTypeScriptTypes() {
    let code = '// Auto-generated semantic types\n\n';
    
    for (const [name, type] of this.semanticTypes) {
      code += `/**\n * ${type.description}\n */\n`;
      code += `export type ${name} = string & { readonly __brand: '${name}' };\n\n`;
      
      code += `export class ${name}Type {\n`;
      code += `  /**\n   * Create a new ${name} with validation\n   */\n`;
      code += `  static create(value: string): ${name} {\n`;
      code += `    if (!this.isValid(value)) {\n`;
      code += `      throw new Error(\`Invalid ${name}: \${value}\`);\n`;
      code += `    }\n`;
      code += `    return value as ${name};\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Get the string value of a ${name}\n   */\n`;
      code += `  static getValue(key: ${name}): string {\n`;
      code += `    return key as string;\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Compare two ${name} instances for equality\n   */\n`;
      code += `  static equals(a: ${name}, b: ${name}): boolean {\n`;
      code += `    return (a as string) === (b as string);\n`;
      code += `  }\n\n`;
      
      code += `  /**\n   * Validate a string value for ${name}\n   */\n`;
      code += `  static isValid(value: string): boolean {\n`;
      code += `    if (!value) return false;\n`;
      if (type.pattern) {
        code += `    if (!/${type.pattern}/.test(value)) return false;\n`;
      }
      if (type.minLength !== undefined) {
        code += `    if (value.length < ${type.minLength}) return false;\n`;
      }
      if (type.maxLength !== undefined) {
        code += `    if (value.length > ${type.maxLength}) return false;\n`;
      }
      code += `    return true;\n`;
      code += `  }\n`;
      code += `}\n\n`;
    }
    
    return code;
  }

  updateTypeScriptModels(sdkPath) {
    const modelsDir = path.join(sdkPath, 'models');
    if (!fs.existsSync(modelsDir)) {
      console.log(`  ! Models directory not found: ${modelsDir}`);
      return;
    }
    
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
    
    for (const file of files) {
      const filePath = path.join(modelsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      // Add import if we're going to use semantic types
      const needsImport = Array.from(this.semanticTypes.keys()).some(typeName => 
        content.includes(`'${typeName}'`) || content.includes(`"${typeName}"`)
      );
      
      if (needsImport && !content.includes('import {') && !content.includes('semanticTypes')) {
        content = `import { ${Array.from(this.semanticTypes.keys()).join(', ')} } from '../semanticTypes';\n${content}`;
        changed = true;
      }
      
      for (const typeName of this.semanticTypes.keys()) {
        // Replace property declarations - handle both single quotes and double quotes
        const patterns = [
          new RegExp(`'(\\w*${typeName})'\\??: string`, 'g'),
          new RegExp(`"(\\w*${typeName})"\\??: string`, 'g'),
          new RegExp(`'(\\w*${typeName})': string`, 'g'),
          new RegExp(`"(\\w*${typeName})": string`, 'g')
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content.replace(pattern, `'$1'?: ${typeName}`);
            changed = true;
          }
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated ${file}`);
      }
    }
  }

  updateTypeScriptIndex(sdkPath) {
    const indexPath = path.join(sdkPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      if (!content.includes('semanticTypes')) {
        content += '\nexport * from "./semanticTypes";\n';
        fs.writeFileSync(indexPath, content);
        console.log(`  ✓ Updated index.ts`);
      }
    }
  }

  // ===== C# =====
  enhanceCSharp(sdkPath) {
    const typesCode = this.generateCSharpTypes();
    const typesFilePath = path.join(sdkPath, 'src/main/CSharp/YourCompany.ProcessApi/Model/SemanticTypes.cs');
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(typesFilePath), { recursive: true });
    fs.writeFileSync(typesFilePath, typesCode);
    
    this.updateCSharpModels(sdkPath);
    
    console.log(`  ✓ Created ${typesFilePath}`);
  }

  generateCSharpTypes() {
    let code = 'using System;\n';
    code += 'using System.Text.Json;\n';
    code += 'using System.Text.Json.Serialization;\n';
    code += 'using System.Text.RegularExpressions;\n\n';
    code += 'namespace YourCompany.ProcessApi.Model\n{\n';
    
    for (const [name, type] of this.semanticTypes) {
      code += `    /// <summary>\n    /// ${type.description}\n    /// </summary>\n`;
      code += `    [JsonConverter(typeof(${name}Converter))]\n`;
      code += `    public readonly struct ${name} : IEquatable<${name}>\n    {\n`;
      code += `        private readonly string _value;\n\n`;
      
      code += `        /// <summary>\n        /// Create a new ${name} with validation\n        /// </summary>\n`;
      code += `        public ${name}(string value)\n        {\n`;
      code += `            if (!IsValid(value))\n`;
      code += `                throw new ArgumentException($"Invalid ${name}: {value}");\n`;
      code += `            _value = value;\n        }\n\n`;
      
      code += `        /// <summary>\n        /// Get the string value\n        /// </summary>\n`;
      code += `        public string GetValue() => _value;\n\n`;
      
      code += `        /// <summary>\n        /// Implicit conversion to string for serialization\n        /// </summary>\n`;
      code += `        public static implicit operator string(${name} key) => key._value;\n\n`;
      
      code += `        /// <summary>\n        /// Explicit conversion from string with validation\n        /// </summary>\n`;
      code += `        public static explicit operator ${name}(string value) => new(value);\n\n`;
      
      code += `        public bool Equals(${name} other) => _value == other._value;\n`;
      code += `        public override bool Equals(object obj) => obj is ${name} other && Equals(other);\n`;
      code += `        public override int GetHashCode() => _value?.GetHashCode() ?? 0;\n`;
      code += `        public override string ToString() => _value;\n\n`;
      
      code += `        public static bool operator ==(${name} left, ${name} right) => left.Equals(right);\n`;
      code += `        public static bool operator !=(${name} left, ${name} right) => !left.Equals(right);\n\n`;
      
      code += `        /// <summary>\n        /// Validate a string value for ${name}\n        /// </summary>\n`;
      code += `        public static bool IsValid(string value)\n        {\n`;
      code += `            if (string.IsNullOrEmpty(value)) return false;\n`;
      if (type.pattern) {
        code += `            if (!Regex.IsMatch(value, @"${type.pattern}")) return false;\n`;
      }
      if (type.minLength !== undefined) {
        code += `            if (value.Length < ${type.minLength}) return false;\n`;
      }
      if (type.maxLength !== undefined) {
        code += `            if (value.Length > ${type.maxLength}) return false;\n`;
      }
      code += `            return true;\n        }\n    }\n\n`;
      
      // JSON Converter
      code += `    /// <summary>\n    /// JSON converter for ${name}\n    /// </summary>\n`;
      code += `    public class ${name}Converter : JsonConverter<${name}>\n    {\n`;
      code += `        public override ${name} Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)\n`;
      code += `        {\n            return new ${name}(reader.GetString());\n        }\n\n`;
      code += `        public override void Write(Utf8JsonWriter writer, ${name} value, JsonSerializerOptions options)\n`;
      code += `        {\n            writer.WriteStringValue(value.GetValue());\n        }\n    }\n\n`;
    }
    
    code += '}\n';
    return code;
  }

  updateCSharpModels(sdkPath) {
    const modelsDir = path.join(sdkPath, 'src/main/CSharp/YourCompany.ProcessApi/Model');
    if (!fs.existsSync(modelsDir)) {
      console.log(`  ! Models directory not found: ${modelsDir}`);
      return;
    }
    
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.cs') && f !== 'SemanticTypes.cs');
    
    for (const file of files) {
      const filePath = path.join(modelsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      for (const typeName of this.semanticTypes.keys()) {
        // Replace property declarations
        const patterns = [
          new RegExp(`public string (\\w*${typeName}) { get; set; }`, 'g'),
          new RegExp(`public string (\\w*${typeName})\\s*{\\s*get;\\s*set;\\s*}`, 'g')
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content.replace(pattern, `public ${typeName} $1 { get; set; }`);
            changed = true;
          }
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated ${file}`);
      }
    }
  }

  // ===== GO =====
  enhanceGo(sdkPath) {
    const typesCode = this.generateGoTypes();
    const typesFilePath = path.join(sdkPath, 'semantic_types.go');
    fs.writeFileSync(typesFilePath, typesCode);
    
    this.updateGoModels(sdkPath);
    
    console.log(`  ✓ Created ${typesFilePath}`);
  }

  generateGoTypes() {
    let code = 'package openapi\n\n';
    code += 'import (\n\t"encoding/json"\n\t"fmt"\n\t"regexp"\n)\n\n';
    
    for (const [name, type] of this.semanticTypes) {
      code += `// ${type.description}\n`;
      code += `type ${name} string\n\n`;
      
      code += `// New${name} creates a new ${name} with validation\n`;
      code += `func New${name}(value string) (${name}, error) {\n`;
      code += `\tif !isValid${name}(value) {\n`;
      code += `\t\treturn "", fmt.Errorf("invalid ${name}: %s", value)\n`;
      code += `\t}\n`;
      code += `\treturn ${name}(value), nil\n}\n\n`;
      
      code += `// GetValue returns the string value\n`;
      code += `func (k ${name}) GetValue() string {\n\treturn string(k)\n}\n\n`;
      
      code += `// Equals compares two ${name} instances\n`;
      code += `func (k ${name}) Equals(other ${name}) bool {\n\treturn k == other\n}\n\n`;
      
      code += `// String returns the string representation\n`;
      code += `func (k ${name}) String() string {\n\treturn string(k)\n}\n\n`;
      
      code += `// MarshalJSON implements json.Marshaler\n`;
      code += `func (k ${name}) MarshalJSON() ([]byte, error) {\n`;
      code += `\treturn json.Marshal(string(k))\n}\n\n`;
      
      code += `// UnmarshalJSON implements json.Unmarshaler\n`;
      code += `func (k *${name}) UnmarshalJSON(data []byte) error {\n`;
      code += `\tvar s string\n`;
      code += `\tif err := json.Unmarshal(data, &s); err != nil {\n`;
      code += `\t\treturn err\n\t}\n`;
      code += `\tkey, err := New${name}(s)\n`;
      code += `\tif err != nil {\n`;
      code += `\t\treturn err\n\t}\n`;
      code += `\t*k = key\n\treturn nil\n}\n\n`;
      
      code += `// isValid${name} validates a string value\n`;
      code += `func isValid${name}(value string) bool {\n`;
      code += `\tif value == "" {\n\t\treturn false\n\t}\n`;
      if (type.pattern) {
        code += `\tmatched, _ := regexp.MatchString(\`${type.pattern}\`, value)\n`;
        code += `\tif !matched {\n\t\treturn false\n\t}\n`;
      }
      if (type.minLength !== undefined) {
        code += `\tif len(value) < ${type.minLength} {\n\t\treturn false\n\t}\n`;
      }
      if (type.maxLength !== undefined) {
        code += `\tif len(value) > ${type.maxLength} {\n\t\treturn false\n\t}\n`;
      }
      code += `\treturn true\n}\n\n`;
    }
    
    return code;
  }

  updateGoModels(sdkPath) {
    const files = fs.readdirSync(sdkPath).filter(f => f.endsWith('.go') && f !== 'semantic_types.go');
    
    for (const file of files) {
      const filePath = path.join(sdkPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      for (const typeName of this.semanticTypes.keys()) {
        // Replace field declarations in structs
        const patterns = [
          new RegExp(`(\\w*${typeName})\\s+string\\s+\`json:"([^"]+)"\``, 'g'),
          new RegExp(`(\\w*${typeName})\\s+\\*string\\s+\`json:"([^"]+)"\``, 'g')
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content.replace(pattern, `$1 ${typeName} \`json:"$2"\``);
            changed = true;
          }
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated ${file}`);
      }
    }
  }

  // ===== PYTHON =====
  enhancePython(sdkPath) {
    const typesCode = this.generatePythonTypes();
    const typesFilePath = path.join(sdkPath, 'openapi_client/semantic_types.py');
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(typesFilePath), { recursive: true });
    fs.writeFileSync(typesFilePath, typesCode);
    
    this.updatePythonModels(sdkPath);
    this.updatePythonInit(sdkPath);
    
    console.log(`  ✓ Created ${typesFilePath}`);
  }

  generatePythonTypes() {
    let code = '"""Auto-generated semantic types"""\n';
    code += 'import re\nfrom typing import Any, Union\n\n';
    
    for (const [name, type] of this.semanticTypes) {
      code += `class ${name}:\n`;
      code += `    """${type.description}"""\n`;
      code += `    \n`;
      code += `    def __init__(self, value: str):\n`;
      code += `        if not self.is_valid(value):\n`;
      code += `            raise ValueError(f"Invalid ${name}: {value}")\n`;
      code += `        self._value = value\n\n`;
      
      code += `    def get_value(self) -> str:\n`;
      code += `        """Get the string value"""\n`;
      code += `        return self._value\n\n`;
      
      code += `    def __str__(self) -> str:\n`;
      code += `        return self._value\n\n`;
      
      code += `    def __eq__(self, other: Any) -> bool:\n`;
      code += `        if isinstance(other, ${name}):\n`;
      code += `            return self._value == other._value\n`;
      code += `        return False\n\n`;
      
      code += `    def __hash__(self) -> int:\n`;
      code += `        return hash(self._value)\n\n`;
      
      code += `    def __repr__(self) -> str:\n`;
      code += `        return f"${name}('{self._value}')"\n\n`;
      
      code += `    @staticmethod\n`;
      code += `    def is_valid(value: str) -> bool:\n`;
      code += `        """Validate a string value"""\n`;
      code += `        if not isinstance(value, str) or not value:\n`;
      code += `            return False\n`;
      if (type.pattern) {
        code += `        if not re.match(r'${type.pattern}', value):\n`;
        code += `            return False\n`;
      }
      if (type.minLength !== undefined) {
        code += `        if len(value) < ${type.minLength}:\n`;
        code += `            return False\n`;
      }
      if (type.maxLength !== undefined) {
        code += `        if len(value) > ${type.maxLength}:\n`;
        code += `            return False\n`;
      }
      code += `        return True\n\n`;
      
      code += `    def to_dict(self) -> str:\n`;
      code += `        """Convert to dictionary representation for JSON serialization"""\n`;
      code += `        return self._value\n\n`;
      
      code += `    @classmethod\n`;
      code += `    def from_dict(cls, value: str) -> '${name}':\n`;
      code += `        """Create from dictionary representation"""\n`;
      code += `        return cls(value)\n\n`;
    }
    
    return code;
  }

  updatePythonModels(sdkPath) {
    const modelsDir = path.join(sdkPath, 'openapi_client/models');
    if (!fs.existsSync(modelsDir)) {
      console.log(`  ! Models directory not found: ${modelsDir}`);
      return;
    }
    
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.py') && f !== '__init__.py');
    
    for (const file of files) {
      const filePath = path.join(modelsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      // Add import if needed
      const needsImport = Array.from(this.semanticTypes.keys()).some(typeName => 
        content.includes(`${typeName.toLowerCase()}`) || content.includes(typeName)
      );
      
      if (needsImport && !content.includes('from ..semantic_types import')) {
        const importLine = `from ..semantic_types import ${Array.from(this.semanticTypes.keys()).join(', ')}\n`;
        content = content.replace(/^(import|from)/, `${importLine}$1`);
        changed = true;
      }
      
      for (const typeName of this.semanticTypes.keys()) {
        // Replace type annotations and property definitions
        const patterns = [
          new RegExp(`(\\w*${typeName.toLowerCase()}): str`, 'g'),
          new RegExp(`(\\w*${typeName.toLowerCase()}): Optional\\[str\\]`, 'g'),
          new RegExp(`self\\.(\\w*${typeName.toLowerCase()}) = \\w*${typeName.toLowerCase()}`, 'g')
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content.replace(pattern, (match, propName) => {
              if (match.includes('Optional')) {
                return `${propName}: Optional[${typeName}]`;
              } else if (match.includes('self.')) {
                return `self.${propName} = ${typeName}(${propName}) if ${propName} else None`;
              } else {
                return `${propName}: ${typeName}`;
              }
            });
            changed = true;
          }
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated ${file}`);
      }
    }
  }

  updatePythonInit(sdkPath) {
    const initPath = path.join(sdkPath, 'openapi_client/__init__.py');
    if (fs.existsSync(initPath)) {
      let content = fs.readFileSync(initPath, 'utf8');
      if (!content.includes('semantic_types')) {
        content += '\nfrom .semantic_types import *\n';
        fs.writeFileSync(initPath, content);
        console.log(`  ✓ Updated __init__.py`);
      }
    }
  }

  // ===== PHP =====
  enhancePHP(sdkPath) {
    const typesCode = this.generatePHPTypes();
    const typesDir = path.join(sdkPath, 'lib/Model');
    const typesFilePath = path.join(typesDir, 'SemanticTypes.php');
    
    // Ensure directory exists
    fs.mkdirSync(typesDir, { recursive: true });
    fs.writeFileSync(typesFilePath, typesCode);
    
    this.updatePHPModels(sdkPath);
    
    console.log(`  ✓ Created ${typesFilePath}`);
  }

  generatePHPTypes() {
    let code = '<?php\n/**\n * Auto-generated semantic types\n */\n\n';
    code += 'namespace OpenAPI\\Client\\Model;\n\n';
    
    for (const [name, type] of this.semanticTypes) {
      code += `/**\n * ${type.description}\n */\n`;
      code += `class ${name} implements \\JsonSerializable\n{\n`;
      code += `    private string $value;\n\n`;
      
      code += `    /**\n     * Create a new ${name} with validation\n     */\n`;
      code += `    public function __construct(string $value)\n    {\n`;
      code += `        if (!$this->isValid($value)) {\n`;
      code += `            throw new \\InvalidArgumentException("Invalid ${name}: $value");\n`;
      code += `        }\n`;
      code += `        $this->value = $value;\n    }\n\n`;
      
      code += `    /**\n     * Get the string value\n     */\n`;
      code += `    public function getValue(): string\n    {\n`;
      code += `        return $this->value;\n    }\n\n`;
      
      code += `    /**\n     * String representation\n     */\n`;
      code += `    public function __toString(): string\n    {\n`;
      code += `        return $this->value;\n    }\n\n`;
      
      code += `    /**\n     * Compare with another ${name}\n     */\n`;
      code += `    public function equals(${name} $other): bool\n    {\n`;
      code += `        return $this->value === $other->value;\n    }\n\n`;
      
      code += `    /**\n     * JSON serialization\n     */\n`;
      code += `    public function jsonSerialize(): string\n    {\n`;
      code += `        return $this->value;\n    }\n\n`;
      
      code += `    /**\n     * Validate a string value\n     */\n`;
      code += `    private function isValid(string $value): bool\n    {\n`;
      code += `        if (empty($value)) return false;\n`;
      if (type.pattern) {
        code += `        if (!preg_match('/${type.pattern}/', $value)) return false;\n`;
      }
      if (type.minLength !== undefined) {
        code += `        if (strlen($value) < ${type.minLength}) return false;\n`;
      }
      if (type.maxLength !== undefined) {
        code += `        if (strlen($value) > ${type.maxLength}) return false;\n`;
      }
      code += `        return true;\n    }\n\n`;
      
      code += `    /**\n     * Create from array (for deserialization)\n     */\n`;
      code += `    public static function fromArray($value): ${name}\n    {\n`;
      code += `        return new self($value);\n    }\n}\n\n`;
    }
    
    return code;
  }

  updatePHPModels(sdkPath) {
    const modelsDir = path.join(sdkPath, 'lib/Model');
    if (!fs.existsSync(modelsDir)) {
      console.log(`  ! Models directory not found: ${modelsDir}`);
      return;
    }
    
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.php') && f !== 'SemanticTypes.php');
    
    for (const file of files) {
      const filePath = path.join(modelsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      for (const typeName of this.semanticTypes.keys()) {
        // Replace property declarations and type hints
        const patterns = [
          new RegExp(`protected \\$([a-z_]*${typeName.toLowerCase()}[a-z_]*);`, 'gi'),
          new RegExp(`public function set([A-Z][a-z]*${typeName}[A-Z][a-z]*)\\(\\$([a-z_]+)\\)`, 'g'),
          new RegExp(`public function get([A-Z][a-z]*${typeName}[A-Z][a-z]*)\\(\\)`, 'g'),
          new RegExp(`'([a-z_]*${typeName.toLowerCase()}[a-z_]*)' => 'string'`, 'gi')
        ];
        
        for (const pattern of patterns) {
          const originalContent = content;
          content = content.replace(pattern, (match, ...groups) => {
            if (match.includes('protected ')) {
              return match; // Keep property declaration as is, we'll handle type in getter/setter
            } else if (match.includes('set')) {
              return `public function set${groups[0]}(${typeName} ${groups[1]})`;
            } else if (match.includes('get')) {
              return `public function get${groups[0]}(): ${typeName}`;
            } else if (match.includes('=>')) {
              return `'${groups[0]}' => '${typeName}'`;
            }
            return match;
          });
          
          if (content !== originalContent) {
            changed = true;
          }
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated ${file}`);
      }
    }
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node enhance-semantic-types.js <spec-file> <sdks-directory>');
    console.log('Example: node enhance-semantic-types.js rest-api.domain.yaml ./sdks');
    process.exit(1);
  }
  
  let [specFile, sdksDir] = args;
  
  // Handle relative paths when called from different directories
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
    const enhancer = new SemanticTypeEnhancer(specFile);
    enhancer.enhanceAllSDKs(sdksDir);
  } catch (error) {
    console.error('Error enhancing SDKs:', error.message);
    process.exit(1);
  }
}

module.exports = { SemanticTypeEnhancer };