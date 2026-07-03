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
    const usernameInput = loginPage.getUsernameInput();
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toHaveValue('invaliduser');
    
    const passwordInput = loginPage.getPasswordInput();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveValue('wrongpassword');
    
    const loginAlert = loginPage.getLoginAlert();
    await expect(loginAlert).toBeVisible();
    await expect(loginAlert).toContainText('Invalid username or password. Please try again');
  });

  test('TC-LOGIN-04: Empty form validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.clickLoginButton();

    const usernameErrorMessage = loginPage.getUsernameErrorMessage();
    await expect(usernameErrorMessage).toBeVisible();

    const passwordErrorMessage = loginPage.getPasswordErrorMessage();
    await expect(passwordErrorMessage).toBeVisible();

    await expect(page).toHaveURL('/bank');
  });

  test('TC-LOGIN-05: Username field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.fillUsername('admin');
    await loginPage.clickLoginButton();

    const passwordErrorMessage = loginPage.getPasswordErrorMessage();
    await expect(passwordErrorMessage).toBeVisible();
    await expect(passwordErrorMessage).toContainText('Password is required');

    await expect(page).toHaveURL('/bank');
    await expect(loginPage.getUsernameInput()).toHaveValue('admin');
  });

  test('TC-LOGIN-06: Password field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();
    
    await loginPage.fillPassword('admin123');
    await loginPage.clickLoginButton();

    const usernameErrorMessage = loginPage.getUsernameErrorMessage();
    await expect(usernameErrorMessage).toBeVisible();
    await expect(usernameErrorMessage).toContainText('Username is required');

    await loginPage.pageLoaded();
  });

  test('TC-LOGIN-07: Password visibility toggle functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.fillPassword('admin123');
    const passwordToggle = loginPage.getTogglePasswordButton();
    await expect(passwordToggle).toBeVisible();

    await loginPage.togglePasswordVisibility();
    const passwordInput = loginPage.getPasswordInput();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-LOGIN-08: Clear form button functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.fillUsername('admin');
    await loginPage.fillPassword('admin123');
    const usernameinput = loginPage.getUsernameInput();
    await expect(usernameinput).toHaveValue('admin');

    await loginPage.clickClearButton ();

    const passwordInput = loginPage.getPasswordInput();
    await expect(passwordInput).toBeEmpty();
    await expect(usernameinput).toBeEmpty();
  });
});
