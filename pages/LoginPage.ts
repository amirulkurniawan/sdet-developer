import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  private usernameInput = () => this.page.getByRole('textbox', { name: 'Username' });
  private passwordInput = () => this.page.locator('[data-test="password"]');
  private loginButton   = () => this.page.getByRole('button', { name: 'Login' });

  // Actions
  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }
}
