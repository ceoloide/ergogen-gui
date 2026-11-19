import { render, screen } from '@testing-library/react';
import { installedEngineVersion } from '../utils/engineRequirements';
import Welcome from './Welcome';

vi.mock('../context/ConfigContext', () => ({
  useConfigContext: () => ({
    configInput: '',
    injectionInput: [],
    pruneDeletedConfigs: vi.fn(),
    createNewConfig: vi.fn(),
    generateNow: vi.fn(),
    setConfigInput: vi.fn(),
    setInjectionInput: vi.fn(),
    setError: vi.fn(),
  }),
}));

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  classifyFileType: vi.fn(),
}));

// The example cards are labelled cards (aria-label), not buttons, so they are
// found by their accessible name.
describe('Welcome examples', () => {
  afterEach(() => {
    vi.mocked(installedEngineVersion).mockRestore();
  });

  it('offers every example on the canonical engine', () => {
    // Act
    render(<Welcome />);

    // Assert
    expect(screen.getByLabelText('Load Willy 50 example')).toBeInTheDocument();
    expect(screen.getByLabelText('Load Briefs 56 example')).toBeInTheDocument();
  });

  it('hides the examples an older engine cannot generate', () => {
    // Arrange
    vi.mocked(installedEngineVersion).mockReturnValue('4.2.1');

    // Act
    render(<Welcome />);

    // Assert
    expect(screen.getByLabelText('Load Absolem example')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Load Willy 50 example')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Load Briefs 56 example')
    ).not.toBeInTheDocument();
  });
});
