import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';

/** The active configuration as saved in browser storage. */
const savedConfig = (page: Page) =>
  page.evaluate(() => {
    const stored = JSON.parse(
      localStorage.getItem('ergogen:multi-config') ?? '{}'
    ) as {
      activeConfigId?: string;
      configs?: { id: string; config: string }[];
    };
    return (
      stored.configs?.find((config) => config.id === stored.activeConfigId)
        ?.config ?? ''
    );
  });

const keyBox = async (page: Page, name: string) => {
  const box = await page.locator(`[data-key-name="${name}"]`).boundingBox();
  if (!box) throw new Error(`No box for ${name}`);
  return box;
};

test.describe('Build view', () => {
  test('starts a visual build, drags a column, edits the form and keeps hand-written YAML', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());

    // Arrange: the welcome card opens the starter in the Build view
    await page.goto('/new');
    await page.getByRole('button', { name: 'Start a visual build' }).click();
    await expect(page.getByTestId('builder-status')).toContainText('15 keys', {
      // The first layout waits for the worker bundle on a cold start.
      timeout: 30_000,
    });
    await expect(page.getByRole('button', { name: 'Build' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await shoot('starter');

    // Arrange: a hand-written comment in the editor
    await page.locator('.monaco-editor .view-lines').click();
    await page.keyboard.press('Control+End');
    // insertText avoids the editor's auto-indent and bracket closing.
    await page.keyboard.insertText('\n# hand-written note');
    await page.getByTestId('builder-status').click();
    await expect.poll(() => savedConfig(page)).toContain('# hand-written note');

    // Act: select the middle column and drag its stagger handle down
    await page.getByRole('button', { name: 'matrix_middle_home' }).click();
    const before = await keyBox(page, 'matrix_middle_home');
    const handle = page.locator('[data-handle="stagger"]');
    const start = await handle.boundingBox();
    if (!start) throw new Error('No stagger handle');
    await page.mouse.move(
      start.x + start.width / 2,
      start.y + start.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      start.x + start.width / 2,
      start.y + start.height / 2 + 40,
      { steps: 8 }
    );
    // The engine lays the column out again while dragging...
    await expect
      .poll(async () => (await keyBox(page, 'matrix_middle_home')).y)
      .toBeGreaterThan(before.y + 10);
    // ...but nothing is written until the drag ends.
    expect(await savedConfig(page)).toContain('stagger: 3\n');
    await page.mouse.up();
    await shoot('dragged');

    // Assert: one committed value, comment kept
    await expect
      .poll(() => savedConfig(page))
      .toMatch(/middle:\n {10}key:\n {12}stagger: -\d+(\.5)?\n/);
    expect(await savedConfig(page)).toContain('# hand-written note');

    // Act: an expression through the form, at row scope
    await page.getByRole('radio', { name: 'Row' }).check();
    await expect(page.getByLabel('Padding (mm, row)')).toBeVisible();
    const padding = page.getByLabel('Padding (mm, row)');
    await padding.fill('u+2');
    await padding.press('Enter');

    // Assert
    await expect
      .poll(() => savedConfig(page))
      .toContain('        home:\n          padding: u+2\n');
    await expect(
      page.getByText(/Effective 21 mm, from row \(u\+2\)/)
    ).toBeVisible();

    // Act: undo restores the YAML exactly
    await page.getByRole('button', { name: /^Undo padding/ }).click();
    await expect.poll(() => savedConfig(page)).not.toContain('u+2');
  });

  test('adds structure, mirrors the board and shows the new keys in Outputs', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());
    await page.goto('/new');
    await page.getByRole('button', { name: 'Start a visual build' }).click();
    await expect(page.getByTestId('builder-status')).toContainText('15 keys', {
      // The first layout waits for the worker bundle on a cold start.
      timeout: 30_000,
    });

    // Act
    await page.getByRole('button', { name: 'matrix_index_top' }).click();
    await page.getByRole('button', { name: 'Add column' }).click();
    await page.getByRole('button', { name: 'Add thumb cluster' }).click();
    // The box follows the YAML, so it turns on once the engine has the mirror.
    const mirror = page.getByLabel('Mirror the board (split keyboard)');
    await mirror.click();
    await expect(mirror).toBeChecked();

    // Assert
    await expect(page.getByTestId('builder-status')).toContainText(
      '21 keys per side, mirrored'
    );
    await expect(
      page.getByRole('button', {
        name: 'mirror_thumb_far_cluster, mirror of thumb_far_cluster',
      })
    ).toBeVisible();
    const saved = await savedConfig(page);
    expect(saved).toContain(
      '          stagger: -3\n        col1:\n        inner:'
    );
    expect(saved).toContain(
      '    thumb:\n      anchor:\n        ref: matrix_inner_bottom'
    );
    expect(saved).toContain('  mirror:\n    ref:');
    await shoot('structure');

    // Act: a mirrored key selects its source
    await page
      .getByRole('button', {
        name: 'mirror_matrix_col1_top, mirror of matrix_col1_top',
      })
      .click();
    await expect(
      page.getByRole('heading', { name: 'matrix_col1_top' })
    ).toBeVisible();

    // Assert: the regular outputs follow the YAML
    await page.getByRole('button', { name: 'Outputs' }).click();
    await expect(page.getByTestId('demo.svg-file-preview')).toBeVisible();
  });

  test('keeps the last layout and pauses edits while the YAML is invalid', async ({
    page,
  }) => {
    await page.goto('/new');
    await page.getByRole('button', { name: 'Start a visual build' }).click();
    await expect(page.getByTestId('builder-status')).toContainText('15 keys', {
      // The first layout waits for the worker bundle on a cold start.
      timeout: 30_000,
    });

    // Act: break the YAML in the editor
    await page.locator('.monaco-editor .view-lines').click();
    await page.keyboard.press('Control+End');
    await page.keyboard.insertText('\nbroken: [');
    await page.getByTestId('builder-status').click();

    // Assert
    await expect(page.getByTestId('builder-status')).toContainText(
      'editing is paused'
    );
    await expect(page.getByRole('button', { name: /^matrix_/ })).toHaveCount(
      15
    );
    await expect(
      page.getByRole('button', { name: 'Add column' })
    ).toBeDisabled();
  });

  test('works on a phone-sized screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/new');
    await page.getByRole('button', { name: 'Start a visual build' }).click();

    // Act
    await page.getByTestId('mobile-build-button').click();

    // Assert
    await expect(page.getByTestId('builder-canvas')).toBeVisible();
    await expect(page.getByTestId('config-editor')).toBeHidden();
    await page.getByRole('button', { name: 'matrix_ring_home' }).click();
    await expect(
      page.getByRole('heading', { name: 'matrix_ring_home' })
    ).toBeVisible();

    // Act: back to outputs
    await page.getByTestId('mobile-outputs-button').click();
    await expect(page.getByTestId('builder-canvas')).toBeHidden();
  });
});
