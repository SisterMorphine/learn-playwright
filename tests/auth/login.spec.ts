// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Login Feature Tests', () => {

  test('TC-LOGIN-01: Successful admin login and dashboard access', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.login('admin', 'admin123');

    await new DashboardPage(page).pageLoaded();
  });

  test('TC-LOGIN-02: Successful read-only user login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.login('viewer', 'viewer123');

    await new DashboardPage(page).pageLoaded();
  });

  test('TC-LOGIN-03: Failed login with invalid credentials displays error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.login('invaliduser', 'wrongpassword');

    await loginPage.pageLoaded();
    await expect(loginPage.usernameInput).toHaveValue('invaliduser');
    await expect(loginPage.passwordInput).toHaveValue('wrongpassword');
    await expect(loginPage.loginAlert).toBeVisible();
    await expect(loginPage.loginAlert).toContainText('Invalid username or password. Please try again');
  });

  test('TC-LOGIN-04: Empty form validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.loginButton.click();

    await expect(loginPage.usernameErrorMessage).toBeVisible();
    await expect(loginPage.passwordErrorMessage).toBeVisible();
    await expect(page).toHaveURL('/bank');
  });

  test('TC-LOGIN-05: Username field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.usernameInput.fill('admin');
    await loginPage.loginButton.click();

    await expect(loginPage.passwordErrorMessage).toBeVisible();
    await expect(loginPage.passwordErrorMessage).toContainText('Password is required');
    await expect(page).toHaveURL('/bank');
    await expect(loginPage.usernameInput).toHaveValue('admin');
  });

  test('TC-LOGIN-06: Password field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.passwordInput.fill('admin123');
    await loginPage.loginButton.click();

    await expect(loginPage.usernameErrorMessage).toBeVisible();
    await expect(loginPage.usernameErrorMessage).toContainText('Username is required');
    await loginPage.pageLoaded();
  });

  test('TC-LOGIN-07: Password visibility toggle functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.passwordInput.fill('admin123');
    await expect(loginPage.togglePasswordButton).toBeVisible();

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-LOGIN-08: Clear form button functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.usernameInput.fill('admin');
    await loginPage.passwordInput.fill('admin123');
    await expect(loginPage.usernameInput).toHaveValue('admin');

    await loginPage.clearButton.click();

    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();
  });
});
