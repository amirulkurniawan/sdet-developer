import { test, expect } from '../fixtures';
import { USERS, CUSTOMER } from '../utils/testData';

test.describe('Cart & Checkout', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test('cart is empty by default', async ({ inventoryPage, page }) => {
    await inventoryPage.goToCart();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('item added in inventory appears in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(cartPage.getCartItems()).toContainText('Sauce Labs Backpack');
  });

  test('remove item from cart', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.removeItem('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  });

  test('continue shopping returns to inventory', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('checkout with missing first name shows error', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo('', CUSTOMER.lastName, CUSTOMER.zip);
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('checkout with missing zip shows error', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, '');
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('complete purchase shows confirmation', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.confirmHeading).toHaveText('Thank you for your order!');
  });

  test('complete purchase with 2 items', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await checkoutPage.finish();
    await expect(checkoutPage.confirmHeading).toHaveText('Thank you for your order!');
  });

  test('price total matches sum for 2 items', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    // Wait for cart page and items to be fully rendered before reading prices
    await page.waitForURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    const cartPrices = await cartPage.getItemPrices();
    await cartPage.checkout();
    // fillInfo now waits for checkout-step-two.html URL before returning
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    // Read itemTotal once and use it for both comparison and failure message
    const itemTotal = await checkoutPage.getItemTotal();
    const cartSum = cartPrices.reduce((a, p) => a + p, 0);
    expect(
      Math.abs(cartSum - itemTotal) <= 0.01,
      `Cart sum $${cartSum.toFixed(2)} does not match checkout Item Total $${itemTotal.toFixed(2)}`
    ).toBe(true);
  });

  // Feature: checkout-price-validation, Property 2 & 3
  test('round-trip price consistency — 1 item', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    // Wait for cart page and item to be fully rendered before reading prices
    await inventoryPage.goToCart();
    await page.waitForURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    const cartPrices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const itemTotal = await checkoutPage.getItemTotal();
    const cartSum = cartPrices.reduce((a, p) => a + p, 0);
    expect(
      Math.abs(cartSum - itemTotal) <= 0.01,
      `Cart sum $${cartSum.toFixed(2)} does not match checkout Item Total $${itemTotal.toFixed(2)}`
    ).toBe(true);
  });

  // Feature: checkout-price-validation, Property 2 & 3
  test('round-trip price consistency — 2 items', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    // Wait for cart page and items to be fully rendered before reading prices
    await inventoryPage.goToCart();
    await page.waitForURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    const cartPrices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const itemTotal = await checkoutPage.getItemTotal();
    const cartSum = cartPrices.reduce((a, p) => a + p, 0);
    expect(
      Math.abs(cartSum - itemTotal) <= 0.01,
      `Cart sum $${cartSum.toFixed(2)} does not match checkout Item Total $${itemTotal.toFixed(2)}`
    ).toBe(true);
  });

  // Feature: checkout-price-validation, Property 2 & 3
  test('round-trip price consistency — 3 items', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    await inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
    // Wait for cart page and items to be fully rendered before reading prices
    await inventoryPage.goToCart();
    await page.waitForURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
    const cartPrices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const itemTotal = await checkoutPage.getItemTotal();
    const cartSum = cartPrices.reduce((a, p) => a + p, 0);
    expect(
      Math.abs(cartSum - itemTotal) <= 0.01,
      `Cart sum $${cartSum.toFixed(2)} does not match checkout Item Total $${itemTotal.toFixed(2)}`
    ).toBe(true);
  });

});
