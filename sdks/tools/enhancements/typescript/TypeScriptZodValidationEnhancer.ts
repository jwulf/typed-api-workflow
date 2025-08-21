import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { FlexibleSdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { SdkDefinitions, SupportedSdk } from '../../sdks';

export class TypeScriptZodValidationEnhancer extends FlexibleSdkEnhancementStrategy {
  public name = 'typescript-zod-validation-enhancer';
  public supportedSdks: SupportedSdk[] = ['typescript'];

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks);
    this.sdkEnhancementStrategies = {
      typescript: this.enhanceTypeScriptSdk.bind(this),
    };
  }

  private enhanceTypeScriptSdk(sdkPath: string) {
    const modelsPath = path.join(sdkPath, 'model/models.ts');
    if (!fs.existsSync(modelsPath)) {
      console.log(`  ⚠️  models.ts not found at ${modelsPath}`);
      return;
    }

    let content = fs.readFileSync(modelsPath, 'utf8');

    // 1) Ensure zod is imported
    if (!content.includes("from 'zod'")) {
      const importMatch = content.match(/^(import.*?;\n)+/m);
      const insertAt = importMatch && importMatch.index !== undefined ? (importMatch.index + importMatch[0].length) : 0;
      content = content.slice(0, insertAt) + "import { z } from 'zod';\n" + content.slice(insertAt);
    }

    // 2) Inject helper functions after constants (mapSuffix).
    if (!content.includes('function __zodBuildSchema')) {
      const anchor = "const mapSuffix = \"; }\";";
      const idx = content.indexOf(anchor);
      if (idx !== -1) {
        const injection = `\n// Zod validation helpers (auto-injected)\nfunction __zodPrimitive(type: string): z.ZodTypeAny {\n    switch (type.toLowerCase()) {\n        case 'string': return z.string();\n        case 'boolean': return z.boolean();\n        case 'number':\n        case 'double':\n        case 'float': return z.number();\n        case 'integer':\n        case 'long': return z.number().int();\n        case 'any': default: return z.any();\n    }\n}\n\nfunction __zodBuildSchema(type: string): z.ZodTypeAny {\n    if (!type) return z.any();\n    const t = type.trim();\n    if ((primitives as string[]).indexOf(t.toLowerCase()) !== -1) {\n        return __zodPrimitive(t);\n    }\n    if (t === 'Date') {\n        return z.preprocess((v) => {\n            if (v instanceof Date) return v;\n            const d = new Date(v as any);\n            return isNaN(d.getTime()) ? v : d;\n        }, z.date());\n    }\n    if (t.endsWith(' | null')) {\n        return __zodBuildSchema(t.slice(0, -' | null'.length)).nullable();\n    }\n    if (t.endsWith(' | undefined')) {\n        return __zodBuildSchema(t.slice(0, -' | undefined'.length)).optional();\n    }\n    if (t.startsWith('Array<') && t.endsWith('>')) {\n        const sub = t.slice('Array<'.length, -1);\n        return z.array(__zodBuildSchema(sub));\n    }\n    if (t.startsWith('{ [key: string]: ') && t.endsWith('; }')) {\n        const sub = t.slice('{ [key: string]: '.length, -'; }'.length);\n        return z.record(z.string(), __zodBuildSchema(sub));\n    }\n    if ((enumsMap as any)[t]) {\n        return z.nativeEnum((enumsMap as any)[t]);\n    }\n    if ((t as string).includes(' | ')) {\n        const parts = t.split(' | ').map(s => s.trim());\n        return z.union(parts.map(p => __zodBuildSchema(p)) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);\n    }\n    if (!(typeMap as any)[t]) {\n        return z.any();\n    }\n    const attr = (typeMap as any)[t].getAttributeTypeMap();\n    const shape: Record<string, z.ZodTypeAny> = {};\n    for (const a of attr) {\n        const s = __zodBuildSchema(a.type);\n        shape[a.baseName] = s;\n    }\n    return z.object(shape);\n}\n\nfunction __zodValidate(data: any, type: string, phase: 'serialize' | 'deserialize') {\n    const mode = (typeof process !== 'undefined' && (process as any).env && (process as any).env.CAMUNDA_SDK_VALIDATION) || 'strict';\n    if (!type || mode === 'none') return;\n    try {\n        const schema = __zodBuildSchema(type);\n        const res = schema.safeParse(data);\n        if (!res.success) {\n            const details = res.error.issues.map(i => {\n                const path = (i.path && i.path.length ? i.path.join('.') : '(root)');\n                return \`\${path}: \${i.message}\`;\n            }).join('; ');\n            const msg = \`Validation failed (\${phase}) for \${type}: \${details}\`;\n            if (mode === 'warn') {\n                if (typeof console !== 'undefined' && console.warn) console.warn(msg);\n            } else {\n                throw new Error(msg);\n            }\n        }\n    } catch (e) {\n        if ((e as any).message && String((e as any).message).startsWith('Zod validation failed')) {\n            throw e;\n        }\n        // If schema building fails, do not block\n    }\n}\n`;
        content = content.slice(0, idx + anchor.length) + injection + content.slice(idx + anchor.length);
      }
    }

    // 3) Hook into serialize (object branch)
    if (!content.includes("__zodValidate(data, type, 'serialize')")) {
      content = content.replace(
        /(\s*\/\/ Get the actual type of this object\s*\n\s*type = this\.findCorrectType\(data, type\);)/,
        `$1\n            // Zod validation (centralized)\n            __zodValidate(data, type, 'serialize');`
      );
    }

    // 4) Hook into deserialize (object branch)
    if (!content.includes("__zodValidate(data, type, 'deserialize')")) {
      content = content.replace(
        /(\s*if \(!typeMap\[type\]\) \{ \/\/ dont know the type\s*\n\s*\s*return data;\s*\n\s*\}\s*\n\s*let instance = new typeMap\[type\]\(\);)/,
        `            // Zod validation (centralized)\n            __zodValidate(data, type, 'deserialize');\n$1`
      );
    }

    // 5) Hook into serialize (primitive branch)
    if (!content.includes("// Zod validation for primitive (serialize)")) {
      content = content.replace(
        /(\s*else if \(primitives\.indexOf\(type\.toLowerCase\(\)\) !== -1\) \{\s*\n\s*)return data;\s*\n\s*\}/,
        `$1// Zod validation for primitive (serialize)\n            __zodValidate(data, type, 'serialize');\n            return data;\n        }`
      );
    }

    // 6) Hook into deserialize (primitive branch)
    if (!content.includes("// Zod validation for primitive (deserialize)")) {
      // Target the later primitives branch within deserialize function
      const deserializePrimitivesRegex = /(\s*else if \(primitives\.indexOf\(type\.toLowerCase\(\)\) !== -1\) \{\s*\n\s*)return data;\s*\n\s*\}/;
      content = content.replace(
        deserializePrimitivesRegex,
        `$1// Zod validation for primitive (deserialize)\n            __zodValidate(data, type, 'deserialize');\n            return data;\n        }`
      );
    }

    // Ensure any pre-existing object schemas become partial
    if (content.includes('return z.object(shape);')) {
      content = content.replace('return z.object(shape);', 'return z.object(shape).partial();');
    }

    // Normalize any previously injected __zodValidate to a non-swallowing implementation
    const validatePattern = /function __zodValidate\(data: any, type: string, phase: 'serialize' \| 'deserialize'\) \{[\s\S]*?\n\}/m;
    if (validatePattern.test(content)) {
      const validateReplacement = 'function __zodValidate(data: any, type: string, phase: \'serialize\' | \'deserialize\') {\n' +
        '    const mode = (typeof process !== \'undefined\' && (process as any).env && (process as any).env.CAMUNDA_SDK_VALIDATION) || \'strict\';\n' +
        '    if (!type || mode === \'none\') return;\n' +
        '    let schema: z.ZodTypeAny;\n' +
        '    try {\n' +
        '        schema = __zodBuildSchema(type);\n' +
        '    } catch {\n' +
        '        // If schema building fails, do not block\n' +
        '        return;\n' +
        '    }\n' +
        '    const res = schema.safeParse(data);\n' +
        '    if (!res.success) {\n' +
        '        const details = res.error.issues.map(i => {\n' +
        '            const path = (i.path && i.path.length ? i.path.join(\'.\') : \'(root)\');\n' +
        "            return `${path}: ${i.message}`;\n" +
        '        }).join(\'; \');\n' +
        "        const msg = `Validation failed (${phase}) for ${type}: ${details}`;\n" +
        '        if (mode === \'warn\') {\n' +
        '            if (typeof console !== \'undefined\' && console.warn) console.warn(msg);\n' +
        '        } else {\n' +
        '            throw new Error(msg);\n' +
        '        }\n' +
        '    }\n' +
        '}';
      content = content.replace(validatePattern, validateReplacement);
    }

    fs.writeFileSync(modelsPath, content);
    console.log('  ✓ Injected Zod validation into ObjectSerializer');

  // 7) Ensure zod dependency in generated SDK
    const pkgPath = path.join(sdkPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.dependencies = pkg.dependencies || {};
      if (!pkg.dependencies['zod']) {
        pkg.dependencies['zod'] = '^3.23.0';
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log('  ✓ Added zod dependency to generated SDK package.json');
      }
    }
  }
  protected getStartMessage(): string {
    return '🧪 Adding centralized Zod validation to TypeScript SDK...';
  }
  protected getCompletionMessage(): string {
    return '✅ Zod validation injected into TypeScript SDK';
  }
}
