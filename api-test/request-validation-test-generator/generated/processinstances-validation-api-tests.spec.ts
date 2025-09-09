/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */

/*
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated At: 2025-09-08T04:26:59.464Z
 * Spec Commit: 177fb9193d6c4d0ab558734d76c501bbac1f2454
 */
import {test, expect} from '@playwright/test';
import {jsonHeaders, buildUrl} from '../../../../utils/http';

test.describe('Processinstances Validation API Tests', () => {
  test('cancelProcessInstancesBatchOperation - Missing filter', async ({
    request,
  }) => {
    const requestBody = {};
    const res = await request.post(
      buildUrl('/process-instances/cancellation', undefined),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('createProcessInstance - oneOf violation', async ({request}) => {
    const requestBody = {
      processDefinitionId: 'x',
      processDefinitionKey: 'x',
    };
    const res = await request.post(buildUrl('/process-instances', undefined), {
      headers: jsonHeaders(),
      data: requestBody,
    });
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('migrateProcessInstance - Missing mappingInstructions', async ({
    request,
  }) => {
    const requestBody = {
      targetProcessDefinitionKey: 'x',
    };
    const res = await request.post(
      buildUrl('/process-instances/{processInstanceKey}/migration', {
        processInstanceKey: 'x',
      }),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('migrateProcessInstance - Missing targetProcessDefinitionKey', async ({
    request,
  }) => {
    const requestBody = {
      mappingInstructions: [],
    };
    const res = await request.post(
      buildUrl('/process-instances/{processInstanceKey}/migration', {
        processInstanceKey: 'x',
      }),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('migrateProcessInstancesBatchOperation - Missing filter', async ({
    request,
  }) => {
    const requestBody = {
      migrationPlan: {},
    };
    const res = await request.post(
      buildUrl('/process-instances/migration', undefined),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('migrateProcessInstancesBatchOperation - Missing migrationPlan', async ({
    request,
  }) => {
    const requestBody = {
      filter: 'x',
    };
    const res = await request.post(
      buildUrl('/process-instances/migration', undefined),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('modifyProcessInstancesBatchOperation - Missing filter', async ({
    request,
  }) => {
    const requestBody = {
      moveInstructions: [],
    };
    const res = await request.post(
      buildUrl('/process-instances/modification', undefined),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('modifyProcessInstancesBatchOperation - Missing moveInstructions', async ({
    request,
  }) => {
    const requestBody = {
      filter: 'x',
    };
    const res = await request.post(
      buildUrl('/process-instances/modification', undefined),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('resolveIncidentsBatchOperation - Missing filter', async ({request}) => {
    const requestBody = {};
    const res = await request.post(
      buildUrl('/process-instances/incident-resolution', undefined),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
});
