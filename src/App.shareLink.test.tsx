import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import guiPkg from '../package.json';
import { encodeConfig } from './utils/share';

// src/setupTests.tsx mocks the router, and the whole app needs real routes.
vi.unmock('react-router-dom');

const sharedConfig = 'points: {zones: {shared_zone: {}}}';
const footprint = (code: string) => ['footprint', 'shared/switch', code];

const [major, minor, patch] = guiPkg.version.split('.').map(Number);
const newerGuiVersion = `${major}.${minor + 1}.${patch}`;

// App reads the hash once per module instance, so each test imports a new one.
const openLink = async (hash: string) => {
  vi.resetModules();
  const { default: App } = await import('./App');
  window.history.replaceState({}, '', `/#${hash}`);
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
};

const welcomePage = () =>
  screen.queryByRole('heading', { name: 'Ergogen Web UI' });
const editor = () =>
  screen.queryByRole('button', { name: 'Download configuration' });

// Each test renders the whole app, which takes seconds on a busy machine.
describe('App opening a share link', { timeout: 20000 }, () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('opens the editor, not the welcome page, in a browser with no saved configuration', async () => {
    await openLink(encodeConfig(sharedConfig));

    expect(
      await screen.findByRole('button', { name: 'Download configuration' })
    ).toBeInTheDocument();
    expect(welcomePage()).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  it('asks about a newer version without the welcome page behind, and opens the editor on accept', async () => {
    await openLink(encodeConfig(sharedConfig, undefined, newerGuiVersion));

    expect(
      await screen.findByText('Version Compatibility Warning')
    ).toBeInTheDocument();
    expect(welcomePage()).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Accept and load configuration' })
    );

    expect(
      await screen.findByRole('button', { name: 'Download configuration' })
    ).toBeInTheDocument();
    expect(welcomePage()).not.toBeInTheDocument();
  });

  it('shows the welcome page when the user declines a link from a newer version', async () => {
    await openLink(encodeConfig(sharedConfig, undefined, newerGuiVersion));

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Cancel configuration loading',
      })
    );

    expect(
      await screen.findByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeInTheDocument();
    expect(editor()).not.toBeInTheDocument();
  });

  it('asks about a clashing footprint without the welcome page behind, and opens the editor once resolved', async () => {
    localStorage.setItem(
      'ergogen:injection',
      JSON.stringify([footprint('saved content')])
    );
    await openLink(encodeConfig(sharedConfig, [footprint('shared content')]));

    expect(await screen.findByText('Footprint Conflict')).toBeInTheDocument();
    expect(welcomePage()).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Overwrite existing footprint' })
    );

    expect(
      await screen.findByRole('button', { name: 'Download configuration' })
    ).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem('ergogen:injection') ?? 'null')
    ).toEqual([footprint('shared content')]);
  });

  it('shows the welcome page when the user cancels a clashing footprint', async () => {
    localStorage.setItem(
      'ergogen:injection',
      JSON.stringify([footprint('saved content')])
    );
    await openLink(encodeConfig(sharedConfig, [footprint('shared content')]));

    fireEvent.click(
      await screen.findByRole('button', { name: 'Cancel loading' })
    );

    expect(
      await screen.findByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading cancelled by user')).toBeInTheDocument();
    expect(editor()).not.toBeInTheDocument();
  });

  it('shows the error of a broken link on the welcome page', async () => {
    await openLink('not-a-share-link');

    expect(
      await screen.findByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The shared configuration link is invalid or corrupted/)
    ).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });
});
