import type { MockInstance } from 'vitest';
import { register } from './serviceWorkerRegistration';

type Listener = () => void;

const fakeWorker = (state: ServiceWorkerState) => {
  const listeners: Listener[] = [];
  return {
    state,
    addEventListener: (_type: string, listener: Listener) =>
      listeners.push(listener),
    becomeInstalled() {
      this.state = 'installed';
      listeners.forEach((listener) => listener());
    },
  };
};

const fakeRegistration = (
  workers: Partial<Record<'installing' | 'waiting', unknown>>
) => {
  const listeners: Listener[] = [];
  return {
    installing: null,
    waiting: null,
    ...workers,
    addEventListener: (_type: string, listener: Listener) =>
      listeners.push(listener),
    findUpdate(installing: unknown) {
      this.installing = installing as null;
      listeners.forEach((listener) => listener());
    },
  };
};

// Registers on the window load event, as a production page does, with a
// current controller (an earlier build) unless `controller` is null.
const registerOnLoad = async (
  registration: ReturnType<typeof fakeRegistration>,
  controller: object | null = {}
) => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response('', {
        headers: { 'content-type': 'application/javascript' },
      })
    )
  );
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {
      controller,
      ready: new Promise(() => {}),
      register: vi.fn().mockResolvedValue(registration),
    },
  });
  const onUpdate = vi.fn();
  register({ onUpdate });
  window.dispatchEvent(new Event('load'));
  await vi.waitFor(() =>
    expect(navigator.serviceWorker.register).toHaveBeenCalled()
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  // Only this test's page registers: no earlier test's load listener ran.
  expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(1);
  return onUpdate;
};

describe('service worker registration', () => {
  // register() listens for the window load event and never stops listening,
  // so each test removes the window listeners it added. The spy only records:
  // it calls the real method.
  let addEventListenerSpy: MockInstance<Window['addEventListener']>;
  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mock.calls.forEach(([type, listener, options]) =>
      window.removeEventListener(type, listener, options)
    );
    addEventListenerSpy.mockRestore();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    delete (navigator as { serviceWorker?: unknown }).serviceWorker;
  });

  it('reports an update found after registration', async () => {
    // Arrange
    const registration = fakeRegistration({});
    const onUpdate = await registerOnLoad(registration);
    const worker = fakeWorker('installing');

    // Act
    registration.findUpdate(worker);
    worker.becomeInstalled();

    // Assert
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(registration);
  });

  it('reports an update that was already waiting when the page loaded', async () => {
    // Arrange: the browser installed the next build during navigation
    const registration = fakeRegistration({ waiting: fakeWorker('installed') });

    // Act
    const onUpdate = await registerOnLoad(registration);

    // Assert
    expect(onUpdate).toHaveBeenCalledWith(registration);
  });

  it('reports an update that was still installing when the page loaded', async () => {
    // Arrange: updatefound fired before the page could listen for it
    const worker = fakeWorker('installing');
    const registration = fakeRegistration({ installing: worker });
    const onUpdate = await registerOnLoad(registration);

    // Act
    worker.becomeInstalled();

    // Assert
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('does not report a first install as an update', async () => {
    // Arrange
    const worker = fakeWorker('installing');
    const registration = fakeRegistration({ installing: worker });
    const onUpdate = await registerOnLoad(registration, null);

    // Act
    worker.becomeInstalled();

    // Assert
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
