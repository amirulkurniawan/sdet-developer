import { test, expect } from '../fixtures';
import { USERS, CUSTOMER } from '../utils/testData';

test.describe('E2E smoke', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test('complete purchase flow', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.confirmHeading).toHaveText('Thank you for your order!');
  });

});