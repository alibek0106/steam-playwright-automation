import BasePage from "./BasePage.js";
import MainMenu from "../components/MainMenu.js";
import { CONSTANTS } from "../data/constants.js";

export default class SteamHomePage extends BasePage {
    constructor(page) {
        super(page);
        this.menu = new MainMenu(page);
    }

    async navigate() {
        await this.page.goto(CONSTANTS.URLS.BASE_URL);
        await this.waitForPageLoad();
    }
}
