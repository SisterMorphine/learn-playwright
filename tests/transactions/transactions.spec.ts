import { expect, test } from '../../utils/fixtures';
import { TransactionsPage } from '../../pages/TransactionsPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe.serial('Transactions Features Tests', () => {

    test('TC-TXN-01: Create a deposit transaction and verify balance update', async ({ adminAccountsPage }) => {
        //Go to Accounts page and get the first account, save the name and the balance
        const accountsPage = new AccountsPage(adminAccountsPage);
        await accountsPage.pageLoaded();

        await adminAccountsPage.locator('td').filter({ hasText: /\$/ }).first().waitFor();
        const primarySavingsRow = accountsPage.getFirstAccountRow();

        await expect(primarySavingsRow).toBeVisible();
        const balanceBefore = parseFloat(
            (await primarySavingsRow.locator('td').nth(3).textContent() ?? '').replace(/[^0-9.]/g, '')
        );
        const accountName = await accountsPage.getAccountNameFromRow(primarySavingsRow);

        const transactionsPage = new TransactionsPage(adminAccountsPage);
        if (!accountName) throw new Error('Failed to read account name');

        await transactionsPage.createTransaction('Deposit', accountName, '500');

        const transactionModal = transactionsPage.getNewTransactionModal();
        await expect(transactionModal.modal).toBeHidden();

        await expect(adminAccountsPage.getByText(/success/i).first()).toBeVisible();
        await expect(transactionsPage.getTransactionRows().first()).toBeVisible();

        await adminAccountsPage.goto('/bank/accounts');
        await adminAccountsPage.locator('td').filter({ hasText: /\$/ }).first().waitFor();
        const balanceAfter = parseFloat(
            (await accountsPage.getAccountRowByName(accountName).locator('td').nth(3).textContent() ?? '').replace(/[^0-9.]/g, '')
        );
        expect(balanceAfter).toBeCloseTo(balanceBefore + 500, 2);
    });

    test('TC-TXN-02: Filter transactions by account and verify only matching rows appear', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const totalBefore = await transactionsPage.getTransactionRows().count();

        await transactionsPage.selectFilterAccount('Primary Savings');
        await transactionsPage.clickOnApplyFilterButton();

        const rows = transactionsPage.getTransactionRows();
        await expect(rows.first()).toBeVisible();
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await expect(rows.nth(i).getByTestId('transaction-account')).toHaveText('Primary Savings');
        }

        await transactionsPage.clickOnResetFiltersButton();
        const countAfter = await transactionsPage.getTransactionRows().count();
        expect(countAfter).toBeGreaterThanOrEqual(totalBefore);
    });

    test('TC-TXN-03: Filter transactions by date range using calendar date picker', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const totalBefore = await transactionsPage.getTransactionRows().count();

        // FROM: 1st of current month
        const dateFromInput = transactionsPage.getInputDateFrom();
        await dateFromInput.click();
        const calendar = transactionsPage.getCalendar();
        await expect(calendar).toBeVisible();
        await calendar.locator('button').filter({ hasText: /^1$/ }).first().click();
        await expect(dateFromInput).not.toContainText('Pick start date');

        // TO: today
        const dateToInput = transactionsPage.getInputDateTo();
        await dateToInput.click();
        await expect(calendar).toBeVisible();
        await calendar.getByRole('button', { name: /Today/ }).click();
        await expect(dateToInput).not.toContainText('Pick a date');

        await transactionsPage.clickOnApplyFilterButton();
        await transactionsPage.clickOnResetFiltersButton();
        await expect(transactionsPage.getTransactionRows()).toHaveCount(totalBefore);
    });

    test('TC-TXN-04: Export transactions as CSV and verify file is downloaded', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();
        await expect(transactionsPage.getTransactionRows().first()).toBeVisible();

        const toastVisible = expect(adminTransactionsPage.getByText('Transactions exported successfully!')).toBeVisible();
        const [download] = await Promise.all([
            adminTransactionsPage.waitForEvent('download'),
            transactionsPage.clickOnDownloadButton()
        ]);
        await toastVisible;
        expect(download.suggestedFilename()).toMatch(/\.csv$/);
    });

    test('TC-TXN-05: Transaction detail page shows all fields and breadcrumb navigation', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const firstRow = transactionsPage.getTransactionRows().first();
        await expect(firstRow).toBeVisible();
        const txnId = await firstRow.getByTestId('transaction-id').textContent();

        await firstRow.getByTestId('transaction-id-link').click();
        await expect(adminTransactionsPage).toHaveURL(/bank\/transactions\/.+/);

        await expect(adminTransactionsPage.getByTestId('breadcrumb-item-1')).toContainText('Dashboard');
        await expect(adminTransactionsPage.getByTestId('breadcrumb-item-2')).toContainText('Transactions');
        await expect(adminTransactionsPage.getByTestId('breadcrumb-item-3')).toContainText(txnId ?? '');

        const transactionsDetail = transactionsPage.getTransactionDetailCard();
        await expect(transactionsDetail.card).toBeVisible();
        await expect(transactionsDetail.type).toContainText(/Deposit|Withdrawal|Transfer/);
        await expect(transactionsDetail.amount).toContainText(/\$[\d,]+\.\d{2}/);
        await expect(transactionsDetail.datetime).toContainText(/^[A-Z][a-z]{2} \d{1,2}, \d{4}(,| at) \d{2}:\d{2} (AM|PM)$/);
        await expect(transactionsDetail.balanceAfter).toContainText(/\$[\d,]+\.\d{2}/);
        await expect(transactionsDetail.accountLink).toContainText(/\w+(\s+\w+)*/);
        await expect(transactionsDetail.description).toContainText(/.+/);
        await expect(transactionsDetail.status).toContainText(/Completed|Pending|Failed/);
        await transactionsPage.clickOnBackButton();
        await expect(adminTransactionsPage).toHaveURL(/bank\/transactions$/);
    });

    test('TC-TXN-06: Verify that the summary displays the correct number of transactions', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const summaryCount = transactionsPage.getSummaryTransactionsCount()
        await expect(summaryCount).toBeVisible();
        await expect(summaryCount).toContainText(/\d+ transactions?/);

        const summaryCountText = await summaryCount.textContent();
        const summaryCountValue = parseInt(summaryCountText ?? '0', 10);

        const table = transactionsPage.getTransactionRows();
        await expect(table).toBeVisible();
        const totalRows = await transactionsPage.getTransactionRows().count();

        expect(totalRows).toBeCloseTo(summaryCountValue);

    });

});
