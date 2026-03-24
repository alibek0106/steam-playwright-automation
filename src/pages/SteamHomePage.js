import BasePage from './BasePage';
import MainMenu from '../components/MainMenu';
import { CONSTANTS } from '../data/constants';

export default class SteamHomePage extends BasePage {
  constructor(page) {
    super(page);
    this.menu = new MainMenu(page);
    this.installSteamLink = page
      .locator('a.header_installsteam_btn')
      .describe('Header Global Install Steam Button');
  }

  async navigate() {
    await this.page.goto(CONSTANTS.URLS.BASE_URL);
    await this.waitForPageLoad();
  }

  async clickInstallSteamLink() {
    await this.installSteamLink.click();
  }
}