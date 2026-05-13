import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Bank Demo - Invalid login', () => {
  test('User with incorrect credentials stays on login page with error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid-user', 'wrong-password');

    await loginPage.expectErrorMessage();
  });

  test('User with incorrect password stays on login page with error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('admin', 'wrong-password');

    await loginPage.expectErrorMessage();
  });
});
