import { test, expect } from '../fixtures/booking.fixture';
import { BookingPayloads } from '../test-data/bookingPayloads';


test.describe('Booking update API test', () => {
    test('Updating booking with valid token', async ({ bookingClient, authToken, createdBookingId }) => {
        const bookingData = BookingPayloads.createValidBooking();
        const putResponse = await bookingClient.updateBooking(createdBookingId, authToken, bookingData);
        expect(putResponse.status()).toBe(200);
        const body = await putResponse.json();
        expect(body.firstname).toBe(bookingData.firstname);
    });
    test('Updating booking with invalid id', async ({ bookingClient, authToken }) => {
        const bookingData = BookingPayloads.createValidBooking();
        const bookingId = 999999;
        const putResponse = await bookingClient.updateBooking(bookingId, authToken, bookingData);
        expect(putResponse.status()).toBe(405);
        const body = await putResponse.text();
        expect(body).toContain('Method Not Allowed');
    });
});