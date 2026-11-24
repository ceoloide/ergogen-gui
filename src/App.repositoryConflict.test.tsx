import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { fetchConfigFromUrl } from './utils/github';

vi.mock('react-router-dom', async (importOriginal) => importOriginal());

vi.mock('./Ergogen', () => ({ default: () => null }));
vi.mock('./pages/Welcome', () => ({ default: () => null }));

vi.mock('./utils/github', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./utils/github')>()),
  fetchConfigFromUrl: vi.fn(),
}));

const savedFootprint = ['footprint', 'shared/switch', 'saved content'];
const repositoryFootprint = [
  'footprint',
  'shared/switch',
  'repository content',
];

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={['/?github=owner/repo']}>
      <App />
    </MemoryRouter>
  );

const savedInjections = () =>
  JSON.parse(localStorage.getItem('ergogen:injection') ?? 'null');

describe('App loading a repository whose footprint conflicts with a saved one', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ergogen:injection', JSON.stringify([savedFootprint]));
    window.history.replaceState({}, '', '/?github=owner/repo');
    vi.mocked(fetchConfigFromUrl).mockResolvedValue({
      config: 'points: {}',
      footprints: [{ name: 'shared/switch', content: 'repository content' }],
      outlines: [],
      templates: [],
      configPath: 'config.yaml',
    });
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('asks how to resolve the conflict and applies the choice', async () => {
    renderApp();

    expect(await screen.findByText('Footprint Conflict')).toBeInTheDocument();
    expect(screen.getByText('shared/switch')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Overwrite existing footprint' })
    );

    await waitFor(() => {
      expect(screen.queryByText('Footprint Conflict')).not.toBeInTheDocument();
    });
    expect(savedInjections()).toEqual([repositoryFootprint]);
  });

  it('closes on cancel, keeps the saved footprint, and reports the cancellation', async () => {
    renderApp();

    await screen.findByText('Footprint Conflict');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel loading' }));

    await waitFor(() => {
      expect(screen.queryByText('Footprint Conflict')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Loading cancelled by user')).toBeInTheDocument();
    expect(savedInjections()).toEqual([savedFootprint]);
  });
});
