import { describe, it, expect, vi } from 'vitest';
// Simulated user imports: they would import from the published package root entry
import camunda, { ProcessDefinitionKey, ProcessInstanceKey } from '../src';

// Helper to fabricate a minimal BPMN file blob (in real use this is a File or Blob from fs/browser)
function mockBpmn(name: string, id: string) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" id=\"Defs_1\">\n  <bpmn:process id=\"${id}\" isExecutable=\"true\">\n    <bpmn:startEvent id=\"start\"/>\n  </bpmn:process>\n</bpmn:definitions>`;
  return new Blob([xml], { type: 'application/xml' });
}

describe('End-to-end usage (mocked) - deploy -> create instance -> search', () => {
  it('deploys, starts and searches using plain & wrapped services', async () => {
    // Configure base URL (normally points to cluster/gateway)
    camunda.OpenAPI.BASE = 'https://mock.local';

    // Mock underlying request implementation globally
    const reqMod = await import('../src/gen/core/request');
    const requestSpy = vi.spyOn(reqMod, 'request');

    // Helper to wrap a raw value in a minimal CancelablePromise-like object expected by SDK
    const wrap = <T,>(val: T) => ({
      then: (res: any, rej?: any) => Promise.resolve(val).then(res, rej),
      catch: (rej: any) => Promise.resolve(val).catch(rej),
      finally: (f: any) => Promise.resolve(val).finally(f),
      cancel: () => undefined
    }) as any;

    // Mock responses with correct shapes:
    // 1. DeploymentResult: According to model, it has arrays decisionRequirements/decisions/forms/processes? (adjusting to minimal plausible subset used later)
    requestSpy.mockImplementationOnce((_cfg: any, opts: any) => {
      expect(opts.url).toBe('/deployments');
      return wrap({
        deployments: [ { processDefinition: { bpmnProcessId: 'demoProcess', version: 1, processDefinitionKey: '1001' } } ]
      });
    });

    // 2. CreateProcessInstanceResult
    requestSpy.mockImplementationOnce((_cfg: any, opts: any) => {
      expect(opts.url).toBe('/process-instances');
      return wrap({ processInstanceKey: '5001', processDefinitionKey: '1001', bpmnProcessId: 'demoProcess', version: 1 });
    });

    // 3. ProcessInstanceSearchQueryResult
    requestSpy.mockImplementationOnce((_cfg: any, opts: any) => {
      expect(opts.url).toBe('/process-instances/search');
      return wrap({ items: [ { processInstanceKey: '5001', processDefinitionKey: '1001' } ], total: 1 });
    });

    // Step 1: Deploy a BPMN resource
    const bpmn = mockBpmn('demo.bpmn', 'demoProcess');
    const deployment = await camunda.createDeployment({body: {  resources: [bpmn] } });
    // Some generator variants may not type 'processes'; use bracket access to avoid strict missing prop in model typings
    const rawDefKey = deployment.deployments[0].processDefinition!.processDefinitionKey;

    // Lift to branded key (shows user ergonomics)
  const defKey: ProcessDefinitionKey = ProcessDefinitionKey.assumeExists(String(rawDefKey));

    // Step 2: Start a process instance using the key overload
    const createResult = await camunda.createProcessInstance({ processDefinitionKey: defKey });
    const rawInstanceKey = createResult.processInstanceKey;
  const instanceKey: ProcessInstanceKey = ProcessInstanceKey.assumeExists(String(rawInstanceKey));

    // Step 3: Search for that process instance (using wrapped service for demo)
  const searchRes = await camunda.searchProcessInstances({ filter: { processInstanceKey: instanceKey } });

    expect(searchRes.items[0].processInstanceKey).toBe(String(instanceKey));
    expect(requestSpy).toHaveBeenCalledTimes(3);
  });
});


