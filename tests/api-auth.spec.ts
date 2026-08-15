import { test, expect } from '@playwright/test';
import { BookingClient } from './BookingClient';
import { BookingPayloads } from '../test-data/bookingPayloads';

test.describe('Auth API & negative scenarios.', () => {
    test('Successful Token Generation', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const authRes = await bookingClient.authMethod('admin', 'password123');
        expect(authRes.status()).toBe(200);
        const authBody = await authRes.json();
        expect(authBody).toHaveProperty('token');
        expect(typeof authBody.token).toBe('string');
    });
    test('Auth with Invalid Credentials', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const authRes = await bookingClient.authMethod('admi', 'password12');
        const authBody = await authRes.json();
        expect(authBody).toHaveProperty('reason');
        expect(authBody.reason).toBe('Bad credentials');
    });
    test('Update Booking without Token (403 Forbidden)', async ({ request }) => {
        const bookingClient = new BookingClient(request);
        const bookingData = BookingPayloads.createValidBooking();
        const newBooking = await bookingClient.createBooking(bookingData);
        const newBookingBody = await newBooking.json();
        const bookingId = newBookingBody.bookingid;
        const bookingDataNew = BookingPayloads.createValidBooking();
        const bookingDataUpdate = await bookingClient.updateBooking(bookingId, "", bookingDataNew);
        expect(bookingDataUpdate.status()).toBe(403);
    });
});