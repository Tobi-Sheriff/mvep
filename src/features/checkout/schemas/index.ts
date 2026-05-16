import { z } from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters required'),
  lastName: z.string().min(2, 'At least 2 characters required'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(5, 'Enter your full street address'),
  city: z.string().min(2, 'Enter a city'),
  state: z.string().min(2, 'Enter a state / region'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Valid ZIP code required (e.g. 90210)'),
  country: z.string().min(2, 'Enter a country'),
});

export const paymentSchema = z.object({
  nameOnCard: z.string().min(3, 'Name on card is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Enter 16 digits, no spaces'),
  expiryMonth: z.string().min(1, 'Select a month'),
  expiryYear: z.string().min(1, 'Select a year'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter 3 or 4 digit CVV'),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
