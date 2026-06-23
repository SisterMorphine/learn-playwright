// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Login Feature Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    // 1. Navigate to the SecureBank login page at https://qaplayground.com/bank
    await loginPage.goto();
    await loginPage.expectLoaded();
  });

  test('TC-LOGIN-01: Successful admin login and dashboard access', async ({ page }) => {
    // 1. Enter valid admin credentials (username: 'admin', password: 'admin123')
    await loginPage.usernameInput.fill('admin');
    await loginPage.passwordInput.fill('admin123');

    // 2. Click the Login button
    await loginPage.loginButton.click();

    // Verify dashboard loads successfully
    await dashboardPage.expectLoaded();
  });

  test('TC-LOGIN-02: Successful read-only user login', async ({ page }) => {

    // 1. Enter valid read-only credentials (username: 'viewer', password: 'viewer123')
    await loginPage.usernameInput.fill('viewer');
    await loginPage.passwordInput.fill('viewer123');

    // 2. Click the Login button
    await loginPage.loginButton.click();

    // Verify dashboard loads successfully for viewer
    await dashboardPage.expectLoaded();
  });

  test('TC-LOGIN-03: Failed login with invalid credentials displays error', async ({ page }) => {

    // 1. Enter invalid credentials (username: 'invaliduser', password: 'wrongpassword')
    await loginPage.usernameInput.fill('invaliduser');
    await loginPage.passwordInput.fill('wrongpassword');


    // 2. Click the Login button
    await loginPage.loginButton.click();

    // Verify user stays on login page and form retains values
    await loginPage.expectLoaded();
    await expect(page.getByTestId('username-input')).toHaveValue('invaliduser');
    await expect(page.getByTestId('password-input')).toHaveValue('wrongpassword');
  });

  test('TC-LOGIN-04: Empty form validation', async ({ page }) => {

    // 1. Click the Login button without entering any credentials
    await loginPage.loginButton.click();

    // Verify validation messages appear
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();

    // Verify user remains on login page
    await expect(page).toHaveURL('/bank');
  });

  test('TC-LOGIN-05: Username field only validation', async ({ page }) => {

    // 1. Enter only username and leave password empty
    await loginPage.usernameInput.fill('admin');


    // 2. Click the Login button
    await loginPage.loginButton.click();

    // Verify password validation message appears
    await expect(page.locator('text=Password is required')).toBeVisible();

    // Verify user remains on login page
    await expect(page).toHaveURL('/bank');
    await expect(page.getByTestId('username-input')).toHaveValue('admin');
  });

  test('TC-LOGIN-06: Password field only validation', async ({ page }) => {

    // 1. Leave username empty and enter only password
    await loginPage.passwordInput.fill('admin123');

    // 2. Click the Login button
    await loginPage.loginButton.click();

    // Verify username validation message appears
    await expect(loginPage.usernameErrorMessage).toBeVisible();
    await expect(loginPage.usernameErrorMessage).toContainText('Username is required');

    // Verify user remains on login page
    await loginPage.expectLoaded();
  });

  test('TC-LOGIN-07: Password visibility toggle functionality', async ({ page }) => {

    // 1. Enter a password in the password field
    await loginPage.passwordInput.fill('admin123');

    // Verify toggle button is visible
    await expect(page.getByTestId('toggle-password-btn')).toBeVisible();

    // 2. Click the 'Toggle password visibility' button
    await page.getByTestId('toggle-password-btn').click();

    // Verify password is now visible as plain text
    const passwordInput = page.getByTestId('password-input');
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 3. Click the toggle button again
    await page.getByTestId('toggle-password-btn').click();

    // Verify password is masked again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });


  test('TC-LOGIN-08: Clear form button functionality', async ({ page }) => {

    // 1. Enter credentials in both fields
    await loginPage.usernameInput.fill('admin');
    await loginPage.passwordInput.fill('admin123');

    // Verify credentials are entered
    await expect(page.getByTestId('username-input')).toHaveValue('admin');

    // 2. Click the Clear button
    await page.getByTestId('clear-button').click();

    // Verify form is cleared
    await expect(page.getByTestId('username-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
  });
});
