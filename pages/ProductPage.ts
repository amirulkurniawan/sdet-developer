import { type Locator, type Page } from '@playwright/test';

// Product detail page (/inventory-item.html)
export class ProductPage {
  readonly page:           Page;
  readonly productName:    Locator;
  readonly productPrice:   Locator;
  readonly addToCartButton: Locator;
  readonly backButton:     Locator;

  constructor(page: Page) {
    this.page            = page;
    this.productName     = page.locator('[data-test="inventory-item-name"]');
    this.productPrice    = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.backButton      = page.locator('[data-test="back-to-products"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}
