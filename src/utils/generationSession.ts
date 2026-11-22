interface ActiveGeneration {
  requestId: string;
  version: number;
  targetConfigId: string | null;
  requestKey: string;
  isManual: boolean;
}

interface GenerationSessionState {
  version: number;
  active: ActiveGeneration | null;
  settledVersion: number | null;
  settledRequestKey: string | null;
}

type ErgogenResponseClassification =
  | { kind: 'background-preview'; configId: string }
  | { kind: 'stale' }
  | { kind: 'active-error'; isManual: boolean }
  | {
      kind: 'active-success';
      version: number;
      targetConfigId: string | null;
      isManual: boolean;
    }
  | { kind: 'active-unknown'; isManual: boolean };

const BACKGROUND_PREVIEW_PREFIX = 'background-preview-';

export const createGenerationSession = (): GenerationSessionState => ({
  version: 0,
  active: null,
  settledVersion: null,
  settledRequestKey: null,
});

export const isBackgroundPreviewRequestId = (
  requestId: string | undefined
): string | null => {
  if (!requestId || !requestId.startsWith(BACKGROUND_PREVIEW_PREFIX)) {
    return null;
  }
  return requestId.slice(BACKGROUND_PREVIEW_PREFIX.length);
};

export const buildRequestKey = (
  config: string,
  injections: string[][] | undefined,
  pointsonly: boolean,
  debug: boolean
): string => JSON.stringify([config, injections, pointsonly, debug]);

export const shouldSkipRequest = (
  state: GenerationSessionState,
  requestKey: string,
  skipIfCurrent?: boolean
): boolean => {
  if (!skipIfCurrent) {
    return false;
  }
  const currentKey = state.active?.requestKey ?? state.settledRequestKey;
  return currentKey === requestKey;
};

export const beginGeneration = (
  state: GenerationSessionState,
  params: {
    requestKey: string;
    targetConfigId: string | null;
    isManual: boolean;
    now?: number;
  }
): ActiveGeneration => {
  state.version += 1;
  const prefix = params.isManual ? 'ergogen-manual' : 'ergogen-generate';
  const active: ActiveGeneration = {
    requestId: `${prefix}-${state.version}-${params.now ?? Date.now()}`,
    version: state.version,
    targetConfigId: params.targetConfigId,
    requestKey: params.requestKey,
    isManual: params.isManual,
  };
  state.active = active;
  state.settledVersion = null;
  state.settledRequestKey = null;
  return active;
};

export const classifyErgogenResponse = (
  state: GenerationSessionState,
  response: { type: string; requestId?: string }
): ErgogenResponseClassification => {
  const backgroundConfigId = isBackgroundPreviewRequestId(response.requestId);
  if (backgroundConfigId !== null) {
    return { kind: 'background-preview', configId: backgroundConfigId };
  }

  if (!state.active || response.requestId !== state.active.requestId) {
    return { kind: 'stale' };
  }

  const current = state.active;
  state.active = null;

  if (response.type === 'error') {
    state.settledVersion = null;
    state.settledRequestKey = null;
    return { kind: 'active-error', isManual: current.isManual };
  }

  if (response.type === 'success') {
    state.settledVersion = current.version;
    state.settledRequestKey = current.requestKey;
    return {
      kind: 'active-success',
      version: current.version,
      targetConfigId: current.targetConfigId,
      isManual: current.isManual,
    };
  }

  state.settledVersion = null;
  state.settledRequestKey = null;
  return { kind: 'active-unknown', isManual: current.isManual };
};

export const isActiveJscadVersion = (
  state: GenerationSessionState,
  configVersion: number
): boolean =>
  state.active === null &&
  state.settledVersion !== null &&
  configVersion === state.settledVersion;

export const failActiveGeneration = (state: GenerationSessionState): void => {
  state.active = null;
  state.settledVersion = null;
  state.settledRequestKey = null;
};

export const invalidateSession = (state: GenerationSessionState): void => {
  state.version += 1;
  state.active = null;
  state.settledVersion = null;
  state.settledRequestKey = null;
};
