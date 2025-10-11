/* eslint-env worker */
/* global self */

import { JscadWorkerRequest, JscadWorkerResponse } from './jscad.worker.types';

console.log('<-> JSCAD worker module starting...');

/**
 * Error handler for uncaught errors in the worker.
 */
self.onerror = (error) => {
  console.error('>>> Uncaught error in JSCAD worker:', error);
  const errorMessage =
    error instanceof ErrorEvent ? error.message : String(error);
  self.postMessage({
    type: 'error',
    error: `JSCAD worker error: ${errorMessage}`,
    configVersion: -1, // Version is unknown
  });
  return true; // Prevent default error handling
};

// Create minimal mock of document object for openjscad.js
// The library expects DOM APIs; we provide minimal shims and a simple event system
const docListeners: Record<string, Array<(ev?: any) => void>> = {};
const makeStubElement = () => {
  const options: any = {
    length: 0,
    remove: () => {},
    add: () => {},
  };
  return {
    style: {},
    firstChild: { textContent: '' },
    className: '',
    text: '',
    value: 0,
    min: 0,
    max: 0,
    options,
    appendChild: () => {},
    setAttribute: () => {},
  } as any;
};
(self as any).document = {
  getElementById: (_id?: string) => makeStubElement(),
  createElement: (_tag?: string) => makeStubElement(),
  implementation: {},
  location: { href: '' },
  addEventListener: (type: string, listener: (ev?: any) => void) => {
    (docListeners[type] ||= []).push(listener);
  },
  dispatchEvent: (evt: any) => {
    const type = typeof evt === 'string' ? evt : evt?.type;
    (docListeners[type] || []).forEach((fn) => {
      try {
        fn(evt);
      } catch (_e) {
        /* noop */
      }
    });
  },
};

// Global interface for the myjscad library loaded from openjscad.js
interface MyJscad {
  setup: () => void;
  compile: (code: string) => Promise<string>;
  generateOutput: (
    format: string,
    geometry: unknown
  ) => {
    asBuffer: () => {
      toString: () => string;
    };
  };
}

declare global {
  interface Window {
    myjscad: ((opts: unknown) => MyJscad) | MyJscad;
  }
}

// Create window alias for self since openjscad.js expects window.myjscad
// In a web worker, window doesn't exist, so we alias it to self
(self as any).window = self;

let jscadInstance: MyJscad | null = null;
let initializationError: Error | null = null;

// Wrap initialization in a self-invoking async function to handle promises
const initializationPromise = (async () => {
  try {
    // @ts-expect-error - importScripts is available in web workers
    importScripts('/dependencies/openjscad.js');

    // The vendor bundle registers an init() on DOMContentLoaded which defines
    // window.myjscad.setup/compile/generateOutput. In a worker there's no DOMContentLoaded,
    // so we manually dispatch it now that the script is loaded.
    // Give the bundle a tick to finish registering listeners, then dispatch.
    await new Promise((r) => setTimeout(r, 0));
    (self as any).document.dispatchEvent?.('DOMContentLoaded');

    // Retry a few times in case the init runs asynchronously.
    const maxAttempts = 5;
    let attempt = 0;
    while (attempt < maxAttempts) {
      const candidate = (window as any).myjscad as Partial<MyJscad> | undefined;
      const hasApi =
        !!candidate &&
        typeof candidate.setup === 'function' &&
        typeof candidate.compile === 'function' &&
        typeof candidate.generateOutput === 'function';
      if (hasApi) {
        jscadInstance = candidate as MyJscad;
        break;
      }
      attempt += 1;
      // small delay between attempts
      await new Promise((r) => setTimeout(r, 10));
    }

    if (!jscadInstance) {
      const currentKeys = Object.keys((window as any).myjscad || {});
      console.error(
        'JSCAD init: myjscad not ready after attempts; keys =',
        currentKeys
      );
      throw new Error(
        'window.myjscad was not correctly populated by openjscad.js script.'
      );
    }
    console.log('<-> OpenJSCAD library loaded and initialized in worker');
  } catch (error) {
    // Capture initialization error and log it; onmessage will report back to caller
    initializationError =
      error instanceof Error ? error : new Error(String(error));
    console.error(
      '>>> Failed to load or initialize OpenJSCAD library:',
      initializationError
    );
  }
})();

/**
 * Main worker message handler.
 */
self.onmessage = async (event: MessageEvent<JscadWorkerRequest>) => {
  await initializationPromise;

  const { type, jscadScripts, configVersion } = event.data || {};

  if (initializationError) {
    const response: JscadWorkerResponse = {
      type: 'error',
      error: `JSCAD library initialization failed: ${initializationError}`,
      configVersion,
    };
    self.postMessage(response);
    return;
  }

  if (!jscadInstance) {
    throw new Error('JSCAD library is not loaded or initialized correctly.');
  }

  if (type !== 'jscad_to_stl') {
    const response: JscadWorkerResponse = {
      type: 'error',
      error: `Unknown message type: ${type}`,
      configVersion,
    };
    self.postMessage(response);
    return;
  }

  try {
    const results: { name: string; stl: string }[] = [];
    for (const { name, script } of jscadScripts) {
      if (!script || script.trim() === '') {
        console.warn(`JSCAD script for ${name} is empty, skipping.`);
        continue;
      }

      jscadInstance.setup();
      await jscadInstance.compile(script);
      const output = jscadInstance.generateOutput('stla', null);
      const stlContent = output.asBuffer().toString();

      if (!stlContent || stlContent.trim() === '') {
        throw new Error(`Generated STL for ${name} is empty.`);
      }

      results.push({ name, stl: stlContent });
    }

    const response: JscadWorkerResponse = {
      type: 'success',
      results,
      configVersion,
    };
    self.postMessage(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const response: JscadWorkerResponse = {
      type: 'error',
      error: `JSCAD to STL conversion failed: ${errorMessage}`,
      configVersion,
    };
    self.postMessage(response);
  }
};

export {};
