import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  // Locators
  private cartBadge     = () => this.page.locator('[data-test="shopping-cart-badge"]');
  private cartLink      = () => this.page.locator('[data-test="shopping-cart-link"]');

  // Actions
  async selectProduct(productName: string) {
    await this.page.getByText(productName).click();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }

  // Add to cart directly from inventory listing
  async addToCartByName(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async goToCart() {
    await this.cartLink().click();
  }

  // Getter untuk assertion di spec
  getCartBadge() {
    return this.cartBadge();
  }
}
