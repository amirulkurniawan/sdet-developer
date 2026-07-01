import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  // Locators - Step 1
  private firstNameInput = () => this.page.getByPlaceholder('First Name');
  private lastNameInput  = () => this.page.getByPlaceholder('Last Name');
  private zipInput       = () => this.page.getByPlaceholder('Zip/Postal Code');
  private continueButton = () => this.page.getByRole('button', { name: 'Continue' });

  // Locators - Step 2
  private itemName       = () => this.page.locator('[data-test="inventory-item-name"]');
  private paymentInfo    = () => this.page.locator('[data-test="payment-info-value"]');
  private totalLabel     = () => this.page.locator('[data-test="total-label"]');
  private finishButton   = () => this.page.getByRole('button', { name: 'Finish' });

  // Locators - Complete
  private confirmHeading = () => this.page.getByRole('heading', { name: 'Thank you for your order!' });
  private completeText   = () => this.page.locator('[data-test="complete-text"]');
  private backHomeButton = () => this.page.getByRole('button', { name: 'Back Home' });

  // Actions - Step 1
  async fillCustomerInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput().fill(firstName);
    await this.lastNameInput().fill(lastName);
    await this.zipInput().fill(zip);
    await this.continueButton().click();
  }

  // Actions - Step 2
  async finish() {
    await this.finishButton().click();
  }

  // Actions - Complete
  async backToHome() {
    await this.backHomeButton().click();
  }

  // Getters untuk assertion di spec
  getItemName()       { return this.itemName(); }
  getPaymentInfo()    { return this.paymentInfo(); }
  getTotalLabel()     { return this.totalLabel(); }
  getConfirmHeading() { return this.confirmHeading(); }
  getCompleteText()   { return this.completeText(); }
}
