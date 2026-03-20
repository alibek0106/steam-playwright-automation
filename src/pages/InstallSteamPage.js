import BasePage from "./BasePage.js";

export default class InstallSteamPage extends BasePage {
    constructor(page) {
        super(page);
        this.installSteamLink = page.locator("a.header_installsteam_btn").describe("Header Global Install Steam Button");
        this.downloadButton = page.locator(".about_install_steam_link").first().describe("Main Install Steam Download Button");
    }

    async clickInstallSteamLink() {
        await this.installSteamLink.click();
    }

    async clickDownloadButton() {
        await this.downloadButton.click();
    }
}
