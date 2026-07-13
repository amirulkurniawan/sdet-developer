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
    await page.waitForURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    const prices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const isConsistent = await checkoutPage.checkTotal(prices);
    const sum = prices.reduce((a, p) => a + p, 0);
    const itemTotal = await checkoutPage.getItemTotal();
    expect(isConsistent, `Expected $${sum.toFixed(2)} but checkout shows $${itemTotal.toFixed(2)}`).toBe(true);
  });

  // Feature: checkout-price-validation, Property 2 & 3
  test('round-trip price consistency — 1 item', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const prices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const isConsistent = await checkoutPage.checkTotal(prices);
    const sum = prices.reduce((a, p) => a + p, 0);
    const itemTotal = await checkoutPage.getItemTotal();
    expect(isConsistent, `Expected $${sum.toFixed(2)} but checkout shows $${itemTotal.toFixed(2)}`).toBe(true);
  });

  // Feature: checkout-price-validation, Property 2 & 3
  test('round-trip price consistency — 2 items', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    const prices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const isConsistent = await checkoutPage.checkTotal(prices);
    const sum = prices.reduce((a, p) => a + p, 0);
    const itemTotal = await checkoutPage.getItemTotal();
    expect(isConsistent, `Expected $${sum.toFixed(2)} but checkout shows $${itemTotal.toFixed(2)}`).toBe(true);
  });

  // Feature: checkout-price-validation, Property 2 & 3
  test('round-trip price consistency — 3 items', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    await inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
    await inventoryPage.goToCart();
    const prices = await cartPage.getItemPrices();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    const isConsistent = await checkoutPage.checkTotal(prices);
    const sum = prices.reduce((a, p) => a + p, 0);
    const itemTotal = await checkoutPage.getItemTotal();
    expect(isConsistent, `Expected $${sum.toFixed(2)} but checkout shows $${itemTotal.toFixed(2)}`).toBe(true);
  });

});
