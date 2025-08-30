import { generate } from 'openapi-typescript-codegen';
import path from 'path';
import fs from 'fs';

async function main() {
  const rootSpec = path.resolve(process.cwd(), '../../rest-api.domain.yaml');
  if (!fs.existsSync(rootSpec)) {
    console.error('Spec not found:', rootSpec);
    process.exit(1);
  }
  await generate({
    input: rootSpec,
    output: path.resolve(process.cwd(), 'src/gen'),
    httpClient: 'fetch',
    useOptions: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
    exportSchemas: false
  });
  // Run postprocess after codegen
  await import('./postprocess.js');
}

main();
