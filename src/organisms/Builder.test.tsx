import { useRef, useState } from 'react';
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Builder from './Builder';
import { computeLayout } from '../utils/builder/pointsPreview';
import { BUILDER_STARTER_CONFIG } from '../utils/builder/starterConfig';

type HarnessContext = {
  configInput: string;
  activeConfigId: string;
  getRealtimeConfigInput: () => string;
  updateRealtimeConfigInput: (value: string) => void;
  setConfigInput: (value: string) => void;
};

let context: HarnessContext | null = null;
let setTextFromOutside: ((value: string) => void) | null = null;
let switchConfig: ((id: string, value: string) => void) | null = null;
/** While true, the points worker holds its answers until they are released. */
let holdWorker = false;
let heldAnswers: Array<() => void> = [];
const releaseWorker = () => {
  holdWorker = false;
  const answers = heldAnswers;
  heldAnswers = [];
  answers.forEach((answer) => answer());
};

vi.mock('../context/ConfigContext', () => ({
  useConfigContext: () => context,
}));

// A points worker that runs the real engine on the main thread.
vi.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => null,
  createJscadWorker: () => null,
  createPointsWorker: () => {
    const worker = {
      onmessage: null as ((event: MessageEvent) => void) | null,
      onerror: null,
      terminate: () => {},
      postMessage: ({ id, text }: { id: number; text: string }) => {
        const answer = () => {
          let data;
          try {
            data = { id, type: 'success', layout: computeLayout(text) };
          } catch (error) {
            data = { id, type: 'error', error: (error as Error).message };
          }
          worker.onmessage?.({ data } as MessageEvent);
        };
        if (holdWorker) heldAnswers.push(answer);
        else setTimeout(answer, 0);
      },
    };
    return worker;
  },
}));

const Harness = ({ initial }: { initial: string }) => {
  const [text, setText] = useState(initial);
  const [activeConfigId, setActiveConfigId] = useState('config-1');
  const realtime = useRef(initial);
  setTextFromOutside = (value) => {
    realtime.current = value;
    setText(value);
  };
  switchConfig = (id, value) => {
    realtime.current = value;
    setActiveConfigId(id);
    setText(value);
  };
  context = {
    configInput: text,
    activeConfigId,
    getRealtimeConfigInput: () => realtime.current,
    updateRealtimeConfigInput: (value) => {
      realtime.current = value;
    },
    setConfigInput: (value) => setText(value),
  };
  return <Builder />;
};

const currentText = () => context?.getRealtimeConfigInput() ?? '';

const commented = BUILDER_STARTER_CONFIG.replace(
  '        ring:\n',
  '        ring: # reach column\n'
);

const renderBuilder = async (initial = commented) => {
  render(<Harness initial={initial} />);
  await screen.findByRole('button', { name: 'matrix_pinky_bottom' });
};

describe('Builder', () => {
  afterEach(() => {
    holdWorker = false;
    heldAnswers = [];
  });

  it('draws the engine layout and selects the first key', async () => {
    // Act
    await renderBuilder();

    // Assert
    expect(screen.getAllByRole('button', { name: /^matrix_/ })).toHaveLength(
      15
    );
    // The first key is selected once the layout is shown.
    expect(
      await screen.findByRole('heading', { name: 'matrix_pinky_bottom' })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId('builder-status')).toHaveTextContent('15 keys')
    );
  });

  it('edits a column stagger through the form, keeps comments and undoes', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('button', { name: 'matrix_ring_home' }));
    const field = screen.getByLabelText('Stagger (mm, column)');

    // Act
    await user.clear(field);
    await user.type(field, 'cy/2{Enter}');

    // Assert
    expect(currentText()).toContain(
      '        ring: # reach column\n          key:\n            stagger: cy/2\n'
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Effective 8\.5 mm, from column \(cy\/2\)/)
      ).toBeInTheDocument()
    );

    // Act: undo and redo
    await user.click(screen.getByRole('button', { name: /^Undo stagger/ }));
    expect(currentText()).toBe(commented);
    await user.click(screen.getByRole('button', { name: /^Redo stagger/ }));
    expect(currentText()).toContain('stagger: cy/2');
  });

  it('selects the source key when a mirrored key is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByLabelText(/Mirror the board/));
    const mirrored = await screen.findByRole('button', {
      name: 'mirror_matrix_index_top, mirror of matrix_index_top',
    });

    // Act
    fireEvent.click(mirrored);

    // Assert
    expect(
      screen.getByRole('heading', { name: 'matrix_index_top' })
    ).toBeInTheDocument();
    expect(currentText()).toContain(
      '  mirror:\n    ref: matrix_inner_bottom\n    distance: 40\n'
    );
  });

  it('adds and deletes structure and keeps a valid selection', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('button', { name: 'matrix_middle_top' }));

    // Act
    await user.click(screen.getByRole('button', { name: 'Add column' }));

    // Assert
    expect(
      await screen.findByRole('heading', { name: 'matrix_col1_bottom' })
    ).toBeInTheDocument();
    expect(currentText()).toContain(
      '          stagger: 3\n        col1:\n        index:'
    );
    // The starter's board hull takes in the new keys.
    expect(currentText()).toContain(
      '        - matrix_middle_top\n        - matrix_col1_bottom\n'
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Delete column' }));

    // Assert
    expect(currentText()).toBe(commented);
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'matrix_col1_bottom' })
      ).not.toBeInTheDocument()
    );
  });

  it('keeps the last valid layout and pauses edits while the YAML is invalid', async () => {
    // Arrange
    await renderBuilder();

    // Act
    act(() => setTextFromOutside?.('points:\n  zones: [\n'));

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId('builder-status')).toHaveTextContent(
        /last valid layout is shown and editing is paused/
      )
    );
    expect(screen.getAllByRole('button', { name: /^matrix_/ })).toHaveLength(
      15
    );
    expect(screen.getByRole('button', { name: 'Add column' })).toBeDisabled();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  });

  it('works from the keyboard: select a key and nudge its column', async () => {
    // Arrange
    await renderBuilder();
    const key = screen.getByRole('button', { name: 'matrix_ring_top' });

    // Act
    key.focus();
    fireEvent.keyDown(key, { key: 'Enter' });
    const handle = await screen.findByRole('slider', {
      name: 'Column ring stagger',
    });
    fireEvent.keyDown(handle, { key: 'ArrowUp' });

    // Assert
    expect(currentText()).toContain('          stagger: 6.5\n');
  });

  it('explains a refused edit instead of changing the YAML', async () => {
    // Arrange
    const user = userEvent.setup();
    const extended = commented
      .replace(
        '    matrix:\n',
        '    matrix:\n      $extends: points.zones.base\n'
      )
      .replace(
        '  zones:\n',
        '  zones:\n    base:\n      key:\n        padding: 19\n'
      );
    await renderBuilder(extended);
    await user.click(screen.getByRole('button', { name: 'matrix_ring_home' }));
    const field = screen.getByLabelText('Splay (°, column)');

    // Act
    await user.type(field, '5{Enter}');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(/\$extends/);
    expect(currentText()).toBe(extended);
  });

  it('refuses an edit while the YAML has changed since the layout', async () => {
    // Arrange: typing in the editor updates the realtime text first
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('button', { name: 'matrix_ring_home' }));
    const typed = `${commented}# typing\n`;
    context?.updateRealtimeConfigInput(typed);

    // Act
    const field = screen.getByLabelText('Stagger (mm, column)');
    await user.clear(field);
    await user.type(field, '9{Enter}');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /catching up with the YAML/
    );
    expect(currentText()).toBe(typed);
    expect(field).toHaveValue('6');
  });

  it('starts over with a fresh layout and selection for another config', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('button', { name: 'matrix_ring_home' }));
    await user.click(screen.getByRole('button', { name: 'Add column' }));
    await screen.findByRole('heading', { name: 'matrix_col1_bottom' });

    // Act: the other config has keys with the same names
    act(() => switchConfig?.('config-2', BUILDER_STARTER_CONFIG));

    // Assert: the old layout is gone at once, then the new one is shown
    expect(
      screen.queryByRole('button', { name: /^matrix_/ })
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'matrix_pinky_bottom' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'matrix_col1_bottom' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it.each([
    ['opened', ['config-2']],
    ['opened and left again', ['config-2', 'config-1']],
  ])(
    'refuses a checked edit when another config with the same YAML is %s meanwhile',
    async (_, switches) => {
      // Arrange: the engine holds its answer to the check of the edit
      const user = userEvent.setup();
      await renderBuilder();
      await user.click(
        screen.getByRole('button', { name: 'matrix_ring_home' })
      );
      const field = screen.getByLabelText('Stagger (mm, column)');
      await user.clear(field);
      holdWorker = true;
      await user.type(field, '9{Enter}');

      // Act: switch configurations, all with the same text, then answer
      for (const id of switches) {
        act(() => switchConfig?.(id, commented));
      }
      await act(async () => releaseWorker());

      // Assert: nothing was written and no history was recorded
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /another configuration was opened/
      );
      expect(currentText()).toBe(commented);
      expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
    }
  );

  it('reports an empty configuration instead of waiting forever', async () => {
    // Arrange
    await renderBuilder();

    // Act
    act(() => setTextFromOutside?.(''));

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId('builder-status')).toHaveTextContent(
        'The configuration is empty.'
      )
    );
  });

  it('explains a mistyped expression, keeps the YAML and resets the field', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('button', { name: 'matrix_ring_home' }));
    const field = screen.getByLabelText('Stagger (mm, column)');

    // Act
    await user.clear(field);
    await user.type(field, 'cy/{Enter}');

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Ergogen could not lay out the result/
    );
    expect(currentText()).toBe(commented);
    await waitFor(() => expect(field).toHaveValue('6'));
    await user.click(screen.getByTestId('builder-status'));
    expect(currentText()).toBe(commented);
  });

  it('shows the written value after an input that reads the same', async () => {
    // Arrange
    const user = userEvent.setup();
    const decimal = commented.replace('stagger: 6\n', 'stagger: 6.0\n');
    await renderBuilder(decimal);
    await user.click(screen.getByRole('button', { name: 'matrix_ring_home' }));
    const field = screen.getByLabelText('Stagger (mm, column)');
    expect(field).toHaveValue('6');

    // Act
    await user.clear(field);
    await user.type(field, '6.0{Enter}');

    // Assert
    await waitFor(() => expect(currentText()).toBe(commented));
    await waitFor(() => expect(field).toHaveValue('6'));
  });

  it('moves the column with its handle whatever scope is chosen', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('button', { name: 'matrix_ring_top' }));
    await user.click(screen.getByRole('radio', { name: 'Zone' }));
    const handle = await screen.findByRole('slider', {
      name: 'Column ring stagger',
    });

    // Act
    fireEvent.keyDown(handle, { key: 'ArrowUp' });

    // Assert
    expect(currentText()).toContain(
      '        ring: # reach column\n          key:\n            stagger: 6.5\n'
    );
    expect(currentText()).not.toMatch(/matrix:\n {6}key:/);
    expect(handle).toHaveAttribute('aria-valuemin', '-200');
    expect(handle).toHaveAttribute('aria-valuemax', '200');
    expect(
      screen.getByRole('button', { name: /^Move zone matrix, shift 0, 0 mm/ })
    ).toBeInTheDocument();
  });

  it('steps a handle from a value beyond its usual range', async () => {
    // Arrange
    const far = commented.replace('stagger: 6\n', 'stagger: 300\n');
    await renderBuilder(far);
    fireEvent.click(screen.getByRole('button', { name: 'matrix_ring_top' }));
    const handle = await screen.findByRole('slider', {
      name: 'Column ring stagger',
    });

    // Act
    fireEvent.keyDown(handle, { key: 'ArrowDown' });

    // Assert
    expect(handle).toHaveAttribute('aria-valuemax', '300');
    expect(currentText()).toBe(far.replace('stagger: 300', 'stagger: 299.5'));
  });

  it('does not let a handle replace an expression', async () => {
    // Arrange
    const expression = commented.replace('stagger: 6', 'stagger: cy/4');
    await renderBuilder(expression);
    fireEvent.click(screen.getByRole('button', { name: 'matrix_ring_top' }));
    const handle = await screen.findByRole('slider', {
      name: 'Column ring stagger',
    });

    // Act
    fireEvent.keyDown(handle, { key: 'ArrowUp' });

    // Assert
    expect(handle).toHaveAttribute('aria-disabled', 'true');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /expression "cy\/4"/
    );
    expect(currentText()).toBe(expression);
  });

  it('skips every key and restores them from a skipped key', async () => {
    // Arrange
    const user = userEvent.setup();
    await renderBuilder();
    await user.click(screen.getByRole('radio', { name: 'All keys' }));

    // Act
    await user.click(screen.getByLabelText(/Skip all keys/));

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId('builder-status')).toHaveTextContent('0 keys')
    );
    const box = screen.getByLabelText(/Skip all keys/);
    expect(box).toBeChecked();
    expect(box).toBeEnabled();
    expect(currentText()).toContain('      points: []\n');

    // Act
    await user.click(box);

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId('builder-status')).toHaveTextContent('15 keys')
    );
    const outlines = (text: string) => text.slice(text.indexOf('outlines:'));
    expect(outlines(currentText())).toBe(outlines(commented));
  });

  describe('skip inheritance', () => {
    const zoneSkip = '      key:\n        skip: true\n      columns:\n';
    const columnSkip =
      '        ring: # reach column\n          key:\n            stagger: 6\n            skip: true\n';
    const keySkip =
      '          rows:\n            top:\n              skip: true\n';
    const withColumnSkip = (text: string) =>
      text.replace(
        '        ring: # reach column\n          key:\n            stagger: 6\n',
        columnSkip
      );
    const withKeySkip = (text: string) =>
      text.replace(
        '            stagger: 6\n',
        `            stagger: 6\n${keySkip}`
      );
    const withKeySkipAfterColumnSkip = (text: string) =>
      text.replace(columnSkip, `${columnSkip}${keySkip}`);

    const renderAt = async (initial: string, keyName: string) => {
      const user = userEvent.setup();
      render(<Harness initial={initial} />);
      await user.click(
        await screen.findByRole('button', {
          name: new RegExp(`^${keyName}(, skipped)?$`),
        })
      );
      await user.click(screen.getByRole('radio', { name: 'Column' }));
      return user;
    };

    const keyCount = (count: number) =>
      waitFor(() =>
        expect(screen.getByTestId('builder-status')).toHaveTextContent(
          `${count} keys`
        )
      );

    it('does not show a column as skipped when only one of its keys is', async () => {
      // Arrange and act
      await renderAt(withKeySkip(commented), 'matrix_ring_top');

      // Assert
      const box = screen.getByLabelText(/Skip keys in this column/);
      expect(box).not.toBeChecked();
      expect(box).toHaveAccessibleDescription(
        'A narrower key value skips the selected key anyway.'
      );
    });

    it('turns a column skip off against a broader skip and keeps narrower ones', async () => {
      // Arrange
      const text = withKeySkipAfterColumnSkip(
        withColumnSkip(commented.replace('      columns:\n', zoneSkip))
      );
      const user = await renderAt(text, 'matrix_ring_home');
      await keyCount(0);
      const box = screen.getByLabelText(/Skip keys in this column/);
      expect(box).toBeChecked();

      // Act
      await user.click(box);

      // Assert: the ring column is back, except its own skipped top key
      await keyCount(2);
      expect(currentText()).toContain(
        '            stagger: 6\n            skip: false\n'
      );
      expect(currentText()).toContain(keySkip);
      expect(
        screen.getByLabelText(/Skip keys in this column/)
      ).not.toBeChecked();
    });

    it('removes a column skip that nothing broader sets', async () => {
      // Arrange
      const text = withKeySkipAfterColumnSkip(withColumnSkip(commented));
      const user = await renderAt(text, 'matrix_ring_top');
      await keyCount(12);
      const box = screen.getByLabelText(/Skip keys in this column/);
      expect(box).toBeChecked();

      // Act
      await user.click(box);

      // Assert: the starter's board hull leaves out the skipped key
      await keyCount(14);
      expect(currentText()).toBe(
        withKeySkip(commented).replace('        - matrix_ring_top\n', '')
      );
    });
  });
});
