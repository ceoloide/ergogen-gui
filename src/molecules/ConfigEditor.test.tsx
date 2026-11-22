import type { Mock } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import ConfigEditor from './ConfigEditor';
import { useConfigContext } from '../context/ConfigContext';
import { trackEvent } from '../utils/analytics';

let capturedAction: { run: () => void } | null = null;
let mockEditorValue = 'points: { initial: {} }';
const mockEditor = {
  getValue: vi.fn(() => mockEditorValue),
  setValue: vi.fn(),
  hasTextFocus: vi.fn(() => false),
  onDidBlurEditorText: vi.fn(),
  addAction: vi.fn((action: { run: () => void }) => {
    capturedAction = action;
  }),
};

const mockMonaco = {
  KeyMod: { CtrlCmd: 2048 },
  KeyCode: { Enter: 3 },
};

vi.mock('@monaco-editor/react', () => ({
  Editor: ({ onMount }: { onMount?: (e: unknown, m: unknown) => void }) => {
    const onMountRef = React.useRef(onMount);
    React.useEffect(() => {
      onMountRef.current?.(mockEditor, mockMonaco);
    }, []);
    return <div data-testid="monaco-mock" />;
  },
}));

vi.mock('../context/ConfigContext', () => ({
  useConfigContext: vi.fn(),
}));

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('ConfigEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedAction = null;
    mockEditorValue = 'points: { latest: {} }';
  });

  it('uses the latest injectionInput and generateNow in the Monaco Ctrl/Cmd+Enter action after prop updates', () => {
    const initialGenerateNow = vi.fn();
    const updatedGenerateNow = vi.fn();
    const updateRealtimeConfigInput = vi.fn();
    const setConfigInput = vi.fn();
    const updatedInjections = [
      ['footprint', 'custom_sw', 'module.exports = {}'],
    ];

    (useConfigContext as Mock).mockReturnValue({
      configInput: 'points: {}',
      updateRealtimeConfigInput,
      setConfigInput,
      injectionInput: [],
      generateNow: initialGenerateNow,
      activeConfigId: 'cfg-1',
    });

    const { rerender } = render(<ConfigEditor data-testid="config-editor" />);

    (useConfigContext as Mock).mockReturnValue({
      configInput: 'points: {}',
      updateRealtimeConfigInput,
      setConfigInput,
      injectionInput: updatedInjections,
      generateNow: updatedGenerateNow,
      activeConfigId: 'cfg-1',
    });
    rerender(<ConfigEditor data-testid="config-editor" />);

    expect(capturedAction).not.toBeNull();
    capturedAction?.run();

    expect(updateRealtimeConfigInput).toHaveBeenCalledWith(mockEditorValue);
    expect(setConfigInput).toHaveBeenCalledWith(mockEditorValue);
    expect(initialGenerateNow).not.toHaveBeenCalled();
    expect(updatedGenerateNow).toHaveBeenCalledWith(
      mockEditorValue,
      updatedInjections,
      { pointsonly: false, isManual: true }
    );
    expect(trackEvent).toHaveBeenCalledWith('shortcut_used', {
      action: 'generate',
    });
  });
});
