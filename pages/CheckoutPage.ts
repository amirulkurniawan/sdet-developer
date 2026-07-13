import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page:            Page;
  readonly firstNameInput:  Locator;
  readonly lastNameInput:   Locator;
  readonly zipInput:        Locator;
  readonly continueButton:  Locator;
  readonly finishButton:    Locator;
  readonly confirmHeading:  Locator;
  readonly completeText:    Locator;
  readonly errorMessage:    Locator;  // shown when required fields are missing

  constructor(page: Page) {
    this.page           = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput  = page.locator('[data-test="lastName"]');
    this.zipInput       = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton   = page.locator('[data-test="finish"]');
    this.confirmHeading = page.locator('[data-test="complete-header"]');
    this.completeText   = page.locator('[data-test="complete-text"]');
    this.errorMessage   = page.locator('[data-test="error"]');
  }

  async fillInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async finish() {
    await this.finishButton.click();
  }

  async getItemTotal(): Promise<number> {
    const text = await this.page.locator('[data-test="subtotal-label"]').innerText();
    const match = text.match(/\$([\d.]+)/);
    if (!match) {
      throw new Error(`Cannot parse subtotal-label text: "${text}"`);
    }
    return parseFloat(match[1]);
  }

  async checkTotal(cartItemPrices: number[]): Promise<boolean> {
    const sum = cartItemPrices.reduce((acc, p) => acc + p, 0);
    const itemTotal = await this.getItemTotal();
    return Math.abs(sum - itemTotal) <= 0.01;
  }
}