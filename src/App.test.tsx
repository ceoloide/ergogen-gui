import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { getConfigFromHash } from './utils/share';
import guiPkg from '../package.json';

// Parse dynamic package versions for mock matching
const currentGuiVersion = guiPkg.version;
const [major, minor, patch] = currentGuiVersion.split('.').map(Number);
const newerGuiVersion = `${major}.${minor + 1}.${patch}`;
const olderGuiVersion = `${major}.${minor - 1 >= 0 ? minor - 1 : 0}.${patch}`;

// Mock react-router-dom components and hooks to avoid React Router compatibility issues in Jest
vi.mock('react-router-dom', () => ({
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: ({ element }: any) => element,
  Navigate: () => <div data-testid="mock-navigate" />,
  useLocation: () => ({ pathname: '/' }),
}));

// Mock Ergogen component
vi.mock('./Ergogen', () => {
  const MockErgogen = () => <div data-testid="mock-ergogen" />;
  MockErgogen.displayName = 'MockErgogen';
  return {
    __esModule: true,
    default: MockErgogen,
  };
});

// Mock Welcome component
vi.mock('./pages/Welcome', () => {
  const MockWelcome = () => <div data-testid="mock-welcome" />;
  MockWelcome.displayName = 'MockWelcome';
  return {
    __esModule: true,
    default: MockWelcome,
  };
});

// Mock Header component
vi.mock('./atoms/Header', () => {
  const MockHeader = () => <div data-testid="mock-header" />;
  MockHeader.displayName = 'MockHeader';
  return {
    __esModule: true,
    default: MockHeader,
  };
});

// Mock LoadingBar component
vi.mock('./atoms/LoadingBar', () => {
  const MockLoadingBar = () => <div data-testid="mock-loading-bar" />;
  MockLoadingBar.displayName = 'MockLoadingBar';
  return {
    __esModule: true,
    default: MockLoadingBar,
  };
});

// Mock Banners component
vi.mock('./organisms/Banners', () => {
  const MockBanners = () => <div data-testid="mock-banners" />;
  MockBanners.displayName = 'MockBanners';
  return {
    __esModule: true,
    default: MockBanners,
  };
});

// Mock SideNavigation component
vi.mock('./molecules/SideNavigation', () => {
  const MockSideNavigation = () => <div data-testid="mock-side-navigation" />;
  MockSideNavigation.displayName = 'MockSideNavigation';
  return {
    __esModule: true,
    default: MockSideNavigation,
  };
});

// Mock worker Factory
vi.mock('./workers/workerFactory', () => ({
  createErgogenWorker: () => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
    onmessage: null,
  }),
  createJscadWorker: () => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
    onmessage: null,
  }),
}));

// Mock getConfigFromHash
vi.mock('./utils/share', async () => {
  const originalModule =
    await vi.importActual<typeof import('./utils/share')>('./utils/share');
  return {
    ...originalModule,
    getConfigFromHash: vi.fn(),
  };
});

describe('App shared version compatibility checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('verifies version checking workflow during mount and subsequent hash changes', () => {
    // 1. Initial mount with compatible configuration
    (getConfigFromHash as jest.Mock).mockReturnValue({
      success: true,
      config: {
        config: 'points: {}',
        guiVersion: olderGuiVersion, // Matches or older
        ergogenVersion: 'github:ergogen/ergogen#v4.2.1', // Official
      },
    });

    render(<App />);

    // Verify dialog is NOT shown initially
    expect(
      screen.queryByTestId('share-compatibility-dialog')
    ).not.toBeInTheDocument();

    // 2. Simulate hash change to a warning configuration (newer GUI version)
    (getConfigFromHash as jest.Mock).mockReturnValue({
      success: true,
      config: {
        config: 'points: {}',
        guiVersion: newerGuiVersion, // Newer
        ergogenVersion: 'github:ergogen/ergogen#v4.2.1',
      },
    });

    act(() => {
      window.dispatchEvent(new Event('hashchange'));
    });

    // Verify warning dialog is displayed
    expect(
      screen.getByTestId('share-compatibility-dialog')
    ).toBeInTheDocument();
    expect(screen.getByText('GUI Version Mismatch')).toBeInTheDocument();

    // 3. Verify Cancel action (dialog disappears)
    fireEvent.click(screen.getByTestId('share-compatibility-dialog-cancel'));
    expect(
      screen.queryByTestId('share-compatibility-dialog')
    ).not.toBeInTheDocument();

    // 4. Simulate another hash change to a custom Ergogen version
    (getConfigFromHash as jest.Mock).mockReturnValue({
      success: true,
      config: {
        config: 'points: {}',
        guiVersion: currentGuiVersion,
        ergogenVersion: 'github:ceoloide/ergogen#v4.3.0', // Custom
      },
    });

    act(() => {
      window.dispatchEvent(new Event('hashchange'));
    });

    // Verify warning dialog is displayed
    expect(
      screen.getByTestId('share-compatibility-dialog')
    ).toBeInTheDocument();
    expect(screen.getByText('Custom Ergogen Version Used')).toBeInTheDocument();

    // 5. Verify Accept action (dialog disappears)
    fireEvent.click(screen.getByTestId('share-compatibility-dialog-accept'));
    expect(
      screen.queryByTestId('share-compatibility-dialog')
    ).not.toBeInTheDocument();
  });
});
