import { z } from 'zod';

const bookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const bookingResponseSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number().positive(), 
  bookingdates: bookingDatesSchema, 
  additionalneeds: z.string().optional(),
});