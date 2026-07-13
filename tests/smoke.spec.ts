import { test, expect } from '@playwright/test';
import { CUSTOMER } from '../utils/testData';

const USERNAME = process.env.SAUCE_USERNAME!;
const PASSWORD = process.env.SAUCE_PASSWORD!;

test('E2E smoke: complete purchase flow', async ({ page }) => {

  // 1. login
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(USERNAME);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // 2. add product to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // 3. go to cart
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);

  // 4. checkout — fill customer info
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await page.locator('[data-test="firstName"]').fill(CUSTOMER.firstName);
  await page.locator('[data-test="lastName"]').fill(CUSTOMER.lastName);
  await page.locator('[data-test="postalCode"]').fill(CUSTOMER.zip);
  await page.locator('[data-test="continue"]').click();

  // 5. review order
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await page.locator('[data-test="finish"]').click();

  // 6. order confirmation
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

});