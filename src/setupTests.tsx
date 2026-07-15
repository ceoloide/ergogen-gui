/**
 * @jest-environment jsdom
 */

/* eslint-disable react/prop-types */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global alias for compatibility with Jest-centric test files
globalThis.jest = vi as any;

window.URL.createObjectURL = vi.fn();

// Polyfill for TextEncoder and TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Global mock for react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick, ...props }) => {
    return (
      <a href={to} onClick={onClick} {...props}>
        {children}
      </a>
    );
  },
  useNavigate: () => vi.fn(),
  Navigate: () => null,
  Routes: ({ children }) => children,
  Route: () => null,
}));

// Global mock for workers to avoid import.meta syntax issues in Jest
vi.mock('./workers/workerFactory', () => ({
  createErgogenWorker: () => null,
  createJscadWorker: () => null,
}));
