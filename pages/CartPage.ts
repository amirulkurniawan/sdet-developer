import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  // Locators
  private itemName       = () => this.page.locator('[data-test="inventory-item-name"]');
  private checkoutButton = () => this.page.getByRole('button', { name: 'Checkout' });

  // Actions
  async checkout() {
    await this.checkoutButton().click();
  }

  // Getter untuk assertion di spec
  getItemName() {
    return this.itemName();
  }
}
