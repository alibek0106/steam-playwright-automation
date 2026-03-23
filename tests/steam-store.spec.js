import { test, expect } from '../src/fixtures/test';
import { CONSTANTS } from '../src/data/constants';

test.describe('Steam Store - Top Sellers Discount', () => {
  test('should find game with highest discount and verify its details', async ({
    homePage,
    actionPage,
    ageCheckPage,
    detailsPage,
  }) => {
    await test.step('Navigate to Steam Store and open Action category', async () => {
      await homePage.navigate();
      await homePage.menu.selectCategory(CONSTANTS.CATEGORIES.ACTION);
    });

    await test.step('Click the "Top Sellers" tab', async () => {
      await actionPage.clickTopSellersTab();
    });

    let game;
    await test.step('Find the game with the maximum discount', async () => {
      game = await actionPage.findGameWithMaxDiscount();
    });

    await test.step('Handle Age Verification if it appears', async () => {
      await ageCheckPage.handleAgeVerification();
    });

    let detailName;
    let detailOriginalPrice;
    let detailDiscountedPrice;
    let detailDiscountPct;
    await test.step('Extract details from the Game Details page', async () => {
      detailName = await detailsPage.getName();
      detailOriginalPrice = await detailsPage.getOriginalPrice();
      detailDiscountedPrice = await detailsPage.getDiscountedPrice();
      detailDiscountPct = await detailsPage.getDiscountPercentage();
    });

    await test.step('Assert that details page data matches the Game object from the list', async () => {
      expect(detailName).toBe(game.name);
      expect(detailOriginalPrice).toBe(game.originalPrice);
      expect(detailDiscountedPrice).toBe(game.discountedPrice);
      expect(detailDiscountPct).toBe(game.discountPercentage);
    });
  });
});