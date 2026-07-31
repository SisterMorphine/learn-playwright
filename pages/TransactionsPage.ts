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
    private readonly resetFiltersButton: Locator;
    private readonly transactionsTable: Locator;
    private readonly transactionDetail: TransactionDetails;
    private readonly searchInput: Locator; 
    private readonly emptyResultsMessage: Locator; 

    constructor(page: Page) {
        this.page = page;
        this.filterAccountSelect = page.getByTestId('all-txn-account-select');
        this.filterTypeSelect = page.getByTestId('filter-transaction-type-select');
        this.resetFiltersButton = page.getByTestId('clear-all-txn-filters-btn');
        this.transactionsTable = page.getByRole('table', { name: 'All account transactions' });
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
        this.searchInput = page.getByTestId('all-txn-search-input'); 
        this.emptyResultsMessage = page.getByTestId('no-all-transactions-message'); 
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

    public async search(searchCriteria: string) {
        const searchInput = this.searchInput
        await expect(searchInput).toBeVisible();
        await searchInput.fill(searchCriteria); 
    }

    public get getTransactionsTable(): Locator{ 
        return this.transactionsTable; 
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
        return this.transactionsTable.getByTestId('all-txn-row');
    }

    public getTransactionDate(row: Locator): Locator {
        return row.getByTestId('all-txn-date');
    }

    // Account cell has no data-testid — fall back to column position (Date, Account, Description, Category, Amount).
    public getTransactionAccount(row: Locator): Locator {
        return row.getByRole('cell').nth(1);
    }

    public getTransactionDescription(row: Locator): Locator {
        return row.getByTestId('all-txn-description');
    }

    public getTransactionCategory(row: Locator): Locator {
        return row.getByTestId('all-txn-category-badge');
    }

    public getTransactionAmount(row: Locator): Locator {
        return row.getByTestId('all-txn-amount');
    }

    public getEmptySearchResultsMessage(): Locator {
        return this.emptyResultsMessage; 
    }

    public async clickOnResetFiltersButton() {
        await this.resetFiltersButton.click();
    }

    public async selectFilterAccount(value: string) {
        await this.filterAccountSelect.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    public async selectFilterType(value: string) {
        await this.filterTypeSelect.click();
        await this.page.getByRole('option', { name: value }).click();
    }
}
