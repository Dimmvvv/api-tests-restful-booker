import { test, expect } from '../fixtures/booking.fixture';
import { BookingPayloads } from '../test-data/bookingPayloads';

test.describe('Fixtures practice booking tests', () => {
    test('Get all bookings and verify array', async ({ bookingClient }) => {
        const getResponse = await bookingClient.getAllBookings();
        expect(getResponse.status()).toBe(200);
        const body = await getResponse.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });

    test('Verify created booking exists via GET without authToken', async ({ bookingClient, createdBookingId }) => {
        const getResponse = await bookingClient.getBookingById(createdBookingId);
        expect(getResponse.status()).toBe(200);
        const body = await getResponse.json();
        expect(body).toHaveProperty('firstname');
        expect(body).toHaveProperty('lastname');
    });

    test('Delete non-existent booking with valid authToken', async ({ bookingClient, authToken }) => {
        const deleteResponse = await bookingClient.deleteBooking(999999, authToken);
        expect(deleteResponse.status()).toBe(405);
        const body = await deleteResponse.text();
        expect(body).toContain('Method Not Allowed');
    });

    test('Update, delete manually, verify 404 — teardown handles double DELETE', async ({
        bookingClient,
        authToken,
        createdBookingId,
    }) => {
        const updatedData = BookingPayloads.createValidBooking();
        const putResponse = await bookingClient.updateBooking(createdBookingId, authToken, updatedData);
        expect(putResponse.status()).toBe(200);
        const putBody = await putResponse.json();
        expect(putBody.firstname).toBe(updatedData.firstname);

        const deleteResponse = await bookingClient.deleteBooking(createdBookingId, authToken);
        expect(deleteResponse.status()).toBe(201);

        const verifyResponse = await bookingClient.getBookingById(createdBookingId);
        expect(verifyResponse.status()).toBe(404);
    });

    test('Fixture booking vs manually created booking have different ids', async ({
        bookingClient,
        createdBookingId,
    }) => {
        const manualData = BookingPayloads.createValidBooking();
        const createResponse = await bookingClient.createBooking(manualData);
        expect(createResponse.status()).toBe(200);
        const manualId = (await createResponse.json()).bookingid;

        expect(manualId).toBeDefined();
        expect(manualId).not.toBe(createdBookingId);
    });
});