import { CONSTANTS } from "../data/constants.js";

export default class BasePage {
    constructor(page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState(CONSTANTS.TIMEOUTS.DOM_LOAD);
    }
}
