import type { Page, Route } from '@playwright/test';
import {
  download,
  markerBoardFiles,
  markerBoardFootprints,
  markerFootprint,
  pcbFootprints,
} from './app';
import { test, expect } from './journey';

// A GitHub repository that exists only in this journey.
const repository = 'journey-owner/journey-keyboard';

// Serves the files of the repository on the branch main as GitHub does. The
// content of a file comes from raw.githubusercontent.com, and the list of the
// files in a folder from the contents API of api.github.com. Any other path
// answers 404. Returns the paths of the files that the app read, in order.
async function serveRepository(page: Page, files: Record<string, string>) {
  const read: string[] = [];
  const notFound = (route: Route) =>
    route.fulfill({ status: 404, body: 'Not Found' });
  const pathAfter = (route: Route, prefix: string) =>
    new URL(route.request().url()).pathname.slice(prefix.length);

  await page.route(
    `https://raw.githubusercontent.com/${repository}/main/**`,
    (route) => {
      const path = pathAfter(route, `/${repository}/main/`);
      if (!(path in files)) return notFound(route);
      read.push(path);
      return route.fulfill({ body: files[path] });
    }
  );
  await page.route(
    `https://api.github.com/repos/${repository}/contents/**`,
    (route) => {
      const folder = pathAfter(route, `/repos/${repository}/contents/`);
      const items = Object.keys(files)
        .filter((path) => path.startsWith(`${folder}/`))
        .map((path) => ({ name: path.split('/').pop(), path, type: 'file' }));
      return items.length ? route.fulfill({ json: items }) : notFound(route);
    }
  );
  return read;
}

test('opens the configuration and the footprints of a GitHub repository', async ({
  page,
  journey,
}) => {
  const errorBanner = page.getByRole('button', { name: 'Close error message' });
  const downloadBoard = page.getByLabel('Download board.kicad_pcb', {
    exact: true,
  });
  const read = await serveRepository(page, markerBoardFiles);

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step(`Load ${repository} From Repo`, async () => {
    await page
      .getByRole('textbox', { name: 'Repository URL or path' })
      .fill(repository);
    await page
      .getByRole('button', { name: 'Load configuration from repository' })
      .click();
    await expect(
      page.getByRole('code'),
      'the editor, with the config.yaml of the repository'
    ).toContainText(`what: ${markerFootprint.name}`, { timeout: 30_000 });
    journey.observe('read', [...read]);
  });

  await journey.step('Wait for the outputs', async () => {
    await expect(
      downloadBoard,
      `board.kicad_pcb, which needs the footprint ${markerFootprint.name} of the repository`
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Download board.kicad_pcb from Outputs', async () => {
    const file = await download(page, downloadBoard);
    const footprints = pcbFootprints(file.content.toString('utf8'));
    expect(
      footprints,
      'the footprints of the downloaded board.kicad_pcb'
    ).toEqual(markerBoardFootprints);
    journey.observe('pcb', { name: file.name, footprints });
  });
});
