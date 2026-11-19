/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import type { ComponentProps } from 'react';
import type { LinkProps } from 'react-router-dom';

if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn();
}

// Polyfill for TextEncoder and TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Global mock for react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick, ...props }: LinkProps) => {
    return (
      <a
        href={typeof to === 'string' ? to : to.pathname}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  },
  useNavigate: () => vi.fn(),
  Navigate: () => null,
  Routes: ({ children }: ComponentProps<'div'>) => children,
  Route: () => null,
}));

// GUI tests see the canonical engine version (the one package.json pins,
// also inside a ^ or ~ range), whichever engine is installed, so a deployment
// that builds with another engine runs them unchanged. When the pin names no
// version (a branch or a commit), they see the installed version. A test that needs another version sets it with
// vi.mocked(installedEngineVersion).mockReturnValue(...). Tests that run the
// real engine (tests/engine-contract/ and tests/engine-smoke.test.ts) see the
// real installed version.
const testPath = expect.getState().testPath ?? '';
const runsRealEngine =
  /[\\/]tests[\\/]engine-contract[\\/]/.test(testPath) ||
  /[\\/]tests[\\/]engine-smoke\.test\.ts$/.test(testPath);
if (!runsRealEngine) {
  vi.doMock('./utils/engineRequirements', async (importOriginal) => {
    const actual =
      await importOriginal<typeof import('./utils/engineRequirements')>();
    const { default: packageJson } = await import('../package.json');
    const { getSemverFromErgogenVersion } = await import('./utils/version');
    const canonical =
      getSemverFromErgogenVersion(
        packageJson.dependencies.ergogen.replace(/^[\^~]/, '')
      ) ?? actual.installedEngineVersion();
    return { ...actual, installedEngineVersion: vi.fn(() => canonical) };
  });
}

// Global mock for workers to avoid import.meta syntax issues in Jest
vi.mock('./workers/workerFactory', () => ({
  createErgogenWorker: () => null,
  createJscadWorker: () => null,
}));
