import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly passwordErrorMessage: Locator;
    readonly usernameErrorMessage: Locator;
    readonly togglePasswordButton: Locator;
    readonly clearButton: Locator;
    readonly loginAlert: Locator;   

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId('username-input');
        this.passwordInput = page.getByTestId('password-input');
        this.loginButton = page.getByTestId('login-button');
        this.passwordErrorMessage = page.getByTestId('password-error');
        this.usernameErrorMessage = page.getByTestId('username-error');
        this.togglePasswordButton = page.getByTestId('toggle-password-btn');
        this.clearButton = page.getByTestId('clear-button');
        this.loginAlert = page.getByTestId('login-alert');
    }

    async goto() {
        await this.page.goto('/bank');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async pageLoaded() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async togglePasswordVisibility() {                                                                                      
        await this.togglePasswordButton.click();
    }   


}