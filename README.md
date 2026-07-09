# Learn Playwright – Test Automation Practice

This repository is a **learning and practice project** I am building while getting hands-on experience with **Playwright**.

The goal of this project is not to create a production-ready test suite, but to:
- Learn Playwright fundamentals
- Apply good automation practices incrementally
- Experiment, refactor, and evolve tests as my knowledge grows

---

## 🎯 Project Goals

- Learn Playwright using realistic web applications and APIs
- Practice UI automation concepts such as:
  - Page Object Model (POM)
  - Custom fixtures with dependency chaining
  - Stable selectors (role, testid, text)
  - Happy and unhappy paths
  - End‑to‑end flows
- Practice API testing concepts:
  - Response validation
  - Pagination handling
  - Multiple API endpoints
- Build a personal reference project I can iterate on over time

---

## 🌐 Application Under Test

### UI Testing
This project uses **QA Playground**, specifically the **Bank Demo application** (`https://qaplayground.com/bank`), as a testing target.

The Bank Demo provides:
- Login and authentication scenarios (admin / viewer roles)
- Dashboard with stat cards, pinned accounts, and quick actions
- Accounts management (create, edit, delete, filter, sort)
- Transactions (create, filter by account/type/date, CSV export, detail view)

### API Testing
- **Cat Facts API** (`catfact.ninja`) – Paginated responses, data validation
- **Cat API** (`api.thecatapi.com`) – Favourites and image search (requires `CAT_API_KEY` in `.env`)

---

## 🧪 Tech Stack

- **Playwright**
- **TypeScript**
- **Node.js**
- **ESLint** (with `typescript-eslint` and `eslint-plugin-playwright`)
- **GitHub Actions** (CI)

---

## 📁 Project Structure

```text
.
├── tests/                          # Test files organized by feature
│   ├── api/
│   │   ├── catfacts.spec.ts        # Cat Facts API – pagination, data validation
│   │   ├── catfavourites.spec.ts   # Cat API – favourites endpoint
│   │   └── catimages.spec.ts       # Cat API – image search
│   ├── auth/
│   │   ├── auth.setup.ts           # Playwright setup project (saves storage state)
│   │   └── login.spec.ts           # Login happy/unhappy paths
│   ├── accounts/
│   │   └── accounts.spec.ts        # Accounts CRUD, filter, sort
│   ├── dashboard/
│   │   └── dashboard.spec.ts       # Stat cards, quick actions, drag-and-drop
│   └── transactions/
│       └── transactions.spec.ts    # Create, filter, export, detail view
│
├── pages/                          # Page Object Model classes
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── AccountsPage.ts
│   └── TransactionsPage.ts
│
├── utils/
│   ├── fixtures.ts                 # Custom test fixtures (adminPage → adminDashboardPage, etc.)
│   └── testData.ts                 # Shared test data and endpoints
│
├── playwright.config.ts
├── CLAUDE.md                       # Guidance for Claude Code AI assistant
└── README.md
```

---

## ▶️ Running the Tests Locally

Install dependencies (first time only):

```bash
npm install
npx playwright install
```

Run all tests:
```bash
npx playwright test
```

Run a single spec file:
```bash
npx playwright test tests/dashboard/dashboard.spec.ts
```

Run a single test by name:
```bash
npx playwright test --grep "TC-DASH-02"
```

Run against a specific browser:
```bash
npx playwright test --project=chromium
```

View the HTML report:
```bash
npx playwright show-report
```

Run ESLint:
```bash
npx eslint .
```

---

## 📝 Notes

This is a learning project — tests will be added, removed, and refactored frequently.
Some patterns may change as I explore better approaches.
The focus is on learning and hands‑on practice, not completeness.
