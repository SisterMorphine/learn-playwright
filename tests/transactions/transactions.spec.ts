import { expect, test } from '../../utils/fixtures';
import { TransactionsPage } from '../../pages/TransactionsPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Transactions Features Tests', () => {

    test('TC-TXN-01: Verify Transactions Page Load', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Assert the Transactions table is visible
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();

        // Assert table contains columns like Date, Description, Category, Amount
        const tableHeaders = transactionsTable.getByRole('columnheader');
        await expect(tableHeaders.filter({ hasText: 'Date' })).toBeVisible();
        await expect(tableHeaders.filter({ hasText: 'Description' })).toBeVisible();
        await expect(tableHeaders.filter({ hasText: 'Category' })).toBeVisible();
        await expect(tableHeaders.filter({ hasText: 'Amount' })).toBeVisible();

        const transactionRows = transactionsPage.getTransactionRows();
        const rowsCount = await transactionRows.count();
        expect(rowsCount).toBeGreaterThan(0);

        const firstRow = transactionRows.first();
        await expect(firstRow).toBeVisible();
        await expect(transactionsPage.getTransactionDate(firstRow)).toHaveText(/\S+/);
        await expect(transactionsPage.getTransactionDescription(firstRow)).toHaveText(/\S+/);
        await expect(transactionsPage.getTransactionCategory(firstRow)).toHaveText(/\S+/);
        await expect(transactionsPage.getTransactionAmount(firstRow)).toHaveText(/\$?\d+(\.\d{2})?/);

    });


    test('TC-TXN-02: Verify Account Filter', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Select a specific 'Checking' account from the filter dropdown
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();

        const totalBefore = await transactionsPage.getTransactionRows().count();
        await transactionsPage.selectFilterAccount('Everyday Checking');

        //Assert all visible transactions belong to the selected account
        const rows = transactionsPage.getTransactionRows();
        await expect(rows.first()).toBeVisible();
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await expect(transactionsPage.getTransactionAccount(rows.nth(i))).toHaveText('Everyday Checking');
        }

        await transactionsPage.clickOnResetFiltersButton();
        const countAfter = await transactionsPage.getTransactionRows().count();
        expect(countAfter).toBeGreaterThanOrEqual(totalBefore);


    });

    test('TC-TXN-03: Verify Search Functionality', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Enter 'Transfer' in the search bar
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();

        //Assert all visible transactions contain 'Transfer' in their description or category



    });

    test('TC-TXN-04: Verify Date Sorting', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Click the Date column header
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();

        //Assert transactions are sorted by date ascending

        //Click the Date column header again

        //Assert transactions are sorted by date descending


    });


    test('TC-TXN-05: Verify Pagination', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Assert pagination 'Next' button is enabled if multiple pages exist

        //Click 'Next'

        //Assert the second page of transactions is displayed



    });

    test('TC-TXN-06:Verify Empty State - No transactions message is shown when filters return no results', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Search for a non-existent string like 'XYZ123NonExistent'

        //Assert 'No transactions found' message is displayed


    });

    // test('TC-TXN-03: Filter transactions by date range using calendar date picker', async ({ adminTransactionsPage }) => {
    //     const transactionsPage = new TransactionsPage(adminTransactionsPage);
    //     await transactionsPage.pageLoaded();

    //     const totalBefore = await transactionsPage.getTransactionRows().count();

    //     // FROM: 1st of current month
    //     const dateFromInput = transactionsPage.getInputDateFrom();
    //     await dateFromInput.click();
    //     const calendar = transactionsPage.getCalendar();
    //     await expect(calendar).toBeVisible();
    //     await calendar.locator('button').filter({ hasText: /^1$/ }).first().click();
    //     await expect(dateFromInput).not.toContainText('Pick start date');

    //     // TO: today
    //     const dateToInput = transactionsPage.getInputDateTo();
    //     await dateToInput.click();
    //     await expect(calendar).toBeVisible();
    //     await calendar.getByRole('button', { name: /Today/ }).click();
    //     await expect(dateToInput).not.toContainText('Pick a date');

    //     await transactionsPage.clickOnResetFiltersButton();
    //     await expect(transactionsPage.getTransactionRows()).toHaveCount(totalBefore);
    // });

    // test('TC-TXN-04: Export transactions as CSV and verify file is downloaded', async ({ adminTransactionsPage }) => {
    //     const transactionsPage = new TransactionsPage(adminTransactionsPage);
    //     await transactionsPage.pageLoaded();
    //     await expect(transactionsPage.getTransactionRows().first()).toBeVisible();

    //     const [download] = await Promise.all([
    //         adminTransactionsPage.waitForEvent('download'),
    //         transactionsPage.clickOnDownloadButton()
    //     ]);
    //     expect(download.suggestedFilename()).toMatch(/\.csv$/);
    // });

    // test('TC-TXN-05: Transaction detail page shows all fields and breadcrumb navigation', async ({ adminTransactionsPage }) => {
    //     const transactionsPage = new TransactionsPage(adminTransactionsPage);
    //     await transactionsPage.pageLoaded();

    //     const firstRow = transactionsPage.getTransactionRows().first();
    //     await expect(firstRow).toBeVisible();
    //     const txnId = await firstRow.getByTestId('transaction-id').textContent();

    //     await firstRow.getByTestId('transaction-id-link').click();
    //     await expect(adminTransactionsPage).toHaveURL(/bank\/transactions\/.+/);

    //     await expect(adminTransactionsPage.getByTestId('breadcrumb-item-1')).toContainText('Dashboard');
    //     await expect(adminTransactionsPage.getByTestId('breadcrumb-item-2')).toContainText('Transactions');
    //     await expect(adminTransactionsPage.getByTestId('breadcrumb-item-3')).toContainText(txnId ?? '');

    //     const transactionsDetail = transactionsPage.getTransactionDetailCard();
    //     await expect(transactionsDetail.card).toBeVisible();
    //     await expect(transactionsDetail.type).toContainText(/Deposit|Withdrawal|Transfer/);
    //     await expect(transactionsDetail.amount).toContainText(/\$[\d,]+\.\d{2}/);
    //     await expect(transactionsDetail.datetime).toContainText(/^[A-Z][a-z]{2} \d{1,2}, \d{4}(,| at) \d{2}:\d{2} (AM|PM)$/);
    //     await expect(transactionsDetail.balanceAfter).toContainText(/\$[\d,]+\.\d{2}/);
    //     await expect(transactionsDetail.accountLink).toContainText(/\w+(\s+\w+)*/);
    //     await expect(transactionsDetail.description).toContainText(/.+/);
    //     await expect(transactionsDetail.status).toContainText(/Completed|Pending|Failed/);
    //     await transactionsPage.clickOnBackButton();
    //     await expect(adminTransactionsPage).toHaveURL(/bank\/transactions$/);
    // });

    // test('TC-TXN-06: Verify that the summary displays the correct number of transactions', async ({ adminTransactionsPage }) => {
    //     const transactionsPage = new TransactionsPage(adminTransactionsPage);
    //     await transactionsPage.pageLoaded();

    //     const summaryCount = transactionsPage.getSummaryTransactionsCount()
    //     await expect(summaryCount).toBeVisible();
    //     await expect(summaryCount).toContainText(/\d+ transactions?/);

    //     const summaryCountText = await summaryCount.textContent();
    //     const summaryCountValue = parseInt(summaryCountText ?? '0', 10);

    //     const table = transactionsPage.getTransactionRows();
    //     await expect(table).toBeVisible();
    //     const totalRows = await transactionsPage.getTransactionRows().count();

    //     expect(totalRows).toBeCloseTo(summaryCountValue);

    // });

});
