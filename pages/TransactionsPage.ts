import { Page, Locator, expect } from '@playwright/test';

type NewTransactionModal = {
    modal: Locator;
    transactionTypeSelect: Locator;
    fromAccountSelect: Locator;
    amountInput: Locator;
    descriptionInput: Locator;
    submitButton: Locator;
    cancelButton: Locator;
};

type TransactionDetails = {
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

export class TransactionsPage {
    private readonly page: Page;
    private readonly filterAccountSelect: Locator;
    private readonly filterTypeSelect: Locator;
    private readonly dateFromInput: Locator;
    private readonly dateToInput: Locator;
    private readonly calendar: Locator;
    private readonly applyFiltersButton: Locator;
    private readonly resetFiltersButton: Locator;
    private readonly exportButton: Locator;
    private readonly summaryBar: Locator;
    private readonly transactionsTable: Locator;
    private readonly transactionsTbody: Locator;
    private readonly newTransactionModal: NewTransactionModal;
    private readonly backButton: Locator;
    private readonly transactionDetail: TransactionDetails;
    private readonly summmaryTransactionsCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.filterAccountSelect = page.getByTestId('filter-account-select');
        this.filterTypeSelect = page.getByTestId('filter-transaction-type-select');
        this.dateFromInput = page.getByTestId('date-from-input');
        this.dateToInput = page.getByTestId('date-to-input');
        this.calendar = page.locator('[data-testid="date-picker-calendar"][data-state="open"]')
        this.applyFiltersButton = page.getByTestId('apply-filters-button');
        this.resetFiltersButton = page.getByTestId('reset-filters-button');
        this.exportButton = page.getByTestId('export-button');
        this.summaryBar = page.getByTestId('transactions-summary-bar');
        this.transactionsTable = page.getByTestId('transactions-table');
        this.transactionsTbody = page.getByTestId('transactions-tbody');
        this.newTransactionModal = {
            modal: page.getByTestId('transaction-modal'),
            transactionTypeSelect: page.getByTestId('transaction-type-select'),
            fromAccountSelect: page.getByTestId('from-account-select'),
            amountInput: page.getByTestId('transaction-amount-input'),
            descriptionInput: page.getByTestId('transaction-description-input'),
            submitButton: page.getByTestId('submit-transaction-button'),
            cancelButton: page.getByTestId('cancel-transaction-button'),
        };
        this.backButton = page.getByTestId('back-button');
        this.transactionDetail = {
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
        this.summmaryTransactionsCount = this.summaryBar.locator('#summary-count');
    }

    public async pageLoaded() {
        await expect(this.page).toHaveURL(/bank\/transactions/);
        await expect(this.transactionsTable).toBeVisible();
    }

    public async clickOnFiltersButton() {
        const filtersButton = this.page.getByTestId('filters-button');
        await expect(filtersButton).toBeVisible();
        await filtersButton.click();
    }

    public getNewTransactionModal(): NewTransactionModal {
        const transactionModal = this.newTransactionModal;
        transactionModal.modal = this.newTransactionModal.modal;
        transactionModal.transactionTypeSelect = this.newTransactionModal.transactionTypeSelect
        transactionModal.fromAccountSelect = this.newTransactionModal.fromAccountSelect
        transactionModal.amountInput = this.newTransactionModal.amountInput
        transactionModal.descriptionInput = this.newTransactionModal.descriptionInput
        transactionModal.submitButton = this.newTransactionModal.submitButton
        transactionModal.cancelButton = this.newTransactionModal.cancelButton
        return this.newTransactionModal;
    }

    public getSummaryTransactionsCount(): Locator {
        return this.summmaryTransactionsCount;
    }

    public getTransactionDetailCard(): TransactionDetails {
        const transactionDetail = this.transactionDetail;
        transactionDetail.card = this.transactionDetail.card;
        transactionDetail.type = this.transactionDetail.type;
        transactionDetail.id = this.transactionDetail.id;
        transactionDetail.status = this.transactionDetail.status;
        transactionDetail.amount = this.transactionDetail.amount;
        transactionDetail.datetime = this.transactionDetail.datetime;
        transactionDetail.accountLink = this.transactionDetail.accountLink;
        transactionDetail.balanceAfter = this.transactionDetail.balanceAfter;
        transactionDetail.description = this.transactionDetail.description;
        return this.transactionDetail;
    }

    public getTransactionRows(): Locator {
        return this.transactionsTbody.getByTestId('transaction-row');
    }

    public getCalendar(): Locator {
        return this.calendar;
    }

    public getInputDateFrom(): Locator {
        return this.dateFromInput;
    }

    public getInputDateTo(): Locator {
        return this.dateToInput;
    }

    public async clickOnResetFiltersButton() {
        await this.resetFiltersButton.click();
    }

    public async clickOnApplyFilterButton() {
        await this.applyFiltersButton.click();
    }

    public async clickOnDownloadButton() {
        await this.exportButton.click();
    }

    public async clickOnBackButton() {
        await this.backButton.click();
    }

    public async selectFilterAccount(value: string) {
        await this.filterAccountSelect.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    public async selectFilterType(value: string) {
        await this.filterTypeSelect.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    public async createTransaction(type: string, account: string, amount: string) {
        await this.page.goto('/bank/transactions?action=new');
        await expect(this.newTransactionModal.modal).toBeVisible();
        await this.newTransactionModal.transactionTypeSelect.click();
        await this.page.getByRole('option', { name: type }).click();
        await this.newTransactionModal.fromAccountSelect.click();
        await this.page.getByRole('option', { name: account }).click();
        await this.newTransactionModal.amountInput.fill(amount);
        await this.newTransactionModal.submitButton.click();
        await expect(this.newTransactionModal.modal).not.toBeVisible();
    }
}
