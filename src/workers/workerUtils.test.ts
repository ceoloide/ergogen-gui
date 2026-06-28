import { isWorkerSupported, handleWorkerError } from './workerUtils';

describe('workerUtils', () => {
  const originalWorker = window.Worker;
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    window.Worker = originalWorker;
    console.error = originalConsoleError;
  });

  describe('isWorkerSupported', () => {
    it('should return true when Worker is in window', () => {
      // @ts-ignore
      window.Worker = jest.fn();
      expect(isWorkerSupported()).toBe(true);
    });

    it('should return false when Worker is not in window', () => {
      // @ts-ignore
      delete window.Worker;
      expect(isWorkerSupported()).toBe(false);
    });
  });

  describe('handleWorkerError', () => {
    it('should log the error and return null', () => {
      const error = new Error('Test error');
      const message = 'Error message:';
      const result = handleWorkerError(error, message);

      expect(console.error).toHaveBeenCalledWith(message, error);
      expect(result).toBeNull();
    });
  });
});
