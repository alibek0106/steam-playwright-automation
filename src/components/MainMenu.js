export default class MainMenu {
    constructor(page) {
        this.categoriesButton = page.getByRole("button", {
            name: /Categories|Категории/i,
        }).describe("Main Navigation Categories Button");
        this.navContainer = page.locator('div[data-featuretarget="store-menu-v7"]').describe("Store Menu Container Navigation Links");
    }

    getCategoryLink(categoryName) {
        return this.navContainer.locator(
            `a[href*="/category/${categoryName.toLowerCase()}"]`
        ).first().describe(`Category Dropdown Link for ${categoryName}`);
    }

    async selectCategory(categoryName) {
        await this.categoriesButton.click();
        const categoryLink = this.getCategoryLink(categoryName);
        await categoryLink.click();
    }
}
