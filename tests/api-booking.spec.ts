import { test, expect, request } from '@playwright/test';

test.describe('Booking API tests', () => {
  test('Successfully fetch a specific booking', async ({ request }) => {
    const response = await request.get('/booking/1');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstname');
  });
  test('Validate data types in booking response', async ({ request }) => {
    const response = await request.get('/booking/2');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.totalprice).toBe('number');
    expect(typeof body.firstname).toBe('string');
  });
  test('Filter bookings by check-in date', async ({request}) => {
    const response = await request.get('/booking?checkin=2014-03-13');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });
  test('Validate nested bookingdates object', async ({request}) => {
    const response = await request.get('/booking/5');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates).toHaveProperty('checkin');
    expect(body.bookingdates).toHaveProperty('checkout');
  });   
  test('Negative test for non-existing booking ID', async ({request}) => {
    const response = await request.get('booking/99999');
    expect(response.status()).toBe(404);
  });
  test('Check totalprice is greater than zero', async ({request}) =>{
    const response = await request.get('booking/5');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.totalprice).toBeGreaterThan(0);
  });
  test('Successfully create a new booking', async ({ request }) => {
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
    const response = await request.post('/booking', {
      data: bookingData
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');
    expect(body.booking).toHaveProperty('firstname', 'Dmitriy');
    expect(body.booking.totalprice).toBe(250);
    console.log('Booking created with ID:', body.bookingid);
  });
  test('Create a booking and verify via GET', async ({request}) => {
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
    const postResponse = await request.post('booking/', {data:bookingData});
    expect(postResponse.status()).toBe(200);
    const postBody = await postResponse.json();
    const createId = postBody.bookingid;
    expect(createId).toBeDefined();
    const getResponse = await request.get(`booking/${createId}`);
    expect(getResponse.status()).toBe(200);
    const getBody = await getResponse.json();
    expect(getBody.firstname).toBe('Alex');
    expect(getBody.lastname).toBe('E2E');
    expect(getBody.totalprice).toBe(500);
    expect(getBody.depositpaid).toBe(false);
  });
});