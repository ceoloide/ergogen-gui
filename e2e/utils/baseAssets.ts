import type { Locator, Page } from '@playwright/test';
import { expect } from '../fixtures';

/** The app's base URL with a trailing slash, for root and subpath builds. */
export const appBase = (baseURL: string | undefined) =>
  `${baseURL!.replace(/\/$/, '')}/`;

/** The example previews and the header logo on the welcome page. */
export const welcomeImages = (page: Page) => ({
  previews: page.getByRole('img', { name: / preview$/ }),
  logo: page.getByTestId('logo-button').getByRole('img', {
    name: 'Ergogen logo',
  }),
});

/**
 * Waits until every image decoded from a URL below `prefix`. A missing file
 * can still return HTTP 200 (an SPA's HTML fallback), so only a non-zero
 * natural width proves that a real image arrived.
 */
export async function expectDecodedImages(images: Locator, prefix: string) {
  await expect(images.first()).toBeVisible();
  await expect
    .poll(() =>
      images.evaluateAll(
        (nodes, expected) =>
          (nodes as HTMLImageElement[])
            .filter(
              (image) =>
                !image.complete ||
                image.naturalWidth === 0 ||
                !image.currentSrc.startsWith(expected)
            )
            .map((image) => `${image.currentSrc} (${image.naturalWidth}px)`),
        prefix
      )
    )
    .toEqual([]);
}

/** Resolves once a service worker controls the page. */
export const waitForServiceWorkerControl = (page: Page) =>
  page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', resolve, {
          once: true,
        })
      );
    }
    return {
      scope: registration.scope,
      script: navigator.serviceWorker.controller!.scriptURL,
    };
  });
