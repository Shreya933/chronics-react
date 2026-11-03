import { z } from 'zod'

const MAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const email = (msg = 'Enter a valid email, like name@example.com.') => z.string().trim().regex(MAIL, msg)
const text = (min: number, msg: string) => z.string().trim().min(min, msg)

export const shippingSchema = z.object({
  name: text(2, 'Enter your full name.'),
  email: email(),
  phone: z.string().trim().refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
  zip: z.string().trim().regex(/^[\w -]{4,10}$/, 'Enter a valid PIN or ZIP code.'),
  address: text(6, 'Enter your street address.'),
  city: text(2, 'Enter your city.'),
})

export const cardSchema = z.object({
  cardName: text(2, 'Enter the name on the card.'),
  cardNumber: z.string().trim().refine((v) => v.replace(/\D/g, '').length === 16, 'Enter a 16-digit card number.'),
  cardExpiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use the format MM/YY.'),
  cardCvv: z.string().trim().regex(/^\d{3,4}$/, 'Enter the 3 or 4 digit CVV.'),
})

export const upiSchema = z.object({
  upiId: z.string().trim().regex(/^[\w.-]+@\w+$/, 'Enter a UPI ID like name@bank.'),
})

export const contactSchema = z.object({
  name: text(2, 'Enter your name.'),
  email: email('Enter a valid email.'),
  message: text(10, 'Write at least 10 characters.'),
})

export const signInSchema = z.object({
  email: email('Enter a valid email.'),
  password: text(6, 'Use at least 6 characters.'),
})

export const signUpSchema = signInSchema.extend({ name: text(2, 'Enter your name.') })

export const newsletterEmailSchema = email('Enter a valid email, like name@example.com.')

export type Errors = Record<string, string>

/** Validates values against a schema; returns the first message per field (empty object when valid). */
export function validate(schema: z.ZodType, values: unknown): Errors {
  const result = schema.safeParse(values)
  if (result.success) return {}
  const errors: Errors = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? '')
    if (!(key in errors)) errors[key] = issue.message
  }
  return errors
}
