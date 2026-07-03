import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly passwordErrorMessage: Locator;
    private readonly usernameErrorMessage: Locator;
    private readonly togglePasswordButton: Locator;
    private readonly clearButton: Locator;
    private readonly loginAlert: Locator;   

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

    public async goto() {
        await this.page.goto('/bank');
    }
    
    public getUsernameInput(): Locator {
        return this.usernameInput;
    }
    
    public getPasswordInput(): Locator {
        return this.passwordInput;
    }       

    public getLoginAlert(): Locator {                                                                  
        return this.loginAlert;
    }

    public getPasswordErrorMessage(): Locator {
        return this.passwordErrorMessage;
    }

    public getUsernameErrorMessage(): Locator {
        return this.usernameErrorMessage;
    }

    public getTogglePasswordButton(): Locator {
        return this.togglePasswordButton;
    }

    public async clickLoginButton() {
        await this.loginButton.click();
    }

    public async clickClearButton() {
        await this.clearButton.click();
    }

    public async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    public async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    public async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    public async pageLoaded() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    public async togglePasswordVisibility() {                                                                                      
        await this.togglePasswordButton.click();
    }
}
    