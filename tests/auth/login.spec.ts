// spec: specs/login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Login Feature Tests', () => {
  test('TC-LOGIN-01: Successful admin login and dashboard access', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // 1. Navigate to the SecureBank login page at https://qaplayground.com/bank
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Enter valid admin credentials (username: 'admin', password: 'admin123')
    await loginPage.usernameInput.fill('admin');
    await loginPage.passwordInput.fill('admin123');

    // 3. Click the Login button
    await loginPage.loginButton.click();

    // Verify dashboard loads successfully
    await dashboardPage.expectLoaded();
  });

  test('TC-LOGIN-02: Successful read-only user login', async ({ page }) => {
    // 1. Navigate to the SecureBank login page at https://qaplayground.com/bank
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Enter valid read-only credentials (username: 'viewer', password: 'viewer123')
    await loginPage.usernameInput.fill('viewer');
    await loginPage.passwordInput.fill('viewer123');

    // 3. Click the Login button
    await loginPage.loginButton.click();

    // Verify dashboard loads successfully for viewer
    await dashboardPage.expectLoaded();
  });

  test('TC-LOGIN-03: Failed login with invalid credentials displays error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to the SecureBank login page
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Enter invalid credentials (username: 'invaliduser', password: 'wrongpassword')
    await loginPage.usernameInput.fill('invaliduser');
    await loginPage.passwordInput.fill('wrongpassword');


    // 3. Click the Login button
    await loginPage.loginButton.click();

    // Verify user stays on login page and form retains values
    await loginPage.expectLoaded();
    await expect(page.getByTestId('username-input')).toHaveValue('invaliduser');
    await expect(page.getByTestId('password-input')).toHaveValue('wrongpassword');
  });

  test('TC-LOGIN-04: Empty form validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to the SecureBank login page
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Click the Login button without entering any credentials
    await loginPage.loginButton.click();

    // Verify validation messages appear
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();

    // Verify user remains on login page
    await expect(page).toHaveURL('https://qaplayground.com/bank');
  });

  test('TC-LOGIN-05: Username field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to the SecureBank login page
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Enter only username and leave password empty
    await loginPage.usernameInput.fill('admin');


    // 3. Click the Login button
    await loginPage.loginButton.click();

    // Verify password validation message appears
    await expect(page.locator('text=Password is required')).toBeVisible();

    // Verify user remains on login page
    await expect(page).toHaveURL('https://qaplayground.com/bank');
    await expect(page.getByTestId('username-input')).toHaveValue('admin');
  });

  test('TC-LOGIN-06: Password field only validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to the SecureBank login page
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Leave username empty and enter only password
    await loginPage.passwordInput.fill('admin123');

    // 3. Click the Login button
    await loginPage.loginButton.click();

    // Verify username validation message appears
    await expect(loginPage.usernameErrorMessage).toBeVisible();
    await expect(loginPage.usernameErrorMessage).toContainText('Username is required');

    // Verify user remains on login page
    await expect(loginPage)
    await expect(page).toHaveURL('https://qaplayground.com/bank');
  });

  test('TC-LOGIN-07: Password visibility toggle functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to the SecureBank login page
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Enter a password in the password field
    await loginPage.passwordInput.fill('admin123');

    // Verify toggle button is visible
    await expect(page.getByTestId('toggle-password-btn')).toBeVisible();

    // 3. Click the 'Toggle password visibility' button
    await page.getByTestId('toggle-password-btn').click();

    // Verify password is now visible as plain text
    const passwordInput = page.getByTestId('password-input');
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 4. Click the toggle button again
    await page.getByTestId('toggle-password-btn').click();

    // Verify password is masked again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });


  test('TC-LOGIN-08: Clear form button functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to the SecureBank login page
    await loginPage.goto();
    await expect((loginPage.usernameInput)).toBeVisible();
    await expect((loginPage.passwordInput)).toBeVisible();
    await expect((loginPage.loginButton)).toBeVisible();

    // 2. Enter credentials in both fields
    await loginPage.usernameInput.fill('admin');
    await loginPage.passwordInput.fill('admin123');

    // Verify credentials are entered
    await expect(page.getByTestId('username-input')).toHaveValue('admin');

    // 3. Click the Clear button
    await page.getByTestId('clear-button').click();

    // Verify form is cleared
    await expect(page.getByTestId('username-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
  });
});
