import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LayoutEditor from './LayoutEditor';
import * as ConfigContext from '../context/ConfigContext';

// Mock react-router-dom to avoid resolution issues with Jest/CRA/v7
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

// Mock the context hook
jest.mock('../context/ConfigContext', () => ({
  useConfigContext: jest.fn(),
}));

const mockSetConfigInput = jest.fn();

describe('LayoutEditor', () => {
  beforeEach(() => {
    (ConfigContext.useConfigContext as jest.Mock).mockReturnValue({
      configInput: 'points:\n  rotate: 10\nmeta:\n  name: "Test"',
      setConfigInput: mockSetConfigInput,
      results: {
        points: {
          key1: { x: 19, y: 19, r: 0 }
        }
      }
    });
  });

  test('renders sidebar tabs', () => {
    render(
        <LayoutEditor />
    );
    expect(screen.getByText('Key Properties')).toBeInTheDocument();
    expect(screen.getByText('Zones')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('renders grid settings in Settings tab', () => {
    render(
        <LayoutEditor />
    );
    // Default tab is Settings
    expect(screen.getByText('Show Grid')).toBeInTheDocument();
    expect(screen.getByText('Snap to Grid')).toBeInTheDocument();
  });

  test('displays points from results', () => {
    render(
        <LayoutEditor />
    );
    const keyElement = screen.getByTitle('key1');
    expect(keyElement).toBeInTheDocument();
  });

  test('updates config when inputs change', async () => {
    render(
        <LayoutEditor />
    );

    // Find rotation input
    const inputs = screen.getAllByRole('spinbutton'); // number inputs
    // Rotation should be 10 based on mock config.
    const rotationInput = inputs.find(i => (i as HTMLInputElement).value === '10');
    expect(rotationInput).toBeDefined();

    if (rotationInput) {
        fireEvent.change(rotationInput, { target: { value: '20' } });
        // Should call setConfigInput with new yaml
        await waitFor(() => {
            expect(mockSetConfigInput).toHaveBeenCalled();
            const callArg = mockSetConfigInput.mock.calls[0][0];
            expect(callArg).toContain('rotate: 20');
        });
    }
  });
});
