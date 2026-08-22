import { test as base } from '@playwright/test';
import { BookingClient } from '../tests/BookingClient';
import { BookingPayloads } from '../test-data/bookingPayloads';

type BookingFixtures = {
  bookingClient: BookingClient;
  authToken: string;
  createdBookingId: number;
};

export const test = base.extend<BookingFixtures>({
  bookingClient: async ({ request }, use) => {
    const client = new BookingClient(request);
    await use(client);
  },

  authToken: async ({ bookingClient }, use) => {
    const res = await bookingClient.authMethod('admin', 'password123');
    const body = await res.json();
    await use(body.token);
  },

  createdBookingId: async ({ bookingClient, authToken }, use) => {
    const data = BookingPayloads.createValidBooking();
    const response = await bookingClient.createBooking(data);
    const bookingId = (await response.json()).bookingid;

    await use(bookingId);

    const deleteRes = await bookingClient.deleteBooking(bookingId, authToken);
    if (deleteRes.status() !== 201 && deleteRes.status() !== 404 && deleteRes.status() !== 405) {
      console.warn(`Teardown: unexpected status ${deleteRes.status()} for id ${bookingId}`);
    }
  },
});

export { expect } from '@playwright/test';