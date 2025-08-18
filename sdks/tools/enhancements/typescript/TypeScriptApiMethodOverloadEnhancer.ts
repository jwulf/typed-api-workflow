import * as fs from 'fs';
import * as path from 'path';
import { FlexibleSdkEnhancementStrategy } from "../../SdkPipelineOrchestrator";
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions, SupportedSdk } from "../../sdks";

type UnionAlias = {
  name: string;
  variants: string[];
};

/**
 * Inserts TypeScript method overloads into API classes to improve IDE narrowing without changing runtime.
 *
 * Two generic cases covered:
 * 1) Top-level union alias parameters (e.g., createProcessInstance and evaluateDecision)
 *    - Adds one overload per union variant with the parameter narrowed to that variant.
 * 2) Search requests with pagination where the request has property `page?: SearchQueryPageRequest`
 *    - Adds three overloads replacing `page` with OffsetPagination | CursorForwardPagination | CursorBackwardPagination via Omit<Req, 'page'> & { page?: Variant }.
 */
export class TypeScriptApiMethodOverloadEnhancer extends FlexibleSdkEnhancementStrategy {
  name = 'TypeScriptApiMethodOverloadEnhancer';
  supportedSdks: SupportedSdk[] = ['typescript'];
  sdkEnhancementStrategies = {
    typescript: this.enhanceTypeScript,
  };

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks);
  }

  protected getStartMessage(): string {
    return '🧪 Adding transparent API method overloads for unions...';
  }

  protected getCompletionMessage(): string {
    return '✅ Method overloads added for union parameters and pagination requests!';
  }

  enhanceTypeScript(sdkPath: string) {
    const modelDir = path.join(sdkPath, 'model');
    const apiDir = path.join(sdkPath, 'api');
  const ergoDir = path.join(sdkPath, 'ergonomics');
    if (!fs.existsSync(modelDir) || !fs.existsSync(apiDir)) return;

  // Ensure ergonomics helper for RequireAtLeastOne exists
  this.ensureRequireAtLeastOneHelper(ergoDir);

    // Build union alias map from model/*.ts (unwrap StrictUnion if present)
    console.log('  → Scanning models for union aliases and pagination-aware requests...');
    const unionAliases = this.collectUnionAliases(modelDir);
    const aliasNames = new Set(unionAliases.map(u => u.name));
    const unionByName = new Map(unionAliases.map(u => [u.name, u] as const));
    console.log('    • Union aliases:', unionAliases.length ? unionAliases.map(u => `${u.name}[${u.variants.length}]`).join(', ') : 'none');

    // Detect request models that have page?: SearchQueryPageRequest
    const paginationInfo = this.collectPaginationAwareRequests(modelDir);
    console.log('    • Pagination-aware requests:', paginationInfo.size ? Array.from(paginationInfo.keys()).join(', ') : 'none');

    // Process each API file, inserting overloads where applicable
    const apiFiles = fs.readdirSync(apiDir).filter(f => f.endsWith('.ts'));
    let modified = 0;
    for (const apiFile of apiFiles) {
      // Skip helper files like apis.ts
      if (apiFile === 'apis.ts') continue;

      const apiPath = path.join(apiDir, apiFile);
      let src = fs.readFileSync(apiPath, 'utf8');
      const original = src;

      console.log(`  → Processing API file: ${apiFile}`);

      // For each public async method, check if first parameter is a union alias
      // Pattern: public async methodName (paramName: TypeName ...
      const methodRegex = /public\s+async\s+(\w+)\s*\(([^)]*)\)\s*:\s*Promise<[^>]+>\s*\{/g;
      const insertions: Array<{ index: number; text: string }> = [];
      const neededImports = new Set<string>();

      let m: RegExpExecArray | null;
      let methodCount = 0;
      while ((m = methodRegex.exec(src)) !== null) {
        methodCount++;
        const methodName = m[1];
        const paramsSig = m[2].trim();
        // Example params: decisionEvaluationInstruction: DecisionEvaluationInstruction, options: {...} = {...}
        const firstParam = paramsSig.split(',')[0]?.trim();
        if (!firstParam) continue;
        const typeMatch = firstParam.match(/:\s*([A-Za-z0-9_]+)/);
        if (!typeMatch) continue;
        const paramType = typeMatch[1];

        // Overloads for top-level union alias parameter
        if (aliasNames.has(paramType)) {
          console.log(`    • Inserting union overloads for ${methodName} (${paramType})`);
          const union = unionByName.get(paramType)!;
          const insertionPoint = findOverloadInsertionPoint(src, m.index); // before decorators (if any)
          // Idempotency: if overload(s) for this method already exist between insertionPoint and method start, skip
          const preBlock = src.slice(insertionPoint, m.index);
          if (new RegExp(`public\\s+${methodName}\\s*\\(`).test(preBlock)) {
            continue;
          }
          const overloads = union.variants.map(v => {
            neededImports.add(`import { ${v} } from '../model/${toModelFilename(v)}';`);
            const firstReplaced = firstParam.replace(paramType, v);
            const rest = transformRestParamsForOverload(paramsSig);
            const paramsList = rest ? `${firstReplaced}, ${rest}` : firstReplaced;
            const insertionReturn = this.extractReturnType(src, m!.index);
            return `    public ${methodName}(${paramsList}): Promise<${insertionReturn}>;`;
          }).join('\n');
          insertions.push({ index: insertionPoint, text: overloads + '\n' });

          // Ensure we import the alias type if not already (usually present)
          neededImports.add(`import { ${paramType} } from '../model/${toModelFilename(paramType)}';`);
        }

        // Overloads for pagination nested in request types (single body param types with .page?: SearchQueryPageRequest)
        const pagInfo = paginationInfo.get(paramType);
        if (pagInfo && this.isSingleBodyParameter(paramsSig)) {
          console.log(`    • Inserting pagination overloads for ${methodName} (${paramType})`);
          // Create Omit<Req, 'page'> & { page?: Variant }
          const variants = ['OffsetPagination', 'CursorForwardPagination', 'CursorBackwardPagination'];
          variants.forEach(v => neededImports.add(`import { ${v} } from '../model/${toModelFilename(v)}';`));
          neededImports.add(`import { ${paramType} } from '../model/${toModelFilename(paramType)}';`);
          neededImports.add(`import { RequireAtLeastOne } from '../ergonomics/RequireAtLeastOne';`);
          neededImports.add(`import { StrictUnion } from '../ergonomics/StrictUnion';`);
          const insertionPoint = findOverloadInsertionPoint(src, m.index);
          const preBlock = src.slice(insertionPoint, m.index);
          if (new RegExp(`public\\s+${methodName}\\s*\\(`).test(preBlock)) {
            continue;
          }
          // Union-first overload to provide rich completions for all page variants
          const unionNarrowed = `Omit<${paramType}, 'page'> & { page?: StrictUnion<RequireAtLeastOne<OffsetPagination, 'from' | 'limit'> | CursorForwardPagination | CursorBackwardPagination> }`;
          // Specific variant overloads (placed first to improve contextual IntelliSense narrowing)
          const overloads = variants.map(v => {
            const narrowed = v === 'OffsetPagination'
              ? `Omit<${paramType}, 'page'> & { page?: RequireAtLeastOne<OffsetPagination, 'from' | 'limit'> }`
              : `Omit<${paramType}, 'page'> & { page?: ${v} }`;
            const narrowedFirst = firstParam.replace(paramType, narrowed);
            const rest = transformRestParamsForOverload(paramsSig);
            const paramsList = rest ? `${narrowedFirst}, ${rest}` : narrowedFirst;
            const insertionReturn = this.extractReturnType(src, m!.index);
            return `    public ${methodName}(${paramsList}): Promise<${insertionReturn}>;`;
          }).join('\n');
          // Union-first overload placed last to keep open completions on empty object
          const unionFirst = firstParam.replace(paramType, unionNarrowed);
          const unionRest = transformRestParamsForOverload(paramsSig);
          const unionParamsList = unionRest ? `${unionFirst}, ${unionRest}` : unionFirst;
          const unionReturn = this.extractReturnType(src, m!.index);
          const unionOverload = `    public ${methodName}(${unionParamsList}): Promise<${unionReturn}>;`;
          insertions.push({ index: insertionPoint, text: overloads + '\n' + unionOverload + '\n' });
        }
      }

      console.log(`    • Found ${methodCount} methods, pending insertions: ${insertions.length}`);

      if (insertions.length) {
        // Apply insertions in reverse order by index first, to avoid shifting indices
        insertions.sort((a, b) => b.index - a.index).forEach(ins => {
          src = src.slice(0, ins.index) + ins.text + src.slice(ins.index);
        });

        // Then inject imports if missing (compute indices on updated src)
        const importBlock = Array.from(neededImports)
          .filter(imp => !src.includes(imp))
          .join('\n');
        if (importBlock) {
          const lastImportIdx = findLastModelImportIndex(src);
          const insertIdx = lastImportIdx >= 0 ? lastImportIdx : 0;
          src = src.slice(0, insertIdx) + importBlock + '\n' + src.slice(insertIdx);
        }

        if (src !== original) {
          fs.writeFileSync(apiPath, src, 'utf8');
          modified++;
          console.log(`    • Saved ${apiFile} with overloads and imports`);
        }
      }
    }

    if (modified) {
      console.log(`  ✓ Inserted method overloads in ${modified} API file(s)`);
    } else {
      console.log('  ⏭️  No eligible API methods found for overload insertion');
    }
  }

  private ensureRequireAtLeastOneHelper(ergoDir: string) {
    if (!fs.existsSync(ergoDir)) fs.mkdirSync(ergoDir, { recursive: true });
    const helperPath = path.join(ergoDir, 'RequireAtLeastOne.ts');
    if (!fs.existsSync(helperPath)) {
      const content = `// Require at least one of the specified keys to be present
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Keys extends keyof T
    ? Omit<T, Keys> & Required<Pick<T, Keys>>
    : never;
`;
      fs.writeFileSync(helperPath, content, 'utf8');
    }
  }

  private collectUnionAliases(modelDir: string): UnionAlias[] {
    const files = fs.readdirSync(modelDir).filter(f => f.endsWith('.ts'));
    const out: UnionAlias[] = [];
    for (const f of files) {
      const p = path.join(modelDir, f);
      const src = fs.readFileSync(p, 'utf8');
      const m = src.match(/export type (\w+)\s*=\s*([^;]+);/);
      if (!m) continue;
      const name = m[1];
      let rhs = m[2].trim();
      const su = rhs.match(/^StrictUnion<([\s\S]+)>$/);
      if (su) rhs = su[1].trim();
      const tokens = rhs.split('|').map(t => t.trim()).filter(Boolean);
      if (tokens.length < 2) continue;
      if (!tokens.every(t => /^[A-Z][A-Za-z0-9_]*$/.test(t))) continue;
      out.push({ name, variants: tokens });
    }
    return out;
  }

  private collectPaginationAwareRequests(modelDir: string): Map<string, true> {
    // Identify classes that include a 'page' property with type 'SearchQueryPageRequest'
    const files = fs.readdirSync(modelDir).filter(f => f.endsWith('.ts'));
    const out = new Map<string, true>();
    for (const f of files) {
      const p = path.join(modelDir, f);
      const src = fs.readFileSync(p, 'utf8');
      // Find exported class name
      const classMatch = src.match(/export class (\w+)\s*\{/);
      if (!classMatch) continue;
      const className = classMatch[1];
      if (src.includes("'page'?")) {
        // Check attributeTypeMap or property declaration contains SearchQueryPageRequest
        if (src.includes("'page'?: SearchQueryPageRequest") || (src.includes('"page"') && src.includes('SearchQueryPageRequest'))) {
          out.set(className, true);
        }
      }
    }
    return out;
  }

  private extractReturnType(src: string, methodStartIndex: number): string {
    // Scan forward from methodStartIndex to find the first Promise<...> return type on the signature line
    const snippet = src.slice(methodStartIndex, methodStartIndex + 400);
    const m = snippet.match(/:\s*Promise<([^>]+)>/);
    return m ? m[1].trim() : 'any';
  }

  private isSingleBodyParameter(paramsSig: string): boolean {
    // Treat methods with one leading parameter (request) and an options param as eligible
    const parts = paramsSig.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length < 1) return false;
    // We ignore the options param; allow 1 or 2 (request + options)
    return parts.length === 1 || (parts.length === 2 && /options\s*:/.test(parts[1]));
  }
}

function toModelFilename(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function stripDefaultInitializer(param: string): string {
  // Remove `= ...` from parameter definitions for overload signatures
  return param.replace(/=.*/, '').trim();
}

function restParamsWithoutDefaults(paramsSig: string): string {
  const parts = paramsSig.split(',');
  if (parts.length <= 1) return '';
  const rest = parts.slice(1).map(p => stripDefaultInitializer(p.trim()));
  return rest.join(', ');
}

/**
 * For overload signatures, transform the rest parameters (excluding the first) by:
 * - Stripping default initializers ("= ...")
 * - Ensuring no required parameter follows an optional parameter (TS1016)
 *   Once an optional parameter is present (including if the first parameter is optional),
 *   all subsequent parameters must be optional (add "?" before ":").
 * - Additionally, if a parameter named "options" exists, force it to be optional.
 */
function transformRestParamsForOverload(paramsSig: string): string {
  const parts = paramsSig.split(',').map(s => s.trim());
  if (parts.length <= 1) return '';
  const first = parts[0];
  let seenOptional = /\w+\s*\?\s*:/.test(first);
  const out: string[] = [];
  for (const raw of parts.slice(1)) {
    let p = stripDefaultInitializer(raw);
    const isOptions = /^options\s*:/.test(p);
    const isOptional = /\w+\s*\?\s*:/.test(p);
    if (isOptions || (seenOptional && !isOptional)) {
      // Insert ? before the colon
      p = p.replace(/(\w+)\s*:/, '$1?:');
    }
    if (/\w+\s*\?\s*:/.test(p)) {
      seenOptional = true;
    }
    out.push(p);
  }
  return out.join(', ');
}

function findOverloadInsertionPoint(src: string, methodStartIndex: number): number {
  // We want to insert overloads before any decorators that may appear immediately above the method.
  // Walk backwards from methodStartIndex to skip blank lines and capture a contiguous block of decorators (lines starting with @)
  let idx = methodStartIndex;
  // Move to the start of the line containing 'public async'
  while (idx > 0 && src[idx - 1] !== '\n') idx--;
  // Now walk upwards collecting lines while they are decorators or blank
  let insertAt = idx;
  let scan = idx - 1;
  while (scan > 0) {
    // Find start of previous line
    let lineEnd = scan;
    while (scan > 0 && src[scan - 1] !== '\n') scan--;
    const lineStart = scan;
    const line = src.slice(lineStart, lineEnd).trim();
    if (line === '') { insertAt = lineStart; scan = lineStart - 1; continue; }
    if (line.startsWith('@')) { insertAt = lineStart; scan = lineStart - 1; continue; }
    break;
  }
  return insertAt;
}

function findLastModelImportIndex(src: string): number {
  const importRegex = /import\s+\{[^}]+\}\s+from\s+'\.\.\/model\/[A-Za-z0-9_-]+';\n/g;
  let lastIdx = -1;
  let m: RegExpExecArray | null;
  while ((m = importRegex.exec(src)) !== null) {
    lastIdx = m.index + m[0].length;
  }
  return lastIdx;
}
