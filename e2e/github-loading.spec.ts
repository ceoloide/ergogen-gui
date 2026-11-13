import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';
import { mockGitHubNetworkRequests } from './utils/githubMocks';

test.describe('GitHub Loading', () => {
  test.beforeEach(async ({ page }) => {
    await mockGitHubNetworkRequests(page);
  });
  test('should load config and footprints from ceoloide/mr_useful', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());

    // Listen for console logs to verify our instrumentation
    const logs: string[] = [];
    const rateLimitLogs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.startsWith('[GitHub]')) {
        logs.push(text);
      }
      if (text.startsWith('[GitHub Rate Limit]')) {
        rateLimitLogs.push(text);
        console.log(text); // Also output rate limit info
      }
    });

    // Navigate to the welcome page
    await page.goto('/new');
    await shoot('before-github-input');

    // Find the GitHub input and load button
    const githubInput = page.getByTestId('repo-input');
    const loadButton = page.getByTestId('repo-load-button');

    // Enter the repository URL
    await githubInput.fill('ceoloide/mr_useful');
    await shoot('after-github-input-filled');

    // Click the load button
    await loadButton.click();
    await shoot('after-load-button-clicked');

    // Verify loading bar appears during GitHub loading
    const loadingBar = page.getByTestId('loading-bar');
    await expect(loadingBar).toBeVisible({ timeout: 20000 });
    await shoot('loading-bar-visible');

    // Wait for the config to be loaded (should navigate to home)
    await expect(page).toHaveURL(/.*\/$/, { timeout: 30000 });
    await shoot('after-navigation-to-home');

    // Verify config editor is visible
    await expect(page.getByTestId('config-editor')).toBeVisible({
      timeout: 10000,
    });
    await shoot('config-editor-visible');

    // Verify that console logs show GitHub loading activity
    await expect
      .poll(() => logs.some((log) => log.includes('Loaded footprint')))
      .toBe(true);

    // Check that we have GitHub logging
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some((log) => log.includes('Starting fetch'))).toBe(true);

    // Check for submodule loading
    expect(
      logs.some(
        (log) => log.includes('.gitmodules') || log.includes('submodule')
      )
    ).toBe(true);

    // Check for footprint loading
    expect(logs.some((log) => log.includes('Loaded footprint'))).toBe(true);

    // Open settings to check footprints
    const settingsButton = page.getByRole('button', {
      name: 'Show settings panel',
    });
    await settingsButton.click();
    await shoot('settings-opened');

    // Wait for the injections/footprints section to be visible
    await expect(page.getByTestId('injections-container')).toBeVisible({
      timeout: 20000,
    });
    await shoot('injections-visible');

    // Verify that footprints were loaded
    // The mr_useful repo should have footprints from the submodule
    const footprintRows = page.locator(
      '[data-testid^="injections-container-"]'
    );
    const count = await footprintRows.count();

    console.log(`Found ${count} footprint(s)`);
    expect(count).toBeGreaterThan(0);
    await shoot('footprints-loaded');
  });

  test('should load config with URL parameter and footprints', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());

    const logs: string[] = [];
    const loaderErrors: string[] = [];
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.startsWith('[GitHub]')) {
        logs.push(text);
      }
      if (text.startsWith('[useConfigLoader] Failed')) {
        loaderErrors.push(text);
      }
    });

    // A fresh profile has no saved config, so / redirects to /new first.
    await page.goto('/?github=ceoloide/mr_useful');
    await shoot('loaded-with-url-param');

    // The loaded config opens in the editor and the parameter is consumed.
    const editor = page.getByTestId('config-editor');
    await expect(editor).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/$/);
    await expect(editor).toContainText('mr_useful');
    await expect(editor).toContainText('ceoloide/logo_mr_useful');
    await shoot('config-editor-visible-url-param');

    // Ergogen generated outputs from the loaded config.
    await expect(page.getByTestId('downloads-container-demo-dxf')).toBeVisible({
      timeout: 20000,
    });
    await shoot('outputs-generated-url-param');

    expect(
      logs.some((log) => log.includes('Starting fetch')),
      logs.join('\n')
    ).toBe(true);
    expect(logs).toContain('[GitHub] Loaded footprint: logo_mr_useful');

    // The submodule footprints are stored with their fetched content.
    const storedInjections = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('ergogen:injection') ?? '[]')
    );
    const fixtureFootprint =
      'module.exports = { params: { designator: "LOGO" }, body: "" };';
    expect(storedInjections).toEqual(
      expect.arrayContaining([
        ['footprint', 'ceoloide/logo_mr_useful', fixtureFootprint],
        ['footprint', 'ceoloide/logo_mr_useful_2', fixtureFootprint],
      ])
    );

    // The footprints are listed in the settings panel.
    await page.getByRole('button', { name: 'Show settings panel' }).click();
    await expect(page.getByTestId('injections-container')).toBeVisible({
      timeout: 20000,
    });
    await expect(
      page.getByTestId('injections-container-ceoloide/logo_mr_useful')
    ).toBeVisible();
    await expect(
      page.getByTestId('injections-container-ceoloide/logo_mr_useful_2')
    ).toBeVisible();
    await shoot('footprints-loaded-url-param');

    await expect(page.getByTestId('error-banner')).toHaveCount(0);
    expect(loaderErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test('should accumulate footprints from sequential loads and reset conflict dialog', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.startsWith('[GitHub Rate Limit]')) {
        console.log(text);
      }
    });

    // Navigate to the welcome page
    await page.goto('/new');

    // Find the GitHub input and load button
    const githubInput = page.getByTestId('repo-input');
    const loadButton = page.getByTestId('repo-load-button');

    // Load first repository
    await githubInput.fill(
      'https://github.com/unspecworks/gamma-omega/blob/main/original/ergogen/config.yaml'
    );
    await loadButton.click();
    await shoot('first-repo-loading');

    // Wait for the config to be loaded
    await expect(page).toHaveURL(/.*\/$/, { timeout: 30000 });
    await shoot('first-repo-loaded');

    // Wait for config editor to be visible
    await expect(page.getByTestId('config-editor')).toBeVisible({
      timeout: 10000,
    });

    // Open settings and verify first footprint
    let settingsButton = page.getByRole('button', {
      name: 'Show settings panel',
    });
    await settingsButton.click();
    await shoot('settings-opened-first');

    await expect(page.getByTestId('injections-container')).toBeVisible({
      timeout: 20000,
    });

    // Check for unspecworks/pico_oneside footprint
    const unspecworksFootprint = page.getByTestId(
      'injections-container-unspecworks/pico_oneside'
    );
    await expect(unspecworksFootprint).toBeVisible();
    await shoot('unspecworks-footprint-present');

    // Navigate back to welcome page
    const newConfigButton = page.getByTestId('new-config-button');
    await newConfigButton.click();
    await expect(page).toHaveURL(/.*\/new/, { timeout: 20000 });
    await shoot('back-to-welcome');

    // Load second repository
    await githubInput.fill('ceoloide/mr_useful');
    await loadButton.click();
    await shoot('second-repo-loading');

    // Wait for logs
    await expect(page.getByTestId('conflict-dialog-box')).toBeVisible({
      timeout: 20000,
    });
    await shoot('second-repo-loaded-injections');

    // Resolve conflict dialog if it appears
    const conflictDialog = page.getByTestId('conflict-dialog-box');
    await expect(conflictDialog).toBeVisible();
    const conflictSkipButton = page.getByTestId('conflict-dialog-skip');
    await conflictSkipButton.click();
    const applyToAllCheckbox = page.getByTestId('conflict-dialog-apply-to-all');
    await applyToAllCheckbox.click({ force: true });
    const conflictOverwriteButton = page.getByTestId(
      'conflict-dialog-overwrite'
    );
    await conflictOverwriteButton.click();

    // Wait for the config to be loaded

    await expect(page).toHaveURL(/.*\/$/, { timeout: 10000 });
    await shoot('second-repo-loaded');

    // Open settings and verify both footprints are present
    settingsButton = page.getByRole('button', { name: 'Show settings panel' });
    await settingsButton.click();
    await shoot('settings-opened-second');

    await expect(page.getByTestId('injections-container')).toBeVisible({
      timeout: 20000,
    });

    // Both footprints should be present
    const logoFootprint = page.getByTestId(
      'injections-container-ceoloide/logo_mr_useful'
    );
    await expect(logoFootprint).toBeVisible();
    await expect(unspecworksFootprint).toBeVisible();
    await shoot('both-footprints-present');

    console.log('Sequential loading test completed successfully');
  });
});
