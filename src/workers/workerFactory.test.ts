vi.unmock('./workerFactory');
import { createErgogenWorker, createJscadWorker } from './workerFactory';

describe('workerFactory', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('createErgogenWorker', () => {
    it('should return null when window is undefined', () => {
      // Arrange
      const originalWindow = (globalThis as any).window;
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      try {
        // Act
        const result = createErgogenWorker();
        // Assert
        expect(result).toBeNull();
      } finally {
        Object.defineProperty(globalThis, 'window', {
          value: originalWindow,
          writable: true,
          configurable: true,
        });
      }
    });

    it('should return null when window.Worker is not defined', () => {
      // Act
      const result = createErgogenWorker();

      // Assert
      expect(result).toBeNull();
    });

    it('should create and return a worker when window.Worker is defined', () => {
      // Arrange
      const mockWorkerInstance = {};
      const mockWorkerConstructor = vi
        .fn()
        .mockImplementation(() => mockWorkerInstance);

      (globalThis as any).window.Worker = mockWorkerConstructor;
      (globalThis as any).Worker = mockWorkerConstructor;

      try {
        // Act
        const result = createErgogenWorker();

        // Assert
        expect(result).toBe(mockWorkerInstance);
        expect(mockWorkerConstructor).toHaveBeenCalledTimes(1);
        expect(mockWorkerConstructor.mock.calls[0][1]).toEqual({
          type: 'module',
        });

        const instantiatedUrl = mockWorkerConstructor.mock.calls[0][0];
        expect(instantiatedUrl).toBeInstanceOf(URL);
        expect(instantiatedUrl.pathname).toContain('ergogen.worker.ts');
      } finally {
        delete (globalThis as any).window.Worker;
        delete (globalThis as any).Worker;
      }
    });

    it('should handle constructor errors and log them to console.error', () => {
      // Arrange
      const mockError = new Error('Failed to instantiate Worker');
      const mockWorkerConstructor = vi.fn().mockImplementation(() => {
        throw mockError;
      });

      (globalThis as any).window.Worker = mockWorkerConstructor;
      (globalThis as any).Worker = mockWorkerConstructor;

      try {
        // Act
        const result = createErgogenWorker();

        // Assert
        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to create worker:',
          mockError
        );
      } finally {
        delete (globalThis as any).window.Worker;
        delete (globalThis as any).Worker;
      }
    });
  });

  describe('createJscadWorker', () => {
    it('should return null when window is undefined', () => {
      // Arrange
      const originalWindow = (globalThis as any).window;
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      try {
        // Act
        const result = createJscadWorker();
        // Assert
        expect(result).toBeNull();
      } finally {
        Object.defineProperty(globalThis, 'window', {
          value: originalWindow,
          writable: true,
          configurable: true,
        });
      }
    });

    it('should return null when window.Worker is not defined', () => {
      // Act
      const result = createJscadWorker();

      // Assert
      expect(result).toBeNull();
    });

    it('should create and return a worker when window.Worker is defined', () => {
      // Arrange
      const mockWorkerInstance = {};
      const mockWorkerConstructor = vi
        .fn()
        .mockImplementation(() => mockWorkerInstance);

      (globalThis as any).window.Worker = mockWorkerConstructor;
      (globalThis as any).Worker = mockWorkerConstructor;

      try {
        // Act
        const result = createJscadWorker();

        // Assert
        expect(result).toBe(mockWorkerInstance);
        expect(mockWorkerConstructor).toHaveBeenCalledTimes(1);
        expect(mockWorkerConstructor.mock.calls[0][1]).toEqual({
          type: 'module',
        });

        const instantiatedUrl = mockWorkerConstructor.mock.calls[0][0];
        expect(instantiatedUrl).toBeInstanceOf(URL);
        expect(instantiatedUrl.pathname).toContain('jscad.worker.ts');
      } finally {
        delete (globalThis as any).window.Worker;
        delete (globalThis as any).Worker;
      }
    });

    it('should handle constructor errors and log them to console.error', () => {
      // Arrange
      const mockError = new Error('Failed to instantiate JSCAD Worker');
      const mockWorkerConstructor = vi.fn().mockImplementation(() => {
        throw mockError;
      });

      (globalThis as any).window.Worker = mockWorkerConstructor;
      (globalThis as any).Worker = mockWorkerConstructor;

      try {
        // Act
        const result = createJscadWorker();

        // Assert
        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to create JSCAD worker:',
          mockError
        );
      } finally {
        delete (globalThis as any).window.Worker;
        delete (globalThis as any).Worker;
      }
    });
  });
});
