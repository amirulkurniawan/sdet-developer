import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('E2E smoke (PoM): complete purchase flow', async ({ page }) => {
  const loginPage    = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage     = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // 1. login
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  // 2. add product to cart
  await inventoryPage.addToCartByName('Sauce Labs Backpack');
  await expect(inventoryPage.getCartBadge()).toHaveText('1');

  // 3. go to cart
  await inventoryPage.goToCart();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(cartPage.getItemName()).toContainText('Sauce Labs Backpack');

  // 4. checkout — fill customer info
  await cartPage.checkout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await checkoutPage.fillCustomerInfo('Wonderkid', 'Developer', '55281');

  // 5. review order
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(checkoutPage.getItemName()).toContainText('Sauce Labs Backpack');
  await expect(checkoutPage.getPaymentInfo()).toBeVisible();
  await expect(checkoutPage.getTotalLabel()).toBeVisible();
  await checkoutPage.finish();

  // 6. order confirmation
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutPage.getConfirmHeading()).toBeVisible();
  await expect(checkoutPage.getCompleteText()).toContainText('Your order has been dispatched');
});
