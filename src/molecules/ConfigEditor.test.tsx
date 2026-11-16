import { useEffect, useRef, useState } from 'react';
import { act, render } from '@testing-library/react';
import ConfigEditor from './ConfigEditor';

type ChangeHandler = (value: string | undefined) => void;

/** A minimal Monaco editor whose edits fire change events like the real one. */
const createFakeEditor = (initial: string, onChange: () => ChangeHandler) => {
  let value = initial;
  const update = (next: string) => {
    value = next;
    onChange()(value);
  };
  // Single-line positions are enough: offsets map to columns one to one.
  const model = {
    getValue: () => value,
    getPositionAt: (offset: number) => ({ lineNumber: 1, column: offset + 1 }),
    pushEditOperations: (
      _selections: unknown,
      edits: Array<{
        range: { startColumn: number; endColumn: number };
        text: string;
      }>
    ) => {
      const [{ range, text }] = edits;
      update(
        value.slice(0, range.startColumn - 1) +
          text +
          value.slice(range.endColumn - 1)
      );
    },
    setValue: update,
  };
  return {
    getModel: () => model,
    getValue: () => value,
    getSelections: () => [],
    hasTextFocus: () => false,
    onDidBlurEditorText: () => {},
    addAction: () => {},
    type: update,
  };
};

let editor: ReturnType<typeof createFakeEditor> | null = null;

vi.mock('@monaco-editor/react', () => ({
  Editor: ({
    defaultValue,
    onChange,
    onMount,
  }: {
    defaultValue: string;
    onChange: ChangeHandler;
    onMount: (editor: unknown, monaco: unknown) => void;
  }) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    useEffect(() => {
      editor = createFakeEditor(defaultValue, () => onChangeRef.current);
      onMount(editor, {
        KeyMod: { CtrlCmd: 0 },
        KeyCode: { Enter: 0 },
      });
      // Mounted once, like the real editor.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  },
}));

let context: Record<string, unknown> | null = null;
let writeFromOutside: ((value: string) => void) | null = null;
const setConfigInput = vi.fn();
const updateRealtimeConfigInput = vi.fn();

vi.mock('../context/ConfigContext', () => ({
  useConfigContext: () => context,
}));

const Harness = ({ initial }: { initial: string }) => {
  const [configInput, setText] = useState(initial);
  writeFromOutside = setText;
  setConfigInput.mockImplementation(setText);
  context = {
    configInput,
    setConfigInput,
    updateRealtimeConfigInput,
    injectionInput: undefined,
    generateNow: async () => {},
    activeConfigId: 'config-1',
  };
  return <ConfigEditor />;
};

describe('ConfigEditor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setConfigInput.mockReset();
    updateRealtimeConfigInput.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a change from outside without saving it back', () => {
    // Arrange
    render(<Harness initial={'a: 1\nb: 2\n'} />);

    // Act
    act(() => writeFromOutside?.('a: 1\nb: 3\n'));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Assert
    expect(editor?.getValue()).toBe('a: 1\nb: 3\n');
    expect(setConfigInput).not.toHaveBeenCalled();
  });

  it('still saves typing after a change from outside', () => {
    // Arrange
    render(<Harness initial={'a: 1\n'} />);
    act(() => writeFromOutside?.('a: 2\n'));

    // Act
    act(() => editor?.type('a: 3\n'));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Assert
    expect(setConfigInput).toHaveBeenCalledTimes(1);
    expect(setConfigInput).toHaveBeenCalledWith('a: 3\n');
    expect(updateRealtimeConfigInput).toHaveBeenLastCalledWith('a: 3\n');
  });
});
