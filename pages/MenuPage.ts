import { type Locator, type Page } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetLink  = page.locator('[data-test="reset-sidebar-link"]');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.menuButton.click();
    await this.resetLink.click();
    await this.menuButton.click();
  }
}
