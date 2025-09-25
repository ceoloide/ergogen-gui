import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Ergogen from './Ergogen';
import ConfigContextProvider from './context/ConfigContext';

const mockErgogenProcess = jest.fn();
const mockFetch = jest.fn();

global.fetch = mockFetch;

window.URL.createObjectURL = jest.fn();


(window as any).ergogen = {
  process: mockErgogenProcess
};

const renderComponent = () => {
  return render(
    <ConfigContextProvider initialInput="">
      <Ergogen />
    </ConfigContextProvider>
  );
}

describe('Ergogen', () => {
  beforeEach(() => {
    mockErgogenProcess.mockResolvedValue({
      cases: {
        case: {
          jscad: 'jscad-code'
        }
      }
    });
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve('stl-content')
    });
  });

  it('should generate and display STL files when the option is enabled', async () => {
    renderComponent();

    // Open settings
    const settingsButton = screen.getByTestId('config-button');
    fireEvent.click(settingsButton);

    // Enable STL generation
    const stlCheckbox = screen.getByLabelText(/Generate STL files/);
    fireEvent.click(stlCheckbox);

    // Go back to the editor
    const editorButton = screen.getByTestId('back-to-editor-button');
    fireEvent.click(editorButton);

    // Trigger generation
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    // Wait for the STL file to be displayed in the downloads list
    await waitFor(() => {
      const stlDownloadLink = screen.getByText('case.stl');
      expect(stlDownloadLink).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('https://raw.githubusercontent.com/ceoloide/Ugo-ESP32/master/hardware/Ugo-ESP32%20(TinyPICO)/Enclosure/Top%20Enclosure%20(Symbols).stl');
  });
});