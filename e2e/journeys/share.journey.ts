import type { Page } from '@playwright/test';
import {
  addCustomFootprint,
  download,
  markerBoardConfig,
  markerBoardFootprints,
  markerFootprint,
  newContextPage,
  pasteIntoEditor,
  pcbFootprints,
} from './app';
import { test, expect } from './journey';

const errorBanner = (page: Page) =>
  page.getByRole('button', { name: 'Close error message' });
const downloadBoard = (page: Page) =>
  page.getByLabel('Download board.kicad_pcb', { exact: true });

test('opens a share link with its configuration and footprint in a new browser', async ({
  page,
  browser,
  baseURL,
  journey,
}) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  let link = '';

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step('Choose Empty Configuration', async () => {
    await page
      .getByRole('button', { name: 'Start with empty configuration' })
      .click();
    await expect(
      page.getByRole('textbox', { name: 'Editor content' })
    ).toBeAttached();
  });

  await journey.step(
    'Add the footprint journey_marker in the settings',
    async () => {
      await addCustomFootprint(page, markerFootprint);
      await expect(
        page.getByRole('link', {
          name: `download injection ${markerFootprint.name}`,
        })
      ).toBeVisible();
      await page.getByRole('button', { name: 'Hide settings panel' }).click();
    }
  );

  await journey.step('Paste a PCB that places journey_marker', async () => {
    await pasteIntoEditor(page, markerBoardConfig);
    await expect(downloadBoard(page)).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner(page)).toBeHidden();
  });

  await journey.step('Choose Share', async () => {
    await page.getByRole('button', { name: 'Share configuration' }).click();
    await expect(
      page.getByRole('heading', { name: 'Share Configuration' })
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: markerFootprint.name })
    ).toBeChecked({ timeout: 30_000 });
  });

  await journey.step('Choose Share in the dialog', async () => {
    await page.getByRole('button', { name: 'Share', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Shareable Configuration Link' })
    ).toBeVisible();
    link = await page.getByRole('textbox', { name: 'Share link' }).inputValue();
    expect(link).toMatch(/^http:\/\/[^/]+\/#.+/);
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(link);
    journey.observe('link', { characters: link.length });
  });

  const receiver = await newContextPage(browser, baseURL!);
  journey.follow(receiver);

  await journey.step('Open the link in a new browser context', async () => {
    await receiver.goto(link);
    await expect(
      receiver.getByRole('textbox', { name: 'Editor content' }),
      'the editor of the configuration that the link carried'
    ).toBeAttached({ timeout: 30_000 });
    await expect(receiver.getByRole('code')).toContainText(
      `what: ${markerFootprint.name}`
    );
  });

  await journey.step('Download the configuration of the link', async () => {
    const file = await download(
      receiver,
      receiver.getByRole('button', { name: 'Download configuration' })
    );
    expect(
      file.content.toString('utf8'),
      'the configuration that the link carried'
    ).toBe(markerBoardConfig);
    journey.observe('configuration', {
      name: file.name,
      bytes: file.content.length,
    });
  });

  await journey.step('Download board.kicad_pcb of the link', async () => {
    await expect(
      downloadBoard(receiver),
      `board.kicad_pcb, which needs the footprint ${markerFootprint.name} that the link carried`
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner(receiver)).toBeHidden();
    const file = await download(receiver, downloadBoard(receiver));
    const footprints = pcbFootprints(file.content.toString('utf8'));
    expect(
      footprints,
      'the footprints of board.kicad_pcb in the new browser context'
    ).toEqual(markerBoardFootprints);
    journey.observe('pcb', { name: file.name, footprints });
  });

  await receiver.context().close();
});
