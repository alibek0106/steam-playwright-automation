import BasePage from "./BasePage.js";

export default class GameDetailsPage extends BasePage {
    constructor(page) {
        super(page);
        this.gameName = page.locator("#appHubAppName").describe("Game Title Header on Details Page");
        this.purchaseBlock = page
            .locator(".game_area_purchase_game")
            .first()
            .describe("Main Game Purchase Area Block");
        this.originalPrice = this.purchaseBlock.locator(".discount_original_price").describe("Original Price Label");
        this.finalPrice = this.purchaseBlock.locator(".discount_final_price").describe("Discounted Final Price Label");
        this.discountPct = this.purchaseBlock.locator(".discount_pct").describe("Discount Percentage Label");
    }

    async getName() {
        return (await this.gameName.textContent()).trim();
    }

    async getOriginalPrice() {
        return (await this.originalPrice.textContent()).trim().replace(',00', '');
    }

    async getDiscountedPrice() {
        return (await this.finalPrice.textContent()).trim().replace(',00', '');
    }

    async getDiscountPercentage() {
        return (await this.discountPct.textContent()).trim();
    }
}
