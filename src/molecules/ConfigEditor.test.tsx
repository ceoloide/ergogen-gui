import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ConfigEditor from './ConfigEditor';
import { ConfigContext, Config } from '../context/ConfigContext';

jest.mock('@monaco-editor/react', () => ({
  Editor: ({ value, onChange }: { value: string; onChange: (value: string | undefined) => void }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockSetConfig = jest.fn();
const mockSetConfigInput = jest.fn();

const renderWithContext = (configInput: string) => {
  return render(
    <ConfigContext.Provider value={{
      config: {} as Config,
      setConfig: mockSetConfig,
      showSettings: false,
      setShowSettings: jest.fn(),
      error: '',
      setError: jest.fn(),
      loading: false,
      setLoading: jest.fn(),
      autoSync: false,
      setAutoSync: jest.fn(),
      gistId: '',
      setGistId: jest.fn(),
      pendingChanges: false,
      setPendingChanges: jest.fn(),
      configInput: configInput,
      setConfigInput: mockSetConfigInput,
    }}>
      <ConfigEditor />
    </ConfigContext.Provider>
  );
};

describe('ConfigEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the editor with the initial value from context', () => {
    const initialValue = 'initial config';
    const { getByTestId } = renderWithContext(initialValue);
    expect(getByTestId('mock-editor')).toHaveValue(initialValue);
  });

  it('calls setConfigInput on change', () => {
    const { getByTestId } = renderWithContext('');
    const editor = getByTestId('mock-editor');
    const newValue = 'new config';
    fireEvent.change(editor, { target: { value: newValue } });
    expect(mockSetConfigInput).toHaveBeenCalledWith(newValue);
  });
});