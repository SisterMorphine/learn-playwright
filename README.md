# Learn Playwright – Test Automation Practice

This repository is a **learning and practice project** I am building while getting hands-on experience with **Playwright**.

The goal of this project is not to create a production-ready test suite, but to:
- Learn Playwright fundamentals
- Apply good automation practices incrementally
- Experiment, refactor, and evolve tests as my knowledge grows

---

## 🎯 Project Goals

- Learn Playwright using realistic web applications
- Practice UI automation concepts such as:
  - Page Object Model (POM)
  - Stable selectors
  - Happy and unhappy paths
  - End‑to‑end flows
- Build a personal reference project I can iterate on over time

---

## 🌐 Application Under Test

This project uses **QA Playground**, specifically the **Bank Demo application**, as a testing target.

The Bank Demo provides:
- Login and authentication scenarios
- Different user roles (admin, viewer)
- Dashboard and protected routes

This makes it ideal for practicing real‑world automation scenarios in a controlled environment.

---

## 🧪 Tech Stack

- **Playwright**
- **TypeScript**
- **Node.js**
- **GitHub Actions** (CI)

---

## 📁 Project Structure

```text
.
├── .github/
│   └── copilot-instructions.md    # AI agent guidelines
│
├── tests/                          # Test files organized by feature
│   ├── auth/
│   │   ├── admin-login.spec.ts    # Valid admin login test
│   │   └── invalid-login.spec.ts  # Invalid credentials test
│   ├── e2e/                       # End-to-end flows (placeholder)
│   └── forms/                     # Form interaction tests (placeholder)
│
├── pages/                          # Page Object Model classes
│   ├── LoginPage.ts               # Login page interactions
│   └── DashboardPage.ts           # Dashboard page interactions
│
├── utils/                          # Reusable utilities (test data, helpers)
│
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project dependencies
├── package-lock.json
├── tsconfig.json
└── README.md                       # This file

```

---

## ▶️ Running the Tests Locally

Install dependencies (first time only):

```bash
npm install
```

Run all tests:
```bash
npx playwright test
```

View the HTML report:
```bash
npx playwright show-report
```

📝 Notes

This is a learning project – tests will be added, removed, and refactored frequently.
Some patterns may change as I explore better approaches.
The focus is on learning and hands‑on practice, not completeness.