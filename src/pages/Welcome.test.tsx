import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Welcome from './Welcome';

const mockNavigate = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    __esModule: true,
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

const mockLoadLocalConfigFile = jest.fn();

const mockUseConfigContext = jest.fn(() => defaultContext);

jest.mock('../utils/localFileLoader', () => ({
  loadLocalConfigFile: (...args: unknown[]) => mockLoadLocalConfigFile(...args),
}));

const defaultContext: any = {
  configInput: '',
  setConfigInput: jest.fn(),
  injectionInput: [] as string[][],
  setInjectionInput: jest.fn(),
  generateNow: jest.fn().mockResolvedValue(undefined),
  setError: jest.fn(),
  clearError: jest.fn(),
  setIsGenerating: jest.fn(),
};

jest.mock('../context/ConfigContext', () => ({
  useConfigContext: (...args: unknown[]) => mockUseConfigContext(...args),
}));

describe('Welcome local file loading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseConfigContext.mockReturnValue(defaultContext);
    defaultContext.injectionInput = [];
  });

  it('loads a local file and triggers generation', async () => {
    mockLoadLocalConfigFile.mockResolvedValue({
      config: 'points: {}',
      footprints: [{ name: 'logo', content: 'module.exports = {}' }],
    });

    render(<Welcome />);

    const fileInput = screen.getByTestId(
      'local-file-input'
    ) as HTMLInputElement;
    const button = screen.getByTestId('local-file-load-button');

    fireEvent.click(button);

    const mockFile = new File(['points: {}'], 'config.yaml', {
      type: 'application/x-yaml',
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(defaultContext.clearError).toHaveBeenCalled();
      expect(mockLoadLocalConfigFile).toHaveBeenCalledWith(mockFile);
      expect(defaultContext.setConfigInput).toHaveBeenCalledWith('points: {}');
      expect(defaultContext.setInjectionInput).toHaveBeenCalled();
      expect(defaultContext.generateNow).toHaveBeenCalledWith(
        'points: {}',
        expect.any(Array),
        { pointsonly: false }
      );
    });
  });

  it('shows errors when local loading fails', async () => {
    mockLoadLocalConfigFile.mockRejectedValue(new Error('boom'));

    render(<Welcome />);

    const fileInput = screen.getByTestId(
      'local-file-input'
    ) as HTMLInputElement;
    const button = screen.getByTestId('local-file-load-button');

    fireEvent.click(button);

    const mockFile = new File(['points: {}'], 'config.yaml', {
      type: 'application/x-yaml',
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(defaultContext.setError).toHaveBeenCalledWith(
        'Failed to load local file: boom'
      );
      expect(defaultContext.setIsGenerating).toHaveBeenCalledWith(false);
    });
  });

  it('prompts conflict resolution when footprints collide', async () => {
    mockLoadLocalConfigFile.mockResolvedValue({
      config: 'points: {}',
      footprints: [{ name: 'logo', content: 'module.exports = {}' }],
    });

    defaultContext.injectionInput = [
      ['footprint', 'logo', 'module.exports = 1'],
    ];

    render(<Welcome />);

    const fileInput = screen.getByTestId(
      'local-file-input'
    ) as HTMLInputElement;

    const mockFile = new File(['points: {}'], 'config.yaml', {
      type: 'application/x-yaml',
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('conflict-dialog')).toBeInTheDocument();
    });
  });
});
