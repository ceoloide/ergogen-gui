/**
 * Global window type definitions for Ergogen Web UI
 */

declare global {
  interface Window {
    ergogen?: {
      process: (
        config: unknown,
        debug: boolean,
        logger: (m: string) => void
      ) => unknown;
      inject: (type: string, name: string, value: unknown) => void;
    };
    kle?: {
      Serial?: {
        deserialize: (config: string) => unknown;
        serialize: (keyboard: unknown) => string;
      };
    };
  }
}

export {};
