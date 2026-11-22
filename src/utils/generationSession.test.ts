import {
  beginGeneration,
  buildRequestKey,
  classifyErgogenResponse,
  createGenerationSession,
  failActiveGeneration,
  invalidateSession,
  isActiveJscadVersion,
  isBackgroundPreviewRequestId,
  shouldSkipRequest,
} from './generationSession';

describe('generationSession', () => {
  it('routes background preview responses independently without touching active foreground state', () => {
    const session = createGenerationSession();
    const key = buildRequestKey('points: {}', undefined, false, false);
    const active = beginGeneration(session, {
      requestKey: key,
      targetConfigId: 'cfg-1',
      isManual: false,
      now: 1000,
    });

    const classification = classifyErgogenResponse(session, {
      type: 'success',
      requestId: 'background-preview-cfg-2',
    });

    expect(classification).toEqual({
      kind: 'background-preview',
      configId: 'cfg-2',
    });
    expect(session.active).toEqual(active);
    expect(isBackgroundPreviewRequestId(active.requestId)).toBeNull();
  });

  it('correlates active requestId and preserves targetConfigId on success', () => {
    const session = createGenerationSession();
    const key = buildRequestKey('points: {}', undefined, false, true);
    const active = beginGeneration(session, {
      requestKey: key,
      targetConfigId: 'cfg-a',
      isManual: true,
      now: 1234,
    });

    expect(active.requestId).toBe('ergogen-manual-1-1234');
    expect(shouldSkipRequest(session, key, true)).toBe(true);
    expect(shouldSkipRequest(session, key, false)).toBe(false);

    const result = classifyErgogenResponse(session, {
      type: 'success',
      requestId: active.requestId,
    });

    expect(result).toEqual({
      kind: 'active-success',
      version: 1,
      targetConfigId: 'cfg-a',
      isManual: true,
    });
    expect(shouldSkipRequest(session, key, true)).toBe(true);
    expect(isActiveJscadVersion(session, 1)).toBe(true);
    expect(isActiveJscadVersion(session, 2)).toBe(false);
  });

  it('drops stale responses (success and error) and messages without matching requestId', () => {
    const session = createGenerationSession();
    const first = beginGeneration(session, {
      requestKey: buildRequestKey('points: {a: {}}', undefined, false, false),
      targetConfigId: 'cfg-1',
      isManual: false,
      now: 10,
    });
    const second = beginGeneration(session, {
      requestKey: buildRequestKey('points: {b: {}}', undefined, false, false),
      targetConfigId: 'cfg-2',
      isManual: true,
      now: 20,
    });

    expect(
      classifyErgogenResponse(session, {
        type: 'success',
        requestId: first.requestId,
      })
    ).toEqual({ kind: 'stale' });
    expect(
      classifyErgogenResponse(session, {
        type: 'error',
        requestId: first.requestId,
      })
    ).toEqual({ kind: 'stale' });
    expect(
      classifyErgogenResponse(session, {
        type: 'success',
      })
    ).toEqual({ kind: 'stale' });

    expect(session.active).toEqual(second);
    expect(
      classifyErgogenResponse(session, {
        type: 'success',
        requestId: second.requestId,
      })
    ).toEqual({
      kind: 'active-success',
      version: 2,
      targetConfigId: 'cfg-2',
      isManual: true,
    });
  });

  it('clears dedup key and invalidates JSCAD on error or worker failure so retries run', () => {
    const session = createGenerationSession();
    const key = buildRequestKey('points: {}', undefined, false, false);
    const first = beginGeneration(session, {
      requestKey: key,
      targetConfigId: 'cfg-1',
      isManual: false,
      now: 100,
    });

    expect(
      classifyErgogenResponse(session, {
        type: 'error',
        requestId: first.requestId,
      })
    ).toEqual({ kind: 'active-error', isManual: false });
    expect(shouldSkipRequest(session, key, true)).toBe(false);
    expect(isActiveJscadVersion(session, first.version)).toBe(false);

    const second = beginGeneration(session, {
      requestKey: key,
      targetConfigId: 'cfg-1',
      isManual: false,
      now: 200,
    });
    failActiveGeneration(session);
    expect(shouldSkipRequest(session, key, true)).toBe(false);
    expect(
      classifyErgogenResponse(session, {
        type: 'success',
        requestId: second.requestId,
      })
    ).toEqual({ kind: 'stale' });
  });

  it('invalidates both in-flight Ergogen and in-flight JSCAD versions on session reset', () => {
    const session = createGenerationSession();
    const key = buildRequestKey('points: {}', undefined, false, false);
    const first = beginGeneration(session, {
      requestKey: key,
      targetConfigId: 'cfg-1',
      isManual: false,
      now: 100,
    });

    classifyErgogenResponse(session, {
      type: 'success',
      requestId: first.requestId,
    });
    expect(isActiveJscadVersion(session, first.version)).toBe(true);

    invalidateSession(session);
    expect(isActiveJscadVersion(session, first.version)).toBe(false);
    expect(shouldSkipRequest(session, key, true)).toBe(false);
  });

  it('handles unknown active response types cleanly', () => {
    const session = createGenerationSession();
    const first = beginGeneration(session, {
      requestKey: buildRequestKey('points: {}', undefined, false, false),
      targetConfigId: 'cfg-1',
      isManual: true,
      now: 100,
    });

    expect(
      classifyErgogenResponse(session, {
        type: 'unexpected',
        requestId: first.requestId,
      })
    ).toEqual({ kind: 'active-unknown', isManual: true });
    expect(session.active).toBeNull();
    expect(isActiveJscadVersion(session, first.version)).toBe(false);
  });
});
