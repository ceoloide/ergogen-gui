import { test, expect } from '@playwright/test';
import fs from 'fs';
import crypto from 'crypto';
import { makeShooter } from './utils/screenshots';
import ADux from '../src/examples/adux';
import { CONFIG_LOCAL_STORAGE_KEY } from '../src/context/constants';

test.describe('Ergogen Configuration Processing', () => {
  const hashFile = async (filePath: string): Promise<string> => {
    const buffer = await fs.promises.readFile(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
  };

  test('loads A. dux configuration from local storage and displays outputs', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());
    // Set A. dux config directly in local storage
    await page.addInitScript(
      ({ config, key }) => {
        localStorage.setItem(key, JSON.stringify(config));
      },
      { config: ADux.value, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    // Navigate to the main page
    await page.goto('/');

    // Wait for the page to load with the config
    await shoot('before-haveURL-root');
    await expect(page).toHaveURL(/.*\/$/);
    await shoot('after-haveURL-root');

    // Wait for the editor to be visible
    await shoot('before-config-editor-visible');
    await expect(page.getByTestId('config-editor')).toBeVisible({
      timeout: 10000,
    });
    await shoot('after-config-editor-visible');

    // Wait for the downloads section to be visible
    const downloadsSection = page.getByTestId('downloads-container');
    await shoot('before-downloads-section-visible');
    await expect(downloadsSection).toBeVisible({ timeout: 5000 });
    await shoot('after-downloads-section-visible');
  });
  test('loads A. dux demo.dxf preview', async ({ page }) => {
    const shoot = makeShooter(page, test.info());
    // Set A. dux config directly in local storage
    await page.addInitScript(
      ({ config, key }) => {
        localStorage.setItem(key, JSON.stringify(config));
      },
      { config: ADux.value, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    // Navigate to the main page
    await page.goto('/');

    // Test DXF preview (demo output)
    const demoDxfRow = page.getByTestId('downloads-container-demo-dxf');
    await shoot('before-demo-dxf-row-visible');
    await expect(demoDxfRow).toBeVisible({ timeout: 5000 });
    await shoot('after-demo-dxf-row-visible');

    const dxfPreviewButton = page.getByTestId(
      'downloads-container-demo-dxf-preview'
    );
    await shoot('before-dxf-preview-button-visible');
    await expect(dxfPreviewButton).toBeVisible();
    await shoot('after-dxf-preview-button-visible');

    // Click to preview the DXF
    await dxfPreviewButton.click();
    const dxfFilePreview = page.getByTestId('demo.svg-file-preview');
    await shoot('before-dxf-file-preview-visible');
    await expect(dxfFilePreview).toBeVisible({ timeout: 5000 });
    await shoot('after-dxf-file-preview-visible');
  });
  test('loads A. dux KiCad PCB', async ({ page }) => {
    const shoot = makeShooter(page, test.info());
    // Set A. dux config directly in local storage
    await page.addInitScript(
      ({ config, key }) => {
        localStorage.setItem(key, JSON.stringify(config));
      },
      { config: ADux.value, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    // Navigate to the main page
    await page.goto('/');

    // Test KiCad PCB preview (architeuthis_dux.kicad_pcb output)
    const pcbRow = page.getByTestId(
      'downloads-container-architeuthis_dux-kicad_pcb'
    );
    await shoot('before-pcb-row-visible');
    await expect(pcbRow).toBeVisible({ timeout: 5000 });
    await shoot('after-pcb-row-visible');

    const pcbPreviewButton = page.getByTestId(
      'downloads-container-architeuthis_dux-kicad_pcb-preview'
    );
    await shoot('before-pcb-preview-button-visible');
    await expect(pcbPreviewButton).toBeVisible();
    await shoot('after-pcb-preview-button-visible');

    // Click to preview the KiCad PCB
    await pcbPreviewButton.click();
    const pcbFilePreview = page.getByTestId(
      'pcbs.architeuthis_dux-file-preview'
    );
    await shoot('before-pcb-file-preview-visible');
    await expect(pcbFilePreview).toBeVisible({ timeout: 5000 });
    await shoot('after-pcb-file-preview-visible');
  });
  test('loads A. dux JSCAD preview', async ({ page }) => {
    const shoot = makeShooter(page, test.info());
    // Set A. dux config directly in local storage
    await page.addInitScript(
      ({ config, key }) => {
        localStorage.setItem(key, JSON.stringify(config));
      },
      { config: ADux.value, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    // Navigate to the main page
    await page.goto('/');

    // Test JSCAD preview (bottom output)
    const demoJscadRow = page.getByTestId(
      'downloads-container-prototype-jscad'
    );
    await shoot('before-jscad-row-visible');
    await expect(demoJscadRow).toBeVisible({ timeout: 5000 });
    await shoot('after-jscad-row-visible');

    const jscadPreviewButton = page.getByTestId(
      'downloads-container-prototype-jscad-preview'
    );
    await shoot('before-jscad-preview-button-visible');
    await expect(jscadPreviewButton).toBeVisible();
    await shoot('after-jscad-preview-button-visible');

    // Click to preview the JSCAD
    await jscadPreviewButton.click();
    const jscadFilePreview = page.getByTestId('cases.prototype-file-preview');
    await shoot('before-jscad-file-preview-visible');
    await expect(jscadFilePreview).toBeVisible({ timeout: 5000 });
    await shoot('after-jscad-file-preview-visible');
  });
  test('loads A. dux STL previews', async ({ page }) => {
    const shoot = makeShooter(page, test.info());
    // Set A. dux config directly in local storage
    await page.addInitScript(
      ({ config, key }) => {
        localStorage.setItem(key, JSON.stringify(config));
        localStorage.setItem('ergogen:config:stlPreview', 'true');
      },
      { config: ADux.value, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    // Navigate to the main page
    await page.goto('/');

    // Wait for both STL files to appear (both mounting_plate and prototype)
    const stlRowMountingPlate = page.getByTestId(
      'downloads-container-mounting_plate-stl'
    );
    await shoot('before-stl-row-mounting-plate-visible');
    await expect(stlRowMountingPlate).toBeVisible({ timeout: 10000 });
    await shoot('after-stl-row-mounting-plate-visible');

    const stlRowPrototype = page.getByTestId(
      'downloads-container-prototype-stl'
    );
    await shoot('before-stl-row-prototype-visible');
    await expect(stlRowPrototype).toBeVisible({ timeout: 10000 });
    await shoot('after-stl-row-prototype-visible');

    // Wait for STL generation to complete (download button should appear)
    const stlDownloadButtonPlate = page.getByTestId(
      'downloads-container-mounting_plate-stl-download'
    );
    await shoot('before-stl-download-button-plate-visible');
    await expect(stlDownloadButtonPlate).toBeVisible({ timeout: 30000 });
    await shoot('after-stl-download-button-plate-visible');

    const stlPreviewButtonPrototype = page.getByTestId(
      'downloads-container-prototype-stl-download'
    );
    await shoot('before-stl-download-button-prototype-visible');
    await expect(stlPreviewButtonPrototype).toBeVisible({ timeout: 30000 });
    await shoot('after-stl-download-button-prototype-visible');

    // Click to preview the mounting_plate STL
    const stlPreviewButtonPlate = page.getByTestId(
      'downloads-container-mounting_plate-stl-preview'
    );
    await shoot('before-stl-preview-button-plate-visible');
    await expect(stlPreviewButtonPlate).toBeVisible({ timeout: 30000 });
    await shoot('after-stl-preview-button-plate-visible');

    await stlPreviewButtonPlate.click();
    const stlFilePreviewPlate = page.getByTestId(
      'cases.mounting_plate.stl-file-preview'
    );
    await shoot('before-stl-file-preview-plate-visible');
    await expect(stlFilePreviewPlate).toBeVisible({ timeout: 5000 });
    await shoot('after-stl-file-preview-plate-visible');

    // Click to preview the prototype STL
    const stlPreviewButtonProto = page.getByTestId(
      'downloads-container-prototype-stl-preview'
    );
    await shoot('before-stl-preview-button-proto-visible');
    await expect(stlPreviewButtonProto).toBeVisible({ timeout: 30000 });
    await shoot('after-stl-preview-button-proto-visible');
    await stlPreviewButtonProto.click();
    const stlFilePreviewProto = page.getByTestId(
      'cases.prototype.stl-file-preview'
    );
    await shoot('before-stl-file-preview-proto-visible');
    await expect(stlFilePreviewProto).toBeVisible({ timeout: 5000 });
    await shoot('after-stl-file-preview-proto-visible');

    // Download both STL files and ensure they are different
    const [downloadPlate] = await Promise.all([
      page.waitForEvent('download'),
      page
        .getByTestId('downloads-container-mounting_plate-stl-download')
        .click(),
    ]);
    const platePath = test.info().outputPath('mounting_plate.stl');
    await downloadPlate.saveAs(platePath);

    const [downloadProto] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('downloads-container-prototype-stl-download').click(),
    ]);
    const protoPath = test.info().outputPath('prototype.stl');
    await downloadProto.saveAs(protoPath);

    // Basic sanity: files exist and non-empty
    const plateStat = await fs.promises.stat(platePath);
    const protoStat = await fs.promises.stat(protoPath);
    expect(plateStat.size).toBeGreaterThan(0);
    expect(protoStat.size).toBeGreaterThan(0);

    // Hash and compare to verify they are different
    const [plateHash, protoHash] = await Promise.all([
      hashFile(platePath),
      hashFile(protoPath),
    ]);
    expect(plateHash).not.toBe(protoHash);
  });
});
