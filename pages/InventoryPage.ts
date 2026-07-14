import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page:          Page;
  readonly cartLink:      Locator;
  readonly sortDropdown:  Locator;
  readonly cartBadge:     Locator;

  constructor(page: Page) {
    this.page         = page;
    this.cartLink     = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge    = page.locator('[data-test="shopping-cart-badge"]');
  }

  async selectProduct(productName: string) {
    // Scoped to item name locator to avoid matching description text
    await this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }).click();
  }

  async addToCart(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeFromCart(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async addProduct(productName: string): Promise<void> {
    await this.addToCart(productName);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    return parseInt(await this.cartBadge.innerText(), 10);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }
}