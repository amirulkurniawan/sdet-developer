import { test, expect } from '../fixtures';
import { USERS }         from '../utils/testData';

// Basic authorization check using POM (kept as a quick sanity test)
test('Login with valid credentials → inventory page', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
});