import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { TEST_USERS } from '../../utils/testData';

test.describe('Login Feature Tests', () => {

  test('TC-LOGIN-01: Successful admin login and dashboard access', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.login(TEST_USERS.admin.username, TEST_USERS.admin.password);

    await new DashboardPage(page).pageLoaded();
  });

  test('TC-LOGIN-02: Successful read-only user login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.login(TEST_USERS.viewer.username, TEST_USERS.viewer.password);

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

    const loginErrorMessageText = await loginPage.getLoginErrorMessageText();
    expect(loginErrorMessageText).toContain('The username or password you entered is incorrect.');

  });

  test('TC-LOGIN-04: Empty form validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.clickLoginButton();

    const loginErrorMessageText = await loginPage.getLoginErrorMessageText();
    expect(loginErrorMessageText).toContain('Please enter your username.');

    await expect(page).toHaveURL('/bank/login');
  });

  test('TC-LOGIN-05: Username field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.fillUsername('admin');
    await loginPage.clickLoginButton();

    const loginErrorMessageText = await loginPage.getLoginErrorMessageText();
    expect(loginErrorMessageText).toContain('Please enter your password.');

    await expect(page).toHaveURL('/bank/login');
    await expect(loginPage.getUsernameInput()).toHaveValue('admin');
  });

  test('TC-LOGIN-06: Password field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.pageLoaded();

    await loginPage.fillPassword('admin123');
    await loginPage.clickLoginButton();

    const loginErrorMessageText = await loginPage.getLoginErrorMessageText();
    expect(loginErrorMessageText).toContain('Please enter your username.');

    await expect(page).toHaveURL('/bank/login');
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

});
