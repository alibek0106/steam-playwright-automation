import BasePage from "./BasePage.js";
import Game from "../models/Game.js";
import { CONSTANTS } from "../data/constants.js";

export default class ActionGamesPage extends BasePage {
    constructor(page) {
        super(page);
        this.topSellersTab = page.getByText(CONSTANTS.TABS.TOP_SELLERS, { exact: true }).describe("Top Sellers Category Sub-Tab");
        this.discountedGames = page.locator('div.ImpressionTrackedElement:has(.HeroCapsuleImageContainer):has(.StoreSalePriceWidgetContainer.Discounted)').describe("Top Sellers Discounted Items List");
    }

    async clickTopSellersTab() {
        const tab = this.topSellersTab.first();

        // Aggressive scroll loop to force lazy loading
        for (let i = 0; i < CONSTANTS.TIMEOUTS.SCROLL_STEPS; i++) {
            if (await tab.isVisible()) {
                break;
            }
            // Steam's category navigation is tricky, wait for concurrent query responses
            await Promise.all([
                this.page.waitForResponse(response =>
                    response.url().includes('/query') && response.status() === 200,
                    { timeout: CONSTANTS.TIMEOUTS.NETWORK_FAST }
                ).catch(() => { }),
                this.page.evaluate(() => window.scrollBy(0, 1000))
            ]);
        }

        await tab.click();

        // Steam rarely hits true network idle
        // Wait for the new content to render instead.
        await this.page.waitForLoadState(CONSTANTS.TIMEOUTS.DOM_LOAD);
    }

    async findGameWithMaxDiscount() {
        // Look for rows that contain a discounted sale price widget AND a capsule image
        // This prevents accidentally matching the top Featured Carousel games which use different classes.

        // Scroll down in a loop to force the lazy-loaded games to render in the DOM.
        let count = 0;
        for (let i = 0; i < CONSTANTS.TIMEOUTS.SCROLL_STEPS; i++) {
            count = await this.discountedGames.count();
            if (count > 0) break;

            await Promise.all([
                this.page.waitForResponse(response =>
                    response.url().includes('/query') && response.status() === 200,
                    { timeout: CONSTANTS.TIMEOUTS.NETWORK_SLOW }
                ).catch(() => { }),
                this.page.evaluate(() => window.scrollBy(0, 800))
            ]);
        }

        if (count === 0) {
            throw new Error("No discounted games found in the Top Sellers list after waiting.");
        }

        // Locate & Evaluate: Use evaluateAll() to extract the best game's data instantaneously
        const bestGameData = await this.discountedGames.evaluateAll((elements) => {
            let maxVal = -1;
            let bestEl = null;

            elements.forEach((el) => {
                const pctEl = el.querySelector('.StoreSalePriceWidgetContainer > div:nth-child(1)');
                if (pctEl) {
                    const pctText = pctEl.textContent;
                    // Parse integer discount
                    const discount = Math.abs(parseInt(pctText.replace(/[^0-9]/g, ""), 10));

                    // Handle Ties: strictly greater ensures the first one encountered is kept
                    if (discount > maxVal) {
                        maxVal = discount;
                        bestEl = el;
                    }
                }
            });

            if (!bestEl) return null;

            const nameEl = bestEl.querySelector('.HeroCapsuleImageContainer img');
            const origPriceEl = bestEl.querySelector('.StoreSalePriceWidgetContainer > div:nth-child(2) > div:nth-child(1)');
            const discPriceEl = bestEl.querySelector('.StoreSalePriceWidgetContainer > div:nth-child(2) > div:nth-child(2)');
            const pctEl = bestEl.querySelector('.StoreSalePriceWidgetContainer > div:nth-child(1)');
            const linkEl = bestEl.querySelector('a.Focusable');

            return {
                name: nameEl ? nameEl.getAttribute('alt').trim() : "Unknown",
                originalPrice: origPriceEl ? origPriceEl.textContent.trim().replace(',00', '') : "",
                discountedPrice: discPriceEl ? discPriceEl.textContent.trim().replace(',00', '') : "",
                discountPercentage: pctEl ? pctEl.textContent.trim() : "",
                url: linkEl ? linkEl.getAttribute('href') : ""
            };
        });

        if (!bestGameData) {
            throw new Error("Could not extract data for the highest discounted game.");
        }

        const game = new Game(
            bestGameData.name,
            bestGameData.originalPrice,
            bestGameData.discountedPrice,
            bestGameData.discountPercentage
        );

        // Navigate explicitly to avoid target="_blank" spawning a new tab
        await this.page.goto(bestGameData.url);
        await this.waitForPageLoad();

        return game;
    }
}
