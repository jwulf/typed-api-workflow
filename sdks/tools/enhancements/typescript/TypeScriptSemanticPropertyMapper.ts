import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { FlexibleSdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { SdkDefinitions, SupportedSdk } from '../../sdks';

type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;

export class TypeScriptSemanticPropertyMapper extends FlexibleSdkEnhancementStrategy {
  name = 'TypeScriptSemanticPropertyMapper';
  supportedSdks: SupportedSdk[] = ['typescript'];
  sdkEnhancementStrategies = { typescript: this.enhanceTypeScript } as const;

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks);
  }

  protected getStartMessage(): string {
    return '🔗 Mapping semantic property types to nominal TS types...';
  }

  protected getCompletionMessage(): string {
    return '✅ Semantic property types mapped in TypeScript models!';
  }

  private getRefName(ref: string): string | undefined {
    const m = ref.match(/#\/components\/schemas\/([^/]+)$/);
    return m?.[1];
  }

  private resolveRef(ref: string): OpenAPIV3.SchemaObject | null {
    const parts = ref.replace('#/', '').split('/');
    let current: any = this.spec;
    for (const part of parts) {
      current = current?.[part];
      if (!current) return null;
    }
    return current as OpenAPIV3.SchemaObject;
  }

  private findSemanticTypeForSchema(schema: SchemaObject): string | undefined {
    if ('$ref' in schema && schema.$ref) {
      const resolved = this.resolveRef(schema.$ref);
      if (!resolved) return undefined;
  // Only use explicit x-semantic-type; do NOT fall back to ref name to avoid false positives
  const ext = (resolved as any)['x-semantic-type'] as string | undefined;
  return ext;
    }

    const obj = schema as OpenAPIV3.SchemaObject & { 'x-semantic-type'?: string };
    if (obj['x-semantic-type']) return obj['x-semantic-type'];

    if (obj.allOf) {
      for (const sub of obj.allOf) {
        const t = this.findSemanticTypeForSchema(sub);
        if (t) return t;
      }
    }
    if (obj.oneOf) {
      for (const sub of obj.oneOf) {
        const t = this.findSemanticTypeForSchema(sub);
        if (t) return t;
      }
    }
    if (obj.anyOf) {
      for (const sub of obj.anyOf) {
        const t = this.findSemanticTypeForSchema(sub);
        if (t) return t;
      }
    }
    return undefined;
  }

  private collectSemanticPropertyMap(): Map<string, Array<{ prop: string; type: string }>> {
    const map = new Map<string, Array<{ prop: string; type: string }>>();
    const schemas = this.spec.components?.schemas || {};

    const getProps = (schema: OpenAPIV3.SchemaObject): Record<string, SchemaObject> | undefined => {
      if (schema.properties) return schema.properties as Record<string, SchemaObject>;
      if (schema.allOf) {
        for (const s of schema.allOf) {
          if ('$ref' in s && s.$ref) {
            const resolved = this.resolveRef(s.$ref);
            if (resolved?.properties) return resolved.properties as Record<string, SchemaObject>;
          } else if ((s as OpenAPIV3.SchemaObject).properties) {
            return (s as OpenAPIV3.SchemaObject).properties as Record<string, SchemaObject>;
          }
        }
      }
      return undefined;
    };

  for (const [modelName, schema] of Object.entries(schemas)) {
      const resolved = '$ref' in (schema as any) && (schema as any).$ref
        ? this.resolveRef((schema as OpenAPIV3.ReferenceObject).$ref!)
        : (schema as OpenAPIV3.SchemaObject);
      if (!resolved || resolved.type !== 'object') continue;
      const props = getProps(resolved);
      if (!props) continue;

      for (const [propName, propSchema] of Object.entries(props)) {
        const semanticType = this.findSemanticTypeForSchema(propSchema);
        if (!semanticType) continue;
        // Only map known semantic types that exist in the generated TS types file
        // Heuristic: semantic types are PascalCase identifiers
        if (!/^[A-Z][A-Za-z0-9_]*$/.test(semanticType)) continue;
        const arr = map.get(modelName) || [];
        arr.push({ prop: propName, type: semanticType });
        map.set(modelName, arr);
    // Debug: log discovered semantic mapping
    console.log(`[SemanticPropertyMapper] ${modelName}.${propName} -> ${semanticType}`);
      }
    }

    return map;
  }

  private toModelFileName(modelName: string): string {
    return modelName.charAt(0).toLowerCase() + modelName.slice(1) + '.ts';
  }

  private ensureSemanticImport(src: string, types: Set<string>): { src: string; changed: boolean } {
    if (types.size === 0) return { src, changed: false };
    const importPath = "../semanticTypes";
    const needed = Array.from(types);
    const existingImportRe = new RegExp(`import\\s*{([^}]*)}\\s*from\\s*['\"]${importPath}['\"];?`);
    let changed = false;
    if (existingImportRe.test(src)) {
      src = src.replace(existingImportRe, (m, g1) => {
        const names = new Set(g1.split(',').map((s: string) => s.trim()).filter(Boolean));
        needed.forEach(n => names.add(n));
        changed = true;
        return `import { ${Array.from(names).join(', ')} } from '${importPath}';`;
      });
    } else {
      src = `import { ${needed.join(', ')} } from '${importPath}';\n` + src;
      changed = true;
    }
    return { src, changed };
  }

  private rewriteModelFile(filePath: string, props: Array<{ prop: string; type: string }>): void {
    if (!fs.existsSync(filePath)) return;
    let src = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Add/extend imports for semantic types
    const typeSet = new Set(props.map(p => p.type));
    const imp = this.ensureSemanticImport(src, typeSet);
    src = imp.src; changed = changed || imp.changed;

    for (const { prop, type } of props) {
      // Replace class property declaration types only (start-of-line, single-line until semicolon)
      // Capture: [indent + name][separator : or ?:][space][type...];
      const propDeclRe = new RegExp(
        `^(\\s*['\"]${prop}['\"]\\s*)(\\?:|:)(\\s*)[^;\n]+;`,
        'gm'
      );
      src = src.replace(propDeclRe, (_m, pre, sep, space) => {
        changed = true;
        return `${pre}${sep}${space}${type};`;
      });

      // Fix attributeTypeMap type annotation entries (within object literal entries)
      const attrMapRe = new RegExp(
        `(\{[^}]*"name"\s*:\s*"${prop}"[^}]*"type"\s*:\s*)"[^"]+"`,
        'g'
      );
      if (attrMapRe.test(src)) {
        src = src.replace(attrMapRe, `$1"${type}"`);
        changed = true;
      }
    }

    if (changed) fs.writeFileSync(filePath, src, 'utf8');
  }

  enhanceTypeScript(sdkPath: string) {
    const modelDir = path.join(sdkPath, 'model');
    if (!fs.existsSync(modelDir)) return;

    const map = this.collectSemanticPropertyMap();
    // Ensure cursor pagination props are mapped even if spec traversal misses them
    const ensure = (model: string, prop: string, type: string) => {
      const arr = map.get(model) || [];
      if (!arr.some(e => e.prop === prop)) {
        arr.push({ prop, type });
        map.set(model, arr);
        console.log(`[SemanticPropertyMapper] (fallback) ${model}.${prop} -> ${type}`);
      }
    };
    ensure('CursorForwardPagination', 'after', 'EndCursor');
    ensure('CursorBackwardPagination', 'before', 'StartCursor');
    for (const [modelName, props] of map.entries()) {
      const file = path.join(modelDir, this.toModelFileName(modelName));
      this.rewriteModelFile(file, props);
      console.log(`[SemanticPropertyMapper] Rewrote ${path.relative(process.cwd(), file)} with ${props.length} mapped prop(s)`);
    }
  }
}
