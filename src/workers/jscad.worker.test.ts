/**
 * @jest-environment jsdom
 */

import { JscadWorkerRequest, JscadWorkerResponse } from './jscad.worker.types';

// Mock the importScripts function
const mockImportScripts = jest.fn();
(global as { importScripts?: typeof mockImportScripts }).importScripts =
  mockImportScripts;

// Mock the myjscad library
const mockSetup = jest.fn();
const mockCompile = jest.fn();
const mockGenerateOutput = jest.fn();

(global as { myjscad?: unknown }).myjscad = {
  setup: mockSetup,
  compile: mockCompile,
  generateOutput: mockGenerateOutput,
};

describe('JSCAD Worker', () => {
  let mockPostMessage: jest.Mock;
  let mockOnMessage: (event: MessageEvent<JscadWorkerRequest>) => void;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockImportScripts.mockClear();
    mockSetup.mockClear();
    mockCompile.mockClear();
    mockGenerateOutput.mockClear();

    // Mock self.postMessage
    mockPostMessage = jest.fn();

    // Create a proper mock for the worker global scope
    const mockSelf = {
      postMessage: mockPostMessage,
      onmessage: null,
      onerror: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    // Override global.self
    Object.defineProperty(global, 'self', {
      value: mockSelf,
      writable: true,
      configurable: true,
    });

    // Import the worker module
    // This will trigger the importScripts call and setup
    jest.isolateModules(() => {
      require('./jscad.worker');
    });

    // Capture the onmessage handler
    mockOnMessage = (
      global.self as {
        onmessage: (event: MessageEvent<JscadWorkerRequest>) => void;
      }
    ).onmessage;
  });

  describe('Initialization', () => {
    it('should load the OpenJSCAD library via importScripts', () => {
      // Arrange & Act
      // The worker module is already imported in beforeEach

      // Assert
      expect(mockImportScripts).toHaveBeenCalledWith(
        '/dependencies/openjscad.js'
      );
    });
  });

  describe('Message Handling', () => {
    it('should handle convert message and return success', async () => {
      // Arrange
      const mockStl = 'solid test\nendsolid test';
      mockCompile.mockResolvedValue('compiled');
      mockGenerateOutput.mockReturnValue({
        asBuffer: () => ({
          toString: () => mockStl,
        }),
      });

      const request: JscadWorkerRequest = {
        type: 'convert',
        jscadScript: 'function main() { return cube(); }',
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      };

      // Act
      await mockOnMessage({
        data: request,
      } as MessageEvent<JscadWorkerRequest>);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(mockSetup).toHaveBeenCalled();
      expect(mockCompile).toHaveBeenCalledWith(request.jscadScript);
      expect(mockGenerateOutput).toHaveBeenCalledWith('stla', null);
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'success',
        stl: mockStl,
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      } satisfies JscadWorkerResponse);
    });

    it('should handle convert message with empty script', async () => {
      // Arrange
      const request: JscadWorkerRequest = {
        type: 'convert',
        jscadScript: '',
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      };

      // Act
      await mockOnMessage({
        data: request,
      } as MessageEvent<JscadWorkerRequest>);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'success',
        stl: null,
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      } satisfies JscadWorkerResponse);
    });

    it('should handle conversion errors gracefully', async () => {
      // Arrange
      mockCompile.mockRejectedValue(new Error('Compilation failed'));

      const request: JscadWorkerRequest = {
        type: 'convert',
        jscadScript: 'function main() { return invalid(); }',
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      };

      // Act
      await mockOnMessage({
        data: request,
      } as MessageEvent<JscadWorkerRequest>);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      // The conversion function catches errors and returns null,
      // so the worker returns a success message with stl: null
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'success',
        stl: null,
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      } satisfies JscadWorkerResponse);
    });

    it('should handle unknown message types', async () => {
      // Arrange
      const request = {
        type: 'unknown',
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      } as unknown as JscadWorkerRequest;

      // Act
      await mockOnMessage({
        data: request,
      } as MessageEvent<JscadWorkerRequest>);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Assert
      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          error: expect.stringContaining('Unknown message type'),
        })
      );
    });

    it('should return null when generated STL is empty', async () => {
      // Arrange
      mockCompile.mockResolvedValue('compiled');
      mockGenerateOutput.mockReturnValue({
        asBuffer: () => ({
          toString: () => '',
        }),
      });

      const request: JscadWorkerRequest = {
        type: 'convert',
        jscadScript: 'function main() { return cube(); }',
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      };

      // Act
      await mockOnMessage({
        data: request,
      } as MessageEvent<JscadWorkerRequest>);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'success',
        stl: null,
        caseName: 'test-case',
        requestId: 'test-request-123',
        configVersion: 1,
      } satisfies JscadWorkerResponse);
    });
  });
});
