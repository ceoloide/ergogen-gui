import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ConfigEditor from './ConfigEditor';
import { ConfigContext } from '../context/ConfigContext';

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
      configInput: configInput,
      setConfigInput: mockSetConfigInput,
      injectionInput: [],
      setInjectionInput: jest.fn(),
      processInput: Object.assign(jest.fn(), { cancel: jest.fn(), flush: jest.fn() }),
      error: null,
      setError: jest.fn(),
      deprecationWarning: null,
      results: null,
      resultsVersion: 0,
      setResultsVersion: jest.fn(),
      showSettings: false,
      setShowSettings: jest.fn(),
      showConfig: true,
      setShowConfig: jest.fn(),
      debug: false,
      setDebug: jest.fn(),
      autoGen: true,
      setAutoGen: jest.fn(),
      autoGen3D: true,
      setAutoGen3D: jest.fn(),
      kicanvasPreview: true,
      setKicanvasPreview: jest.fn(),
      jscadPreview: false,
      setJscadPreview: jest.fn(),
      experiment: null,
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