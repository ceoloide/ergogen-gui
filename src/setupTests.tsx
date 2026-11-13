/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import type { ComponentProps } from 'react';
import type { LinkProps } from 'react-router-dom';

window.URL.createObjectURL = vi.fn();

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

// Global mock for workers to avoid import.meta syntax issues in Jest
vi.mock('./workers/workerFactory', () => ({
  createErgogenWorker: () => null,
  createJscadWorker: () => null,
}));
