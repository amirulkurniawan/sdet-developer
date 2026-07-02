import { test, expect } from '../fixtures';
import { USERS }         from '../utils/testData';

test.describe('Login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials → redirect to inventory', async ({ loginPage, page }) => {
    await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('wrong password → shows error message', async ({ loginPage }) => {
    await loginPage.loginAs(USERS.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('unknown username → shows error message', async ({ loginPage }) => {
    await loginPage.loginAs('unknown_user', USERS.standard.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('empty fields → shows error message', async ({ loginPage }) => {
    await loginPage.loginAs('', '');
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('locked-out user → shows locked error', async ({ loginPage }) => {
    await loginPage.loginAs(USERS.locked.username, USERS.locked.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('login then logout → returns to login page', async ({ loginPage, menuPage, page }) => {
    await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await menuPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

});
