import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Ergogen from './Ergogen';
import ConfigContextProvider from './context/ConfigContext';

const mockErgogenProcess = jest.fn();
const mockFetch = jest.fn();

global.fetch = mockFetch;

window.URL.createObjectURL = jest.fn();

jest.mock('react-stl-viewer', () => ({
  StlViewer: () => <div data-testid="stl-preview" />
}));

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
    const editorButton = screen.getByText('Back to Editor');
    fireEvent.click(editorButton);

    // Trigger generation
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);

    // Wait for the STL file to be displayed in the downloads list
    await waitFor(() => {
      const stlDownloadLink = screen.getByText('case.stl');
      expect(stlDownloadLink).toBeInTheDocument();
    });

    // Click the preview button
    const previewButton = screen.getByTestId('preview-button-case-stl');
    fireEvent.click(previewButton);

    // Check that the STL preview is rendered
    const stlPreview = screen.getByTestId('stl-preview');
    expect(stlPreview).toBeInTheDocument();
  });
});