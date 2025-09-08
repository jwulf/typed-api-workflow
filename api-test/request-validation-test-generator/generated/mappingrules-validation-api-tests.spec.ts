/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
/*
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated At: 2025-09-08T02:40:57.021Z
 * Spec Commit: 3445d1d86c2ad361858dc12e734eeb6197e426a5
 */
import { test, expect } from '@playwright/test';
import { jsonHeaders, buildUrl } from '../../../../utils/http';

test.describe('Mappingrules Validation API Tests', () => {
  test('createMappingRule - Missing mappingRuleId', async ({ request }) => {
    const requestBody = {};
    const res = await request.post(buildUrl('/mapping-rules', undefined), {
      headers: jsonHeaders(),
      data: requestBody,
    });
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('deleteMappingRule - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/mapping-rules/{mappingRuleId}', { mappingRuleId: '12345' }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('getMappingRule - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.get(
      buildUrl('/mapping-rules/{mappingRuleId}', { mappingRuleId: '12345' }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('updateMappingRule - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/mapping-rules/{mappingRuleId}', { mappingRuleId: '12345' }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
});
