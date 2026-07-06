/**
 * @jest-environment jsdom
 */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

window.URL.createObjectURL = jest.fn();

// Polyfill for TextEncoder and TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Global mock for react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick, ...props }) => (
    <a href={to} onClick={onClick} {...props}>{children}</a>
  ),
  useNavigate: () => jest.fn(),
  Navigate: () => null,
  Routes: ({ children }) => children,
  Route: () => null,
}));
