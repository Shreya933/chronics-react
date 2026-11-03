import { describe, expect, it } from 'vitest'
import { defaultSize, findProduct, sizesOf } from '../data/products'
import { formatCardNumber, formatExpiry, shippingCost } from './format'
import { cardSchema, contactSchema, shippingSchema, validate } from './validation'

describe('shipping', () => {
  it('is free from $50 on standard, always $9.99 on express', () => {
    expect(shippingCost(49.99, 'std')).toBe(4.99)
    expect(shippingCost(50, 'std')).toBe(0)
    expect(shippingCost(80, 'exp')).toBe(9.99)
  })
})

describe('formatting', () => {
  it('groups card numbers and expiry', () => {
    expect(formatCardNumber('4242424242424242999')).toBe('4242 4242 4242 4242')
    expect(formatExpiry('1229')).toBe('12/29')
    expect(formatExpiry('1')).toBe('1')
  })
})

describe('products', () => {
  it('picks the middle size and handles size-less items', () => {
    expect(defaultSize(findProduct(1)!)).toBe('M')
    expect(defaultSize(findProduct(7)!)).toBe('8')
    expect(sizesOf(findProduct(9)!)).toEqual([])
    expect(defaultSize(findProduct(9)!)).toBe('')
  })
})

describe('validation', () => {
  it('accepts a valid shipping address and flags bad fields', () => {
    const ok = { name: 'Ana Roy', email: 'ana@x.com', phone: '9876543210', zip: '560001', address: '12 Main Street', city: 'Pune' }
    expect(validate(shippingSchema, ok)).toEqual({})
    const bad = validate(shippingSchema, { ...ok, email: 'nope', phone: '123' })
    expect(Object.keys(bad)).toEqual(['email', 'phone'])
  })
  it('validates card fields', () => {
    const errs = validate(cardSchema, { cardName: 'A', cardNumber: '1234', cardExpiry: '13/99', cardCvv: '12' })
    expect(Object.keys(errs)).toHaveLength(4)
  })
  it('requires 10+ characters in the contact message', () => {
    expect(validate(contactSchema, { name: 'Al', email: 'a@b.co', message: 'short' }).message).toBe('Write at least 10 characters.')
  })
})
