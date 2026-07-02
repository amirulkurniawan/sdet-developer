import { test, expect } from '../fixtures';
import { USERS } from '../utils/testData';

test.describe('Inventory', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test('shows 6 products', async ({ inventoryPage }) => {
    const names = await inventoryPage.getProductNames();
    expect(names).toHaveLength(6);
  });

  test('sort A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('sort Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('add item - cart badge shows 1', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('add then remove item - cart badge disappears', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.removeFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('add 2 items - cart badge shows 2', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('click product opens detail page', async ({ inventoryPage, page }) => {
    await inventoryPage.selectProduct('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

});
