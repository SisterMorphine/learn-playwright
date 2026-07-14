import { expect, test } from '../../utils/fixtures';
import { DashboardPage } from '../../pages/DashboardPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Dashboard Features Tests', () => {
    test('TC-DASH-01: Verify dashboard loads successfully with welcome message', async ({ adminPage }) => {
        const dashboardPage = new DashboardPage(adminPage);

        expect(dashboardPage.pageLoaded());
        await expect(dashboardPage.dashboardWelcomeMessage).toBeVisible();
        await expect(dashboardPage.dashboardWelcomeMessage).toContainText(/^Welcome back,\s*([^\r\n]+?)\s*$/);
    });

    test('TC-DASH-02: Verify Total Balance Display', async ({ adminPage }) => {
        const dashboardPage = new DashboardPage(adminPage);

        expect(dashboardPage.pageLoaded());
        await expect(dashboardPage.newTotalBalanceCard).toBeVisible();
        await expect(dashboardPage.newTotalBalanceCard).toContainText('$');

        const dashboardbalance = parseFloat(
            (await dashboardPage.newTotalBalanceCard.textContent() ?? '').replace(/[^0-9.]/g, '')
        );

        await adminPage.goto('/bank/accounts');
        const accountsPage = new AccountsPage(adminPage); 
        expect(accountsPage.pageLoaded()); 
        await adminPage.locator('td').filter({ hasText: /\$/ }).first().waitFor();


        const rows = await adminPage.getByTestId('account-row').all(); 
        let accountsTotal = 0;
        for (let i = 0; i < rows.length; i++) {
            const balanceCell=  rows[i].getByTestId('account-row-balance')

            // Extract text from the fourthcolumn of each row
            const balanceText = await balanceCell.textContent() ?? '0';
            const balanceValue = parseFloat(balanceText.replace(/[^0-9.-]/g, ''));
            accountsTotal += balanceValue;
        }
        expect(accountsTotal).toBeCloseTo(dashboardbalance, 2);
    });


    // test('TC-DASH-01: Verify dashboard cards display correctly for an admin role', async ({ adminPage }) => {
    //     const dashboardPage = new DashboardPage(adminPage);

    //     //expect total balance card to be visible and contain a dollar sign
    //     await expect(dashboardPage.newTotalBalanceCard).toBeVisible();
    //     await expect(dashboardPage.newTotalBalanceCard).toContainText('$');

    //     //assert that the accounts count is a number    
    //     await expect(dashboardPage.activeAccountsCard).toBeVisible();
    //     await expect(dashboardPage.accountsCount).toBeVisible();
    //     await expect(dashboardPage.accountsCount).toContainText(/^\d+$/);

    //     //assert that the transactions count is a number                                                
    //     await expect(dashboardPage.totalTransactionsCard).toBeVisible();
    //     await expect(dashboardPage.transactionsCount).toBeVisible();
    //     await expect(dashboardPage.transactionsCount).toContainText(/^\d+$/);
    // });

    // test('TC-DASH-02: Stat card values match actual account and transactions data', async ({ adminPage }) => {
    //     const dashboardPage = new DashboardPage(adminPage);

    //     // Poll until the total-balance value stops changing — count-up animation runs after data loads
    //     await expect(dashboardPage.totalBalanceCard).toBeVisible();
    //     let dashboardBalance = 0;
    //     await expect.poll(async () => {
    //         const prev = dashboardBalance;
    //         dashboardBalance = parseFloat(
    //             (await dashboardPage.totalBalanceCard.textContent() ?? '').replace(/[^0-9.]/g, '')
    //         );
    //         return dashboardBalance > 0 && dashboardBalance === prev;
    //     }, { intervals: [300, 300, 300, 300, 300, 300], timeout: 10000 }).toBe(true);

    //     // Navigate to accounts page
    //     await adminPage.goto('/bank/accounts');
    //     // Wait for actual balance data to load — skeleton rows appear first with empty cells.
    //     // Match both positive ($2,500.00) and negative (-$4,125.00) balance cells.
    //     await adminPage.locator('td').filter({ hasText: /\$/ }).first().waitFor();

    //     const rows = await adminPage.getByRole('row').all();
    //     // Skip index 0 if the first row contains table headers (th)
    //     let accountsTotal = 0;
    //     for (let i = 1; i < rows.length; i++) {
    //         const balanceCell = await rows[i].locator('td').all();

    //         // Extract text from the fourthcolumn of each row
    //         const balanceText = await balanceCell[3].textContent() ?? '0';
    //         const balanceValue = parseFloat(balanceText.replace(/[^0-9.-]/g, ''));
    //         accountsTotal += balanceValue;
    //     }
    //     expect(accountsTotal).toBeCloseTo(dashboardBalance, 2);
    // });

    // test('TC-DASH-03: Quick actions navigate to correct pages', async ({ adminPage }) => {
    //     const dashboardPage = new DashboardPage(adminPage);
    //     await expect(dashboardPage.quickActions.addAccount).toBeVisible();
    //     await expect(dashboardPage.quickActions.newTransaction).toBeVisible();
    //     await expect(dashboardPage.quickActions.viewAllAccounts).toBeVisible();

    //     await dashboardPage.clickQuickAction('addAccount');
    //     await expect(adminPage.getByTestId('account-modal')).toBeVisible(); // Verify that the accounts page is displayed
    //     await expect(adminPage).toHaveURL(/bank\/accounts/);

    //     await adminPage.goBack();

    //     await dashboardPage.clickQuickAction('newTransaction');
    //     await expect(adminPage.getByTestId('transaction-modal')).toBeVisible(); // Verify that the transactions modal  is displayed
    //     await expect(adminPage).toHaveURL(/bank\/transactions/);

    // });

    // test('TC-DASH-04: Recent transactions table display up to 5 transactions', async ({ adminPage }) => {
    //     const dashboardPage = new DashboardPage(adminPage);
    //     await expect(dashboardPage.recentTransactionsTable).toBeVisible();
    //     await expect(dashboardPage.recentTransactionsTableBody).toBeVisible();
    //     //assert that the recent transactions table displays up to 5 transactions   
    //     const rows = dashboardPage.recentTransactionsTable.locator('tbody tr');
    //     const rowCount = await rows.count();
    //     expect(rowCount).toBeLessThanOrEqual(5);

    // });

    // test('TC-DASH-05: Pinned Accounts section supports drag and drop reordering', async ({ adminPage }) => {
    //     //Locate the Pinned Accounts section: data-testid='pinned-accounts-section'
    //     const pinnedAccountsSection = adminPage.getByTestId('pinned-accounts-section');
    //     await expect(pinnedAccountsSection).toBeVisible();

    //     const pinnedAccountsDropZone = adminPage.getByTestId('drop-zone');
    //     await expect(pinnedAccountsDropZone).toBeVisible();

    //     //Locate the draggable account items within the Pinned Accounts section: data-testid'pinned-account-item'
    //     const pinnedAccountItems = adminPage.locator('[draggable="true"]').and(adminPage.locator('[data-testid^="draggable-account"]'));

    //     const itemCount = await pinnedAccountItems.count();
    //     expect(itemCount).toBeGreaterThan(0);

    //     // Capture order before drag
    //     const firstTextBefore = await pinnedAccountItems.nth(0).textContent();

    //     await pinnedAccountItems.nth(0).dragTo(pinnedAccountItems.nth(itemCount - 1));

    //     // After dragging item 0 to last position: first slot changes, last slot holds what was first
    //     const firstTextAfter = await pinnedAccountItems.nth(0).textContent();
    //     const lastTextAfter = await pinnedAccountItems.nth(itemCount - 1).textContent();

    //     expect(firstTextAfter).not.toBe(firstTextBefore);
    //     expect(lastTextAfter).toBe(firstTextBefore);
    // });
});