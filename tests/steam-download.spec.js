import { test, expect } from '../src/fixtures/test';
import fs from 'fs';
import path from 'path';

test.describe('Steam Store - Download Installer', () => {
  test('should download the Steam installer and verify the file', async ({
    page,
    homePage,
    installPage,
  }) => {
    await test.step('Navigate to Steam Home Page', async () => {
      await homePage.navigate();
    });

    await test.step('Click the "Install Steam" link', async () => {
      await homePage.clickInstallSteamLink();
    });

    let download;
    await test.step('Click the download button and wait for the download event', async () => {
      [download] = await Promise.all([
        page.waitForEvent('download'),
        installPage.clickDownloadButton(),
      ]);
    });

    let filePath;
    await test.step('Save the file dynamically', async () => {
      const downloadsDir = path.resolve('test-results', 'downloads');
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const fileName = download.suggestedFilename();
      filePath = path.join(downloadsDir, fileName);
      await download.saveAs(filePath);
    });

    await test.step('Verify the file exists and is valid', async () => {
      expect(fs.existsSync(filePath)).toBe(true);

      const fileSize = fs.statSync(filePath).size;
      expect(fileSize).toBeGreaterThan(0);
    });
  });
});