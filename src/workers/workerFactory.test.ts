const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, 'workerFactory.ts');
const tmpPath = path.resolve(__dirname, 'workerFactory.tmp.ts');

const content = fs
  .readFileSync(srcPath, 'utf8')
  .replace(/import\.meta\.url/g, '"http://localhost"');

fs.writeFileSync(tmpPath, content);

// Use dynamic require to prevent static analysis by Knip
const { createErgogenWorker, createJscadWorker } = require(
  './' + 'workerFactory.tmp'
);

describe('workerFactory', () => {
  let originalWindow: any;
  let originalGlobalWorker: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    originalWindow = (global as any).window;
    originalGlobalWorker = (global as any).Worker;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (global as any).window = originalWindow;
    (global as any).Worker = originalGlobalWorker;
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  });

  describe('createErgogenWorker', () => {
    it('should return null when window is undefined', () => {
      // Arrange
      delete (global as any).window;

      // Act
      const result = createErgogenWorker();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when window.Worker is not defined', () => {
      // Arrange
      (global as any).window = {};

      // Act
      const result = createErgogenWorker();

      // Assert
      expect(result).toBeNull();
    });

    it('should create and return a worker when window.Worker is defined', () => {
      // Arrange
      const mockWorkerInstance = {};
      const mockWorkerConstructor = jest
        .fn()
        .mockImplementation(() => mockWorkerInstance);
      (global as any).window = {
        Worker: mockWorkerConstructor,
      };
      (global as any).Worker = mockWorkerConstructor;

      // Act
      const result = createErgogenWorker();

      // Assert
      expect(result).toBe(mockWorkerInstance);
      expect(mockWorkerConstructor).toHaveBeenCalledTimes(1);

      const instantiatedUrl = mockWorkerConstructor.mock.calls[0][0];
      expect(instantiatedUrl).toBeInstanceOf(URL);
      expect(instantiatedUrl.pathname).toContain('ergogen.worker.ts');
    });

    it('should handle constructor errors and log them to console.error', () => {
      // Arrange
      const mockError = new Error('Failed to instantiate Worker');
      const mockWorkerConstructor = jest.fn().mockImplementation(() => {
        throw mockError;
      });
      (global as any).window = {
        Worker: mockWorkerConstructor,
      };
      (global as any).Worker = mockWorkerConstructor;

      // Act
      const result = createErgogenWorker();

      // Assert
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create worker:',
        mockError
      );
    });
  });

  describe('createJscadWorker', () => {
    it('should return null when window is undefined', () => {
      // Arrange
      delete (global as any).window;

      // Act
      const result = createJscadWorker();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when window.Worker is not defined', () => {
      // Arrange
      (global as any).window = {};

      // Act
      const result = createJscadWorker();

      // Assert
      expect(result).toBeNull();
    });

    it('should create and return a worker when window.Worker is defined', () => {
      // Arrange
      const mockWorkerInstance = {};
      const mockWorkerConstructor = jest
        .fn()
        .mockImplementation(() => mockWorkerInstance);
      (global as any).window = {
        Worker: mockWorkerConstructor,
      };
      (global as any).Worker = mockWorkerConstructor;

      // Act
      const result = createJscadWorker();

      // Assert
      expect(result).toBe(mockWorkerInstance);
      expect(mockWorkerConstructor).toHaveBeenCalledTimes(1);

      const instantiatedUrl = mockWorkerConstructor.mock.calls[0][0];
      expect(instantiatedUrl).toBeInstanceOf(URL);
      expect(instantiatedUrl.pathname).toContain('jscad.worker.ts');
    });

    it('should handle constructor errors and log them to console.error', () => {
      // Arrange
      const mockError = new Error('Failed to instantiate JSCAD Worker');
      const mockWorkerConstructor = jest.fn().mockImplementation(() => {
        throw mockError;
      });
      (global as any).window = {
        Worker: mockWorkerConstructor,
      };
      (global as any).Worker = mockWorkerConstructor;

      // Act
      const result = createJscadWorker();

      // Assert
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create JSCAD worker:',
        mockError
      );
    });
  });
});
