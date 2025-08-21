import * as fs from 'fs';
import * as path from 'path';
import { FlexibleSdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { SupportedSdk } from '../../sdks';

/**
 * Ensures generated TypeScript SDK uses non-deprecated dependencies.
 * - Force tough-cookie to ^4.x to avoid Node's deprecated built-in punycode usage.
 * - Add npm overrides to catch transitive references.
 */
export class TypeScriptDependencyPatchesEnhancer extends FlexibleSdkEnhancementStrategy {
  name = 'typescript-dependency-patches-enhancer';

  supportedSdks: SupportedSdk[] = ['typescript'];

  sdkEnhancementStrategies = {
    typescript: (sdkPath: string) => this.patchTypeScriptSdkDeps(sdkPath),
  } as const;

  private async patchTypeScriptSdkDeps(sdkPath: string): Promise<void> {
    const pkgPath = path.join(sdkPath, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      console.warn(`  ⚠️  No package.json found at ${pkgPath}; skipping dependency patch`);
      return;
    }

    const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
    let pkg: any;
    try {
      pkg = JSON.parse(pkgRaw);
    } catch (e) {
      console.warn(`  ⚠️  Failed to parse ${pkgPath}; skipping`);
      return;
    }

    const desiredToughCookie = '^4.1.4';
    let changed = false;

    const bump = (obj?: Record<string, string>) => {
      if (!obj) return;
      if (obj['tough-cookie'] && obj['tough-cookie'] !== desiredToughCookie) {
        obj['tough-cookie'] = desiredToughCookie;
        changed = true;
      }
      // Remove any explicit punycode entry; relying on modern deps not to use it
      if (obj['punycode']) {
        delete obj['punycode'];
        changed = true;
      }
    };

    bump(pkg.dependencies);
    bump(pkg.devDependencies);
    bump(pkg.optionalDependencies);

    // Ensure npm overrides to catch transitive tough-cookie
    pkg.overrides = Object.assign({}, pkg.overrides, {
      'tough-cookie': desiredToughCookie,
    });
    changed = true;

    if (changed) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('  ✅ Patched dependencies in generated TypeScript SDK (tough-cookie -> ^4.1.4)');
    } else {
      console.log('  ℹ️  No dependency patch needed; versions already up to date');
    }
  }

  protected getStartMessage(): string {
    return '🔧 Applying dependency patches for TypeScript SDK...';
  }

  protected getCompletionMessage(): string {
    return '✅ TypeScript dependency patches applied.';
  }
}
