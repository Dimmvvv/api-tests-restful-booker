# Playwright API Automation Framework 🚀

This is a professional automated testing framework built with **TypeScript** and **Playwright APIRequestContext** for verifying the **Restful-Booker API**. It demonstrates scalable architecture, clean code principles, and automated CI/CD pipelines.

---

## 🛠️ Tech Stack
* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **CI/CD:** GitHub Actions

---

## 🏗️ Framework Architecture

The project follows a layered architecture (similar in spirit to the Page Object Model used in UI testing) to keep tests maintainable and free of hardcoded logic:

1. **API Client (`tests/BookingClient.ts`)**: Encapsulates raw HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) behind high-level methods like `bookingClient.createBooking(payload)`. Tests never call `request.get/post/put/delete` directly, so an endpoint URL change only needs to be updated in one place.
2. **Test Data (`test-data/bookingPayloads.ts`)**: Generates dynamic payloads (random names, prices, boolean flags) on every run to avoid test collisions in a shared public sandbox, plus fixed invalid payloads for negative testing.
3. **Fixtures (`fixtures/booking.fixture.ts`)**: Uses Playwright's `test.extend()` to compose reusable, dependency-aware setup and teardown logic:
   - `bookingClient` — provides a ready-to-use API client instance.
   - `authToken` — authenticates once and hands back a valid token.
   - `createdBookingId` — creates a booking before the test runs and automatically deletes it afterward, so tests that only need a booking as background data don't have to manage its lifecycle manually.

   Tests request only the fixtures they actually need — a read-only test skips `authToken` entirely, while a lifecycle test (create → update → delete) manages the booking manually instead of using `createdBookingId`, since the lifecycle itself is what's being tested.
4. **Tests (`tests/*.spec.ts`)**: Clean, focused spec files containing business logic, HTTP status assertions, and data validation — with setup/teardown boilerplate delegated to fixtures.

---

## 🧪 Automated Test Scenarios

### 📅 Core Booking Flow (`tests/api-booking.spec.ts`)
* Fetching bookings by ID, filtering by check-in date, nested object validation.
* Full CRUD lifecycle: create → authenticate → update (`PUT`) → delete → verify `404 Not Found`.

### 🔍 Negative & Edge Cases (`tests/api-booking-negative.spec.ts`)
* Invalid payloads (empty required fields, negative pricing) — documents actual API behavior rather than assuming it.
* Boundary values: zero pricing, missing `bookingdates`, inverted check-in/check-out order.

### 🔧 Update Scenarios (`tests/api-booking-update.spec.ts`)
* Valid update flow with field-level verification that data actually changed.
* Update attempts against non-existent booking IDs.

### 🧩 Fixtures Composition Practice (`tests/api-booking-fixtures-practice.spec.ts`)
* Selective fixture usage based on what each test actually needs.
* Manual vs. fixture-managed resource lifecycles, including a deliberate double-DELETE scenario that validates the fixture's teardown handles an already-deleted resource gracefully.

### 🔐 Authentication (`tests/api-auth.spec.ts`)
* Token generation, invalid credentials, and guarding update actions against missing/invalid tokens.

---

## 🔎 Known API Quirks (discovered via testing)

- Invalid booking payloads (empty `firstname`, negative `totalprice`) return `500 Internal Server Error` with a **plain-text** body, not a JSON error — tests handle this with `response.text()` instead of assuming `response.json()` will parse.
- Updating a non-existent booking ID returns `405 Method Not Allowed`, not `404 Not Found`.
- Deleting a non-existent booking ID also returns `405 Method Not Allowed`.
- No server-side validation exists for check-in/check-out date order — a booking with `checkout` earlier than `checkin` is accepted with `200 OK`.
- Invalid login credentials return `200 OK` with a `{ reason: "Bad credentials" }` body, not `401 Unauthorized`.

---

## 🚀 CI/CD Pipeline

The framework is fully integrated into **GitHub Actions** (`.github/workflows/playwright.yml`).
* The pipeline automatically spins up a clean **Ubuntu Linux** environment on every `push` or `pull_request` to the `main` branch.
* It installs dependencies, runs the full test suite, and archives the Playwright HTML report as a build artifact.

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