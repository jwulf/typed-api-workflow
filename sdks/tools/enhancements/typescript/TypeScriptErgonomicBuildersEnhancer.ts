import * as fs from 'fs';
import * as path from 'path';
import { FlexibleSdkEnhancementStrategy } from "../../SdkPipelineOrchestrator";
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions, SupportedSdk } from "../../sdks";

/**
 * Generate IDE-friendly builder helpers for object-union aliases.
 * For each exported type alias like:
 *   export type Foo = A | B | C;
 * emit ergonomics/builders/Foo.ts with:
 *   export const FooBuilder = {
 *     A: (args: A): Foo => args,
 *     B: (args: B): Foo => args,
 *     C: (args: C): Foo => args,
 *   } as const;
 * This keeps the API shape unchanged while providing constrained IntelliSense
 * when constructing a variant via FooBuilder.A({...}).
 */
export class TypeScriptErgonomicBuildersEnhancer extends FlexibleSdkEnhancementStrategy {
  name = 'TypeScriptErgonomicBuildersEnhancer';
  supportedSdks: SupportedSdk[] = ['typescript'];
  sdkEnhancementStrategies = {
    typescript: this.enhanceTypeScript,
  };

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks);
  }

  protected getStartMessage(): string {
    return '🧰 Generating ergonomic builders for object-union aliases...';
  }

  protected getCompletionMessage(): string {
    return '✅ Ergonomic builders generated and exported!';
  }

  enhanceTypeScript(sdkPath: string) {
    const modelDir = path.join(sdkPath, 'model');
    if (!fs.existsSync(modelDir)) return;

    const buildersDir = path.join(sdkPath, 'ergonomics', 'builders');
    fs.mkdirSync(buildersDir, { recursive: true });

    // Find type alias unions to build helpers for
    const aliasFiles = fs.readdirSync(modelDir).filter(f => f.endsWith('.ts'));
    const generated: string[] = [];

    for (const file of aliasFiles) {
      const filePath = path.join(modelDir, file);
      const src = fs.readFileSync(filePath, 'utf8');

      const m = src.match(/export type (\w+)\s*=\s*([^;]+);/);
      if (!m) continue;
      const alias = m[1];
      let rhs = m[2].trim();
      // Unwrap StrictUnion<...> if present
      const strictUnionMatch = rhs.match(/^StrictUnion<([\s\S]+)>$/);
      if (strictUnionMatch) {
        rhs = strictUnionMatch[1].trim();
      }
      // Only handle union of identifiers (classes), not primitives
      const tokens = rhs.split('|').map(t => t.trim()).filter(Boolean);
      if (tokens.length < 2) continue;
      if (!tokens.every(t => /^[A-Z][A-Za-z0-9_]*$/.test(t))) continue;

      // Generate builder file
      const builderFile = path.join(buildersDir, `${alias}.ts`);
      const imports = new Set<string>();
      tokens.forEach(t => imports.add(`import { ${t} } from '../../model/${toModelFilename(t)}';`));
      imports.add(`import { ${alias} } from '../../model/${toModelFilename(alias)}';`);

      const methods = tokens.map(t => {
        // Use the model name as the method for simplicity and uniqueness
        return `  /** Build ${alias} from ${t} */\n  ${t}(args: ${t}): ${alias} { return args; }`;
      }).join(',\n\n');

      const content = `// Auto-generated ergonomic builders for ${alias}\n${Array.from(imports).sort().join('\n')}\n\nexport const ${alias}Builder = {\n${methods}\n} as const;\n`;

      fs.writeFileSync(builderFile, content, 'utf8');
      generated.push(`${alias}.ts`);
    }

    // Create/update builders index to export all builders
    const indexPath = path.join(buildersDir, 'index.ts');
    const exports: string[] = [];
    for (const f of fs.readdirSync(buildersDir).filter(f => f.endsWith('.ts') && f !== 'index.ts')) {
      const base = f.replace(/\.ts$/, '');
      exports.push(`export * from './${base}';`);
    }
    const indexContent = `// Auto-generated ergonomic builders index\n${exports.sort().join('\n')}\n${exports.length === 0 ? 'export {}\n' : ''}`;
    fs.writeFileSync(indexPath, indexContent, 'utf8');

    // Ensure api.ts re-exports builders for discoverability
    const apiIndex = path.join(sdkPath, 'api.ts');
    if (fs.existsSync(apiIndex)) {
      let apiSrc = fs.readFileSync(apiIndex, 'utf8');
      if (!apiSrc.includes("export * as Builders from './ergonomics/builders';")) {
        apiSrc += `\nexport * as Builders from './ergonomics/builders';\n`;
        fs.writeFileSync(apiIndex, apiSrc, 'utf8');
      }
    }

    if (generated.length) {
      console.log(`  ✓ Generated builders for ${generated.length} union alias(es)`);
    } else {
      console.log('  ⏭️  No eligible union aliases found for builder generation');
    }
  }
}

function toModelFilename(name: string): string {
  // Convert PascalCase to the generator's lowerCamelCase file naming
  return name.charAt(0).toLowerCase() + name.slice(1);
}
