import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page:          Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton:   Locator;
  readonly errorMessage:  Locator;

  constructor(page: Page) {
    this.page          = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  // Login with explicit credentials (used by fixtures & negative tests)
  async loginAs(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait for navigation: either inventory (success) or the error message visible (failure)
    await Promise.race([
      this.page.waitForURL(/inventory\.html/),
      this.errorMessage.waitFor({ state: 'visible' }),
    ]);
  }

  // Convenience wrapper that reads from .env (keeps existing smoke tests working)
  async login() {
    await this.loginAs(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
  }
}