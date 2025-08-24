/**
 * Evaluate duplicate policy + idempotency semantics.
 * target = operation object (e.g. get/post/etc node)
 */
module.exports = (targetVal, _opts, ctx) => {
  if (!targetVal || typeof targetVal !== 'object') return [];

  const messages = [];

  // Extract metadata from either vendor extensions directly OR the x-operation-kind object/array.
  let kind;
  let policy = targetVal['x-duplicate-policy'];
  let idempotentExplicit = targetVal['x-idempotent'];
  let mech = targetVal['x-idempotency-mechanism'];

  const opKindExt = targetVal['x-operation-kind'];
  if (opKindExt) {
    const metas = Array.isArray(opKindExt) ? opKindExt : [opKindExt];
    for (const m of metas) {
      if (!m || typeof m !== 'object') continue;
      if (m.kind && !kind) kind = m.kind; // first wins
      if (m.duplicatePolicy && !policy) policy = m.duplicatePolicy;
      if (m.idempotent !== undefined && idempotentExplicit === undefined) idempotentExplicit = m.idempotent;
      if (m.idempotencyMechanism && !mech) mech = m.idempotencyMechanism;
    }
  }

  // Fallback kind if user incorrectly put whole OperationMetadata object directly (rare)
  if (!kind && targetVal.kind) kind = targetVal.kind;

  if (!mech) mech = 'none';

  const {
    requirePolicyForCreate,
    forbidPolicyOnNonCreate,
    enforceAlignment,
    warnConflictWithMechanism,
  } = _opts || {};

  const idempotentPolicies = new Set(['return-existing', 'ignore', 'upsert']);
  const nonIdempotentPolicies = new Set(['conflict', 'merge', 'batch-partial']);

  if (requirePolicyForCreate && kind === 'create' && !policy) {
    messages.push({
      message: 'Create operation missing x-duplicate-policy',
      path: ctx.path,
    });
  }

  if (forbidPolicyOnNonCreate && policy && kind !== 'create') {
    messages.push({
      message: 'x-duplicate-policy present but operation kind is not create',
      path: ctx.path,
    });
  }

  if (policy && !idempotentPolicies.has(policy) && !nonIdempotentPolicies.has(policy)) {
    messages.push({
      message: `Unknown x-duplicate-policy '${policy}'`,
      path: ctx.path,
    });
  }

  if (enforceAlignment && policy && idempotentExplicit !== undefined) {
    if (idempotentPolicies.has(policy) && idempotentExplicit === false) {
      messages.push({
        message: `Policy '${policy}' implies idempotent=true but metadata declares false`,
        path: ctx.path,
      });
    }
    if (nonIdempotentPolicies.has(policy) && idempotentExplicit === true) {
      messages.push({
        message: `Policy '${policy}' implies idempotent=false but metadata declares true`,
        path: ctx.path,
      });
    }
  }

  if (warnConflictWithMechanism && policy === 'conflict' && !['none', 'natural-key'].includes(mech)) {
    messages.push({
      message: `Policy 'conflict' with mechanism '${mech}' is unusual; consider return-existing or adjust mechanism`,
      path: ctx.path,
      severity: 1, // warn
    });
  }

  return messages;
};