import BasePage from './BasePage';

export default class InstallSteamPage extends BasePage {
  constructor(page) {
    super(page);
    this.downloadButton = page
      .locator('.about_install_steam_link')
      .first()
      .describe('Main Install Steam Download Button');
  }

  async clickDownloadButton() {
    await this.downloadButton.click();
  }
}