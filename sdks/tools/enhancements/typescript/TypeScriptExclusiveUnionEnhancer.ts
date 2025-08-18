import * as fs from 'fs';
import * as path from 'path';
import { FlexibleSdkEnhancementStrategy } from "../../SdkPipelineOrchestrator";
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions, SupportedSdk } from "../../sdks";

/**
 * Enforce mutually exclusive object unions in the generated TS SDK by wrapping
 * union type aliases with a StrictUnion<X | Y | Z> helper. This triggers compile-time
 * errors when properties from multiple variants are combined.
 */
export class TypeScriptExclusiveUnionEnhancer extends FlexibleSdkEnhancementStrategy {
  name = 'TypeScriptExclusiveUnionEnhancer';
  supportedSdks: SupportedSdk[] = ['typescript'];
  sdkEnhancementStrategies = {
    typescript: this.enhanceTypeScript,
  };

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks);
  }

  protected getStartMessage(): string {
    return '🧩 Enforcing exclusive unions (XOR) in TypeScript models...';
  }

  protected getCompletionMessage(): string {
    return '✅ Exclusive unions enforced in TypeScript models!';
  }

  enhanceTypeScript(sdkPath: string) {
    const ergonomicsDir = path.join(sdkPath, 'ergonomics');
    if (!fs.existsSync(ergonomicsDir)) fs.mkdirSync(ergonomicsDir, { recursive: true });
    this.ensureStrictUnionHelper(ergonomicsDir);

    // Wrap known object unions with StrictUnion
    const modelDir = path.join(sdkPath, 'model');
    if (!fs.existsSync(modelDir)) return;

    const unionFilesToWrap = this.findUnionAliasesToWrap(modelDir);

    for (const file of unionFilesToWrap) {
      const filePath = path.join(modelDir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      if (!content.includes('StrictUnion')) {
        // add import
        content = `import { StrictUnion } from '../ergonomics/StrictUnion';\n` + content;
      }

      // Replace `export type X = A | B | C;` with `export type X = StrictUnion<A | B | C>;`
      content = content.replace(/export type (\w+)\s*=\s*([^;]+);/g, (_m, name, rhs) => {
        const trimmed = rhs.trim();
        if (/^StrictUnion<.*>$/.test(trimmed)) {
          // Already wrapped
          return `export type ${name} = ${trimmed};`;
        }
        return `export type ${name} = StrictUnion<${trimmed}>;`;
      });

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ Wrapped union with StrictUnion in ${file}`);
    }
  }

  private ensureStrictUnionHelper(dir: string) {
    const helperPath = path.join(dir, 'StrictUnion.ts');
    if (fs.existsSync(helperPath)) return;

    const helper = `// Enforce mutually exclusive object unions at compile time
// Usage: type U = StrictUnion<A | B | C>;
export type KeysOfUnion<T> = T extends any ? keyof T : never;
export type StrictUnion<T, TAll = T> =
  T extends any
    ? T & { [K in Exclude<KeysOfUnion<TAll>, keyof T>]?: never }
    : never;
`;

    fs.writeFileSync(helperPath, helper, 'utf8');
    console.log(`  ✓ Created ergonomics/StrictUnion.ts`);
  }

  private findUnionAliasesToWrap(modelDir: string): string[] {
    // Heuristic: wrap type-alias files that export a union of classes (not primitives)
    const files = fs.readdirSync(modelDir).filter(f => f.endsWith('.ts'));
    const targets: string[] = [];

    for (const file of files) {
      const p = path.join(modelDir, file);
      const content = fs.readFileSync(p, 'utf8');
      // Look for `export type X = A | B | C;` where A/B/C look like identifiers, not strings
      if (/export type \w+\s*=\s*[^;]*\|[^;]*;/.test(content)) {
        const match = content.match(/export type (\w+)\s*=\s*([^;]+);/);
        if (match) {
          const rhs = match[2].trim();
          if (rhs.includes('StrictUnion<')) continue; // already exclusive
          // Avoid primitive unions: ensure every token is PascalCase identifier
          const tokens = rhs.split('|').map(t => t.trim());
          const allPascal = tokens.every(t => /^[A-Z][A-Za-z0-9_]*$/.test(t));
          if (allPascal) {
            targets.push(file);
          }
        }
      }
    }

    return targets;
  }
}
