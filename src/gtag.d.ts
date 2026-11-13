declare global {
  interface Window {
    gtag?: {
      (
        command: 'event',
        eventName: string,
        eventParams?: Record<string, unknown>
      ): void;
      (command: 'set', parameters: Record<string, unknown>): void;
    };
  }
}

export {};
