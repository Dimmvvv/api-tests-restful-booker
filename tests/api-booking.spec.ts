import { test, expect } from '@playwright/test';
import { BookingClient } from './BookingClient';

test.describe('Booking API tests', () => {
  test('Successfully fetch a specific booking', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.getBookingById(3);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstname');
  });
  test('Validate data types in booking response', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.getBookingById(3);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.totalprice).toBe('number');
    expect(typeof body.firstname).toBe('string');
  });
  test('Filter bookings by check-in date', async ({request}) => {
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.getBookingByDate('2014-03-13');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });
  test('Validate nested bookingdates object', async ({request}) => {
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.getBookingById(5);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates).toHaveProperty('checkin');
    expect(body.bookingdates).toHaveProperty('checkout');
  });   
  test('Negative test for non-existing booking ID', async ({request}) => {
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.getBookingById(99999);
    expect(response.status()).toBe(404);
  });
  test('Check totalprice is greater than zero', async ({request}) =>{
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.getBookingById(5);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.totalprice).toBeGreaterThan(0);
  });
  test('Successfully create a new booking', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const bookingData = {
      firstname: 'Dmitriy',
      lastname: 'Volkov',
      totalprice: 250,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-08-10',
        checkout: '2026-08-15'
      },
      additionalneeds: 'Breakfast'
    };
    const response = await bookingClient.createBooking(bookingData);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');
    expect(body.booking).toHaveProperty('firstname', 'Dmitriy');
    expect(body.booking.totalprice).toBe(250);
    console.log('Booking created with ID:', body.bookingid);
  });
  test('Create a booking and verify via GET', async ({request}) => {
    const bookingClient = new BookingClient(request);
    const bookingData = {
      firstname: 'Alex',
      lastname: 'E2E',
      totalprice: 500,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-09-01',
        checkout: '2026-09-10'
      },
      additionalneeds: 'Late check-in'
    };
    const postResponse = await bookingClient.createBooking(bookingData);
    expect(postResponse.status()).toBe(200);
    const postBody = await postResponse.json();
    const createId = postBody.bookingid;
    expect(createId).toBeDefined();
    const getResponse = await bookingClient.getBookingById(createId);
    expect(getResponse.status()).toBe(200);
    const getBody = await getResponse.json();
    expect(getBody.firstname).toBe('Alex');
    expect(getBody.lastname).toBe('E2E');
    expect(getBody.totalprice).toBe(500);
    expect(getBody.depositpaid).toBe(false);
  });
  test('E2E creating a booking, authenticate, edit and delete it successfully', async ({request}) =>{
    const bookingClient = new BookingClient(request);
    const bookingDataNew = {
    firstname: 'John',
      lastname: 'Smith',
      totalprice: 2500,
      depositpaid: true,        
      bookingdates: {
        checkin: '2026-08-10',
        checkout: '2026-08-19'
    },
    additionalneeds: 'None'      
  };
  const createResponse = await bookingClient.createBooking(bookingDataNew);
  expect (createResponse.status()).toBe(200);
  const createBody = await createResponse.json();
  const targetId = createBody.bookingid;
  const authRes = await bookingClient.authMethod('admin', 'password123');
  expect(authRes.status()).toBe(200);
    const authBody = await authRes.json();
    const tokenValue = authBody.token;
    expect(tokenValue).toBeDefined();
    const bookingDataNewPut = {
        firstname: 'Johnatan',
          lastname: 'Smiths',
          totalprice: 2506,
          depositpaid: true,        
          bookingdates: {
            checkin: '2026-08-11',
            checkout: '2026-08-20'
        },
        additionalneeds: 'Breakfast'      
      };
    const putResponse = await bookingClient.updateBooking(targetId,tokenValue, bookingDataNewPut)
      expect(putResponse.status()).toBe(200);
      const putBody = await putResponse.json();
      expect(putBody.lastname).toBe('Smiths');
      expect(putBody.totalprice).toBe(2506);
      expect(putBody.depositpaid).toBe(true);
      const deleteRes = await bookingClient.deleteBooking(targetId,tokenValue)
      expect(deleteRes.status()).toBe(201); 
        const verifyRes = await bookingClient.getBookingById(targetId);
      expect(verifyRes.status()).toBe(404);
    });
});