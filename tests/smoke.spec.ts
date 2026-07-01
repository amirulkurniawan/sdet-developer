import { test, expect } from '@playwright/test';

test('E2E smoke: complete purchase flow', async ({ page }) => {

  // 1. login
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);

  // 2. add product to cart
  await page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // 3. go to cart
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

  // 4. checkout — fill customer info
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await page.getByPlaceholder('First Name').fill('Wonderkid');
  await page.getByPlaceholder('Last Name').fill('Developer');
  await page.getByPlaceholder('Zip/Postal Code').fill('55281');
  await page.getByRole('button', { name: 'Continue' }).click();

  // 5. review order
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('[data-test="payment-info-value"]')).toBeVisible();
  await expect(page.locator('[data-test="total-label"]')).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();

  // 6. order confirmation
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched');

});
