import BasePage from "./BasePage.js";
import { CONSTANTS } from "../data/constants.js";

export default class AgeCheckPage extends BasePage {
    constructor(page) {
        super(page);
        this.ageDay = page.locator("select#ageDay").describe("Age Verification Day Dropdown");
        this.ageMonth = page.locator("select#ageMonth").describe("Age Verification Month Dropdown");
        this.ageYear = page.locator("select#ageYear").describe("Age Verification Year Dropdown");
        this.viewPageButton = page.locator("#view_product_page_btn").describe("View Page / Continue Button");
    }

    async handleAgeVerification() {
        const isVisible = await this.ageYear
            .waitFor({ state: CONSTANTS.TIMEOUTS.VISIBLE, timeout: CONSTANTS.TIMEOUTS.NETWORK_FAST })
            .then(() => true)
            .catch(() => false);

        if (!isVisible) {
            return;
        }

        await this.ageDay.selectOption("1");
        await this.ageMonth.selectOption({ index: 1 });
        await this.ageYear.selectOption(CONSTANTS.AGE_GATE.DEFAULT_YEAR);

        await this.viewPageButton.click();
        await this.waitForPageLoad();
    }
}
