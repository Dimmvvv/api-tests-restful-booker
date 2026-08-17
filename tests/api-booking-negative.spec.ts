import { test, expect } from '@playwright/test';
import { BookingClient } from './BookingClient';
import { BookingPayloads } from '../test-data/bookingPayloads';

test.describe('Booking negative API test', () => {
    test('Check negative booking creation response', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const bookingInvalidData = BookingPayloads.createInvalidBooking();
        const response = await bookingClient.createBooking(bookingInvalidData);
        // API-quirk: Restful Booker doesn't validate input data (empty firstname,
        // negative price) and crashes with 500 Internal Server Error instead of
        // the expected 400 Bad Request. The response body is plain text, not JSON —
        // that's why response.text() is used here instead of response.json().
        expect(response.status()).toBe(500);
        const bodyText = await response.text();
        expect(bodyText).toContain('Internal Server Error');
    });
    test('Check negative booking creation response with total price = 0', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const bookingDataWithNullAmount = {
            firstname: 'User',
            lastname: 'Tester',
            totalprice: 0,
            depositpaid: 0,
            bookingdates: {
                checkin: '2026-11-01',
                checkout: '2026-11-05'
            },
            additionalneeds: 'Breakfast'
        };
        const response = await bookingClient.createBooking(bookingDataWithNullAmount);
        // Depositing with total price amount = 0 are successfull without any errors, seems like a validation issue.
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.booking.totalprice).toBe(0);
        const createdId = responseBody.bookingid;
        expect(createdId).toBeDefined();
    });
    test('Check negative booking creation response without booking dates', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const bookingDataWithoutBookingDates = {
            firstname: 'User',
            lastname: 'Tester',
            totalprice: 2000,
            depositpaid: 0,
            additionalneeds: 'Breakfast'
        };
        const response = await bookingClient.createBooking(bookingDataWithoutBookingDates);
        // Same issue as for the first test - 500 Internal Server Error for invalid booking data with text response.
        expect(response.status()).toBe(500);
        const bodyText = await response.text();
        expect(bodyText).toContain('Internal Server Error');
    });
    test('Check negative booking creation response with checkin after checkout dates', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const bookingDataWithMixedBookingDates = {
            firstname: 'User',
            lastname: 'Tester',
            totalprice: 200,
            depositpaid: 0,
            bookingdates: {
                checkin: '2026-12-01',
                checkout: '2026-11-05'
            },
            additionalneeds: 'Breakfast'
        };
        const response = await bookingClient.createBooking(bookingDataWithMixedBookingDates);
        // Result - no validation for checkin / checkout dates, valid 200 respone is returned
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.booking.bookingdates.checkin).toBe('2026-12-01');
    });
});