import Briefs56 from '../../src/examples/briefs56';
import { appBase, expectDecodedImages } from '../utils/baseAssets';
import { download } from './app';
import { test, expect } from './journey';

// The examples that the Welcome page offers with the engine of this build, in
// the order of the page. Empty Configuration has its own button.
const examples = [
  'Absolem',
  'Atreus',
  'A. Dux',
  'Corney Island',
  'Sweep-like',
  'Reviung41',
  'Tiny20',
  'Wubbo',
  'Alpha',
  'Plank',
  'Curly-45',
  'Briefs 56',
  'Willy 50',
];

test('loads an example that the user chooses on the Welcome page', async ({
  page,
  baseURL,
  journey,
}) => {
  const exampleCards = page.getByLabel(/^Load .+ example$/);
  const errorBanner = page.getByRole('button', { name: 'Close error message' });

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step('Read the examples', async () => {
    await expect(exampleCards).toHaveText(examples);
    const previews = page.getByRole('img', { name: / preview$/ });
    await expect(previews).toHaveCount(examples.length);
    await expectDecodedImages(previews, `${appBase(baseURL)}images/previews/`);
    journey.observe('examples', await exampleCards.allInnerTexts());
  });

  await journey.step('Choose the Briefs 56 example', async () => {
    await page.getByLabel('Load Briefs 56 example', { exact: true }).click();
    await expect(page).toHaveURL(appBase(baseURL));
    // Of the examples, only Briefs 56 has the outline center.
    await expect(
      page.getByLabel('Download center.dxf', { exact: true })
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Download the configuration', async () => {
    const file = await download(
      page,
      page.getByRole('button', { name: 'Download configuration' })
    );
    expect(
      file.content.toString('utf8'),
      'the configuration of the Briefs 56 example'
    ).toBe(Briefs56.value);
    journey.observe('configuration', {
      name: file.name,
      bytes: file.content.length,
    });
  });
});
