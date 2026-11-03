import { FREE_SHIPPING_FROM } from '../data/products'

export const money = (n: number) => '$' + n.toFixed(2)

export type ShipMethod = 'std' | 'exp'

export const shippingCost = (subtotal: number, method: ShipMethod) =>
  method === 'exp' ? 9.99 : subtotal >= FREE_SHIPPING_FROM ? 0 : 4.99

/** 1234567812345678 -> "1234 5678 1234 5678" */
export const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

/** 1229 -> "12/29" */
export const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
}
