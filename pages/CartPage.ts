import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page:              Page;
  readonly checkoutButton:    Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page                    = page;
    this.checkoutButton          = page.locator('[data-test="checkout"]');
    this.continueShoppingButton  = page.locator('[data-test="continue-shopping"]');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // Returns the name locators of items currently in the cart
  getCartItems(): Locator {
    return this.page.locator('[data-test="inventory-item-name"]');
  }

  async removeItem(productName: string) {
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }
}