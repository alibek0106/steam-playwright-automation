import { test as base } from "@playwright/test";
import SteamHomePage from "../pages/SteamHomePage.js";
import ActionGamesPage from "../pages/ActionGamesPage.js";
import AgeCheckPage from "../pages/AgeCheckPage.js";
import GameDetailsPage from "../pages/GameDetailsPage.js";
import InstallSteamPage from "../pages/InstallSteamPage.js";

export const test = base.extend({
    homePage: async ({ page }, use) => {
        await use(new SteamHomePage(page));
    },
    actionPage: async ({ page }, use) => {
        await use(new ActionGamesPage(page));
    },
    ageCheckPage: async ({ page }, use) => {
        await use(new AgeCheckPage(page));
    },
    detailsPage: async ({ page }, use) => {
        await use(new GameDetailsPage(page));
    },
    installPage: async ({ page }, use) => {
        await use(new InstallSteamPage(page));
    },
});

export { expect } from "@playwright/test";
