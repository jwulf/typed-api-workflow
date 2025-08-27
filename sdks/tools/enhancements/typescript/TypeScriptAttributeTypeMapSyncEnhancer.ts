import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { FlexibleSdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { SdkDefinitions, SupportedSdk } from '../../sdks';

interface PropMeta { name: string; required: boolean; type: string; }

export class TypeScriptAttributeTypeMapSyncEnhancer extends FlexibleSdkEnhancementStrategy {
  public name = 'typescript-attribute-type-map-sync';
  public supportedSdks: SupportedSdk[] = ['typescript'];
  public sdkEnhancementStrategies = { typescript: this.sync.bind(this) } as const;

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) { super(spec, sdks); }
  protected getStartMessage(): string { return '🧾 Syncing attributeTypeMap with final property declarations...'; }
  protected getCompletionMessage(): string { return '✅ attributeTypeMap synchronized with property declarations'; }

  private extractProps(src: string): PropMeta[] {
    // Heuristic: only capture property declarations that appear before the first 'static attributeTypeMap'
    const cutoff = src.indexOf('static attributeTypeMap');
    const classSegment = cutoff === -1 ? src : src.slice(0, cutoff);
    // Match property lines of the form 'prop'?: Type; (ignore those starting with // or *)
    const propRe = /^\s*['"]([A-Za-z0-9_$]+)['"]\s*(\??):\s*([^;]+);\s*$/gm;
    const props: PropMeta[] = [];
    let m: RegExpExecArray | null;
    while ((m = propRe.exec(classSegment)) !== null) {
      const [, name, opt, type] = m;
      props.push({ name, required: opt !== '?', type: type.trim() });
    }
    return props;
  }

  private rewriteAttributeTypeMap(src: string, props: PropMeta[]): string {
    if (props.length === 0) return src;
  // Match the entire static attributeTypeMap declaration block (tolerate generics with braces)
  const mapRe = /static attributeTypeMap:[^=]*= \[[\s\S]*?\];/m;
    const match = src.match(mapRe);
    if (!match) return src; // nothing to rewrite

    const entries = props.map(p => [
      '        {',
      `            "name": "${p.name}",`,
      `            "baseName": "${p.name}",`,
      `            "type": "${p.type}",`,
      `            "required": ${p.required}`,
      '        }'
    ].join('\n')).join(',\n');

  const replacement = `static attributeTypeMap: Array<{name: string, baseName: string, type: string, required: boolean}> = [\n${entries}\n    ];`;

    // Replace the whole block atomically to avoid partial corruption
    return src.slice(0, match.index!) + replacement + src.slice(match.index! + match[0].length);
  }

  private sync(sdkPath: string) {
    const modelDir = path.join(sdkPath, 'model');
    if (!fs.existsSync(modelDir)) return;
    const files = fs.readdirSync(modelDir).filter(f => f.endsWith('.ts') && f !== 'models.ts');
    for (const f of files) {
      const fp = path.join(modelDir, f);
      let src = fs.readFileSync(fp, 'utf8');
      if (!src.includes('static attributeTypeMap')) continue;
  // If file already appears corrupted (e.g., duplicated entries ending with ]",) skip to avoid cascading damage
  if (/]\",\s*"required"/.test(src)) continue;
      const props = this.extractProps(src);
      const updated = this.rewriteAttributeTypeMap(src, props);
      if (updated !== src) {
        fs.writeFileSync(fp, updated, 'utf8');
  continue; // atomic rewrite done
      }
    }
  }
}
