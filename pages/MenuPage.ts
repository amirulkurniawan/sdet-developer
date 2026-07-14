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
    // Wait for the sidebar drawer to open before clicking the link
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.menuButton.click();
    // Wait for the sidebar drawer to open before clicking the link
    await this.resetLink.waitFor({ state: 'visible' });
    await this.resetLink.click();
    // Close the menu after reset
    await this.menuButton.click();
  }
}
