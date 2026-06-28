import { Page, Locator, expect } from '@playwright/test';

export class TransactionsPage {
    readonly page: Page;
    readonly filterAccountSelect: Locator;
    readonly filterTypeSelect: Locator;
    readonly dateFromInput: Locator;
    readonly dateToInput: Locator;
    readonly applyFiltersButton: Locator;
    readonly resetFiltersButton: Locator;
    readonly exportButton: Locator;
    readonly summaryBar: Locator;
    readonly transactionsTable: Locator;
    readonly transactionsTbody: Locator;
    readonly newTransactionButton: Locator;
    readonly newTransactionModal: {
        modal: Locator;
        transactionTypeSelect: Locator;
        fromAccountSelect: Locator;
        amountInput: Locator;
        descriptionInput: Locator;
        submitButton: Locator;
        cancelButton: Locator;
    };
    readonly breadcrumb: Locator;
    readonly backButton: Locator;
    readonly detail: {
        card: Locator;
        type: Locator;
        id: Locator;
        status: Locator;
        amount: Locator;
        datetime: Locator;
        accountLink: Locator;
        balanceAfter: Locator;
        description: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.filterAccountSelect = page.getByTestId('filter-account-select');
        this.filterTypeSelect = page.getByTestId('filter-transaction-type-select');
        this.dateFromInput = page.getByTestId('date-from-input');
        this.dateToInput = page.getByTestId('date-to-input');
        this.applyFiltersButton = page.getByTestId('apply-filters-button');
        this.resetFiltersButton = page.getByTestId('reset-filters-button');
        this.exportButton = page.getByTestId('export-button');
        this.summaryBar = page.getByTestId('transactions-summary-bar');
        this.transactionsTable = page.getByTestId('transactions-table');
        this.transactionsTbody = page.getByTestId('transactions-tbody');
        this.newTransactionButton = page.getByTestId('new-transaction-button');
        this.newTransactionModal = {
            modal: page.getByTestId('transaction-modal'),
            transactionTypeSelect: page.getByTestId('transaction-type-select'),
            fromAccountSelect: page.getByTestId('from-account-select'),
            amountInput: page.getByTestId('transaction-amount-input'),
            descriptionInput: page.getByTestId('transaction-description-input'),
            submitButton: page.getByTestId('submit-transaction-button'),
            cancelButton: page.getByTestId('cancel-transaction-button'),
        };
        this.breadcrumb = page.getByTestId('breadcrumb');
        this.backButton = page.getByTestId('back-button');
        this.detail = {
            card: page.getByTestId('transaction-detail-card'),
            type: page.getByTestId('transaction-detail-type'),
            id: page.getByTestId('transaction-detail-id'),
            status: page.getByTestId('transaction-detail-status'),
            amount: page.getByTestId('transaction-detail-amount'),
            datetime: page.getByTestId('transaction-detail-datetime'),
            accountLink: page.getByTestId('transaction-detail-account-link'),
            balanceAfter: page.getByTestId('transaction-detail-balance-after'),
            description: page.getByTestId('transaction-detail-description'),
        };
    }

    async pageLoaded() {
        await expect(this.page).toHaveURL(/bank\/transactions/);
        await expect(this.transactionsTable).toBeVisible();
    }

    getTransactionRows(): Locator {
        return this.transactionsTbody.getByTestId('transaction-row');
    }

    async selectFilterAccount(value: string) {
        await this.filterAccountSelect.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    async selectFilterType(value: string) {
        await this.filterTypeSelect.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    async createTransaction(type: string, account: string, amount: string) {
        await this.page.goto('/bank/transactions?action=new');
        await expect(this.newTransactionModal.modal).toBeVisible();
        await this.newTransactionModal.transactionTypeSelect.click();
        await this.page.getByRole('option', { name: type }).click();
        await this.newTransactionModal.fromAccountSelect.click();
        await this.page.getByRole('option', { name: account }).click();
        await this.newTransactionModal.amountInput.fill(amount);
        await this.newTransactionModal.submitButton.click();
    }
}
