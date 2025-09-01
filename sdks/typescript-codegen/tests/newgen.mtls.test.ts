import { describe, it, expect, vi } from 'vitest';
import { configureNewgenRuntime } from '../src/gen/integrations';
import { OpenAPI } from '../src/gen';
import fs from 'fs';

const CERT = '-----BEGIN CERTIFICATE-----\nFAKECERT\n-----END CERTIFICATE-----';
const KEY = '-----BEGIN PRIVATE KEY-----\nFAKEKEY\n-----END PRIVATE KEY-----';
const CA = '-----BEGIN CERTIFICATE-----\nFAKECA\n-----END CERTIFICATE-----';

describe('newgen mTLS integration', () => {
  it('wraps fetch when agent present (paths precedence)', async () => {
    const tmp = fs.mkdtempSync('/tmp/mtls-newgen-');
    const certPath = tmp + '/c.pem'; const keyPath = tmp + '/k.pem'; const caPath = tmp + '/ca.pem';
    fs.writeFileSync(certPath, CERT); fs.writeFileSync(keyPath, KEY); fs.writeFileSync(caPath, CA);
    // Simulate facade creating an agent by stubbing global variable used in integration
    (globalThis as any).__CAMUNDA_MTLS_AGENT = { dummy: true };
    const originalFetch = global.fetch;
    const spy = vi.fn(async () => new Response(JSON.stringify({ ok:true }), { status:200, headers:{'Content-Type':'application/json'} }));
    // @ts-ignore
    global.fetch = spy;
    process.env.CAMUNDA_AUTH_STRATEGY = 'NONE';
    process.env.CAMUNDA_MTLS_CERT_PATH = certPath;
    process.env.CAMUNDA_MTLS_KEY_PATH = keyPath;
    process.env.CAMUNDA_MTLS_CA_PATH = caPath;
    configureNewgenRuntime();
    await OpenAPI.fetch!('/ping');
    expect(spy).toHaveBeenCalledTimes(1);
    // cleanup
    global.fetch = originalFetch;
    delete (globalThis as any).__CAMUNDA_MTLS_AGENT;
  });
});
