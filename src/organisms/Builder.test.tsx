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
        setTimeout(() => {
          let data;
          try {
            data = { id, type: 'success', layout: computeLayout(text) };
          } catch (error) {
            data = { id, type: 'error', error: (error as Error).message };
          }
          worker.onmessage?.({ data } as MessageEvent);
        }, 0);
      },
    };
    return worker;
  },
}));

const Harness = ({ initial }: { initial: string }) => {
  const [text, setText] = useState(initial);
  const realtime = useRef(initial);
  setTextFromOutside = (value) => {
    realtime.current = value;
    setText(value);
  };
  context = {
    configInput: text,
    activeConfigId: 'config-1',
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
  it('draws the engine layout and selects the first key', async () => {
    // Act
    await renderBuilder();

    // Assert
    expect(screen.getAllByRole('button', { name: /^matrix_/ })).toHaveLength(
      15
    );
    expect(
      screen.getByRole('heading', { name: 'matrix_pinky_bottom' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('builder-status')).toHaveTextContent('15 keys');
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
});
