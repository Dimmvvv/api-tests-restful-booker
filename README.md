# Playwright API Automation Framework 🚀

This is a professional automated testing framework built with **TypeScript** and **Playwright APIRequestContext** for verifying the **Restful-Booker API**. It demonstrates scalable architecture, clean code principles, and automated CI/CD pipelines.

---

## 🛠️ Tech Stack
* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **CI/CD:** GitHub Actions
* **AI Tooling:** Cursor IDE & Codeium 

---

## 🏗️ Framework Architecture

The project follows a robust **Three-Layer Architecture** (similar to the Page Object Model in UI testing) to ensure high maintainability and prevent hardcoding:

1. **API Client Layer (`/api`)**: Encapsulates raw HTTP methods (`GET`, `POST`, `PUT`, `DELETE`). The tests interact only with high-level methods like `bookingClient.createBooking(payload)`, making the framework independent of endpoint URL modifications.
2. **Test Data Layer (`/test-data`)**: Implements dynamic payload generation using native TypeScript features. Generates unique text strings, random pricing, and boolean logic on every execution to prevent test collisions in shared environments.
3. **Test Layer (`/tests`)**: Contains clean, easy-to-read specification files focused strictly on business logic, HTTP status validations, and strict data type verifications.

---

## 🧪 Automated Test Scenarios

The framework covers both positive integration flows and edge-case negative testing:

### 📅 Booking API (`tests/api-booking.spec.ts`)
* **Full CRUD Lifecycle**: A 5-step end-to-end integration scenario that creates a booking, authenticates via token, updates data using `PUT`, executes deletion (`DELETE`), and validates system state with `404 Not Found`.
* **Data Filtering**: Query parameter testing via date parameters (`/booking?checkin=...`).
* **Data Integrity**: Deep object structure validation and mathematical checks (e.g., pricing greater than zero).

### 🔐 Authentication & Edge Cases (`tests/api-auth.spec.ts`)
* **Positive Auth**: Verification of secure token generation and data type constraints.
* **Negative Auth**: Payload validation for improper authorization attempts (verifying error response payloads).
* **Security Validation**: Guarding modification actions to ensure unauthorized requests return `403 Forbidden`.

---

## 🚀 CI/CD Pipeline

The framework is fully integrated into **GitHub Actions** (`.github/workflows/playwright.yml`). 
* The pipeline automatically spins up a clean **Ubuntu Linux** environment upon every `push` or `pull_request` to the main branch.
* It provisions runtime environments, executes the continuous integration checklist, and archives the Playwright HTML test execution report as an artifact.

---

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dimmvvv/api-tests-restful-booker.git
   cd api-tests-restful-booker
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Execute all API tests:**
   ```bash
   npx playwright test
   ```

4. **View HTML test execution report:**
   ```bash
   npx playwright show-report
   ```
