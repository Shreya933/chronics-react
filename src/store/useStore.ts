import { create } from 'zustand'
import { MAX_PRICE, defaultSize, findProduct, type Category } from '../data/products'
import { shippingCost, type ShipMethod } from '../lib/format'

/* ---- localStorage (same keys as the original site, so saved carts carry over) ---- */
const load = <T,>(key: string, fallback: T): T => {
  try {
    return (JSON.parse(localStorage.getItem(key) as string) as T) || fallback
  } catch {
    return fallback
  }
}
const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

export interface CartItem { k: string; id: number; sz: string; q: number }
export interface User { name: string; email: string }
export interface OrderSummary { id: string; tot: number; date: string }
export type SortKey = 'pop' | 'low' | 'high' | 'rate'
export type Drawer = 'cart' | 'menu' | null
export type PayMethod = 'card' | 'upi' | 'cod'

export interface ShippingDetails { name: string; email: string; phone: string; zip: string; address: string; city: string }
export interface PlacedOrder { id: string; items: CartItem[]; tot: number; name: string }
export interface CheckoutState {
  step: 1 | 2 | 3
  details: Partial<ShippingDetails>
  ship: ShipMethod
  pay: PayMethod
  order?: PlacedOrder
}
const freshCheckout = (details: Partial<ShippingDetails> = {}): CheckoutState => ({ step: 1, details, ship: 'std', pay: 'card' })

export const cartSubtotal = (cart: CartItem[]) =>
  cart.reduce((sum, c) => sum + c.q * (findProduct(c.id)?.price ?? 0), 0)
export const cartCount = (cart: CartItem[]) => cart.reduce((n, c) => n + c.q, 0)

interface State {
  cart: CartItem[]
  wish: number[]
  user: User | null
  orders: OrderSummary[]

  drawer: Drawer
  quickViewId: number | null
  toast: { msg: string; on: boolean }

  category: Category | 'All'
  sort: SortKey
  maxPrice: number
  minRating: number

  authMode: 'in' | 'up'
  checkout: CheckoutState

  addToCart: (id: number, size?: string, qty?: number) => void
  changeQty: (key: string, delta: number) => void
  removeFromCart: (key: string) => void
  toggleWish: (id: number) => void
  addWishlistToCart: () => void

  openDrawer: (d: Exclude<Drawer, null>) => void
  closeDrawers: () => void
  setQuickView: (id: number | null) => void
  showToast: (msg: string) => void

  setCategory: (c: Category | 'All') => void
  setSort: (s: SortKey) => void
  setMaxPrice: (n: number) => void
  setMinRating: (n: number) => void
  resetFilters: () => void

  setAuthMode: (m: 'in' | 'up') => void
  signIn: (user: User, created: boolean) => void
  signOut: () => void

  patchCheckout: (patch: Partial<CheckoutState>) => void
  placeOrder: () => void
  leaveCheckout: () => void
}

let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useStore = create<State>((set, get) => ({
  cart: load<CartItem[]>('ch-cart', []),
  wish: load<number[]>('ch-wish', []),
  user: load<User | null>('ch-user', null),
  orders: load<OrderSummary[]>('ch-orders', []),

  drawer: null,
  quickViewId: null,
  toast: { msg: '', on: false },

  category: 'All',
  sort: 'pop',
  maxPrice: MAX_PRICE,
  minRating: 0,

  authMode: 'in',
  checkout: freshCheckout(),

  addToCart: (id, size, qty = 1) => {
    const p = findProduct(id)
    if (!p) return
    const sz = size === undefined ? defaultSize(p) : size
    const k = `${id}-${sz}`
    const cart = get().cart
    const next = cart.some((c) => c.k === k)
      ? cart.map((c) => (c.k === k ? { ...c, q: c.q + qty } : c))
      : [...cart, { k, id, sz, q: qty }]
    save('ch-cart', next)
    set({ cart: next })
    get().showToast('Added to cart')
  },
  changeQty: (key, delta) => {
    const next = get()
      .cart.map((c) => (c.k === key ? { ...c, q: c.q + delta } : c))
      .filter((c) => c.q >= 1)
    save('ch-cart', next)
    set({ cart: next })
  },
  removeFromCart: (key) => {
    const next = get().cart.filter((c) => c.k !== key)
    save('ch-cart', next)
    set({ cart: next })
  },
  toggleWish: (id) => {
    const { wish, showToast } = get()
    const on = wish.includes(id)
    const next = on ? wish.filter((x) => x !== id) : [...wish, id]
    save('ch-wish', next)
    set({ wish: next })
    showToast(on ? 'Removed from wishlist' : 'Added to wishlist')
  },
  addWishlistToCart: () => get().wish.forEach((id) => get().addToCart(id)),

  openDrawer: (d) => set({ drawer: d }),
  closeDrawers: () => set({ drawer: null }),
  setQuickView: (id) => set({ quickViewId: id }),
  showToast: (msg) => {
    clearTimeout(toastTimer)
    set({ toast: { msg, on: true } })
    toastTimer = setTimeout(() => set((s) => ({ toast: { ...s.toast, on: false } })), 2200)
  },

  setCategory: (c) => set({ category: c, maxPrice: MAX_PRICE, minRating: 0 }),
  setSort: (sort) => set({ sort }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMinRating: (minRating) => set({ minRating }),
  resetFilters: () => set({ category: 'All', maxPrice: MAX_PRICE, minRating: 0, sort: 'pop' }),

  setAuthMode: (authMode) => set({ authMode }),
  signIn: (user, created) => {
    save('ch-user', user)
    set({ user })
    get().showToast(created ? 'Account created' : 'Signed in')
  },
  signOut: () => {
    save('ch-user', null)
    set({ user: null })
    get().showToast('Signed out')
  },

  patchCheckout: (patch) => set((s) => ({ checkout: { ...s.checkout, ...patch } })),
  placeOrder: () => {
    const { cart, checkout, orders } = get()
    const sub = cartSubtotal(cart)
    const tot = sub + shippingCost(sub, checkout.ship)
    const id = 'CH-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const nextOrders = [{ id, tot, date: new Date().toLocaleDateString() }, ...orders].slice(0, 10)
    save('ch-orders', nextOrders)
    save('ch-cart', [])
    set({
      orders: nextOrders,
      cart: [],
      checkout: {
        ...checkout,
        step: 3,
        order: { id, items: cart.map((c) => ({ ...c })), tot, name: checkout.details.name ?? '' },
      },
    })
  },
  /** after a finished order, the next visit to checkout starts fresh (address is remembered) */
  leaveCheckout: () => {
    const { checkout } = get()
    if (checkout.step === 3) set({ checkout: freshCheckout(checkout.details) })
  },
}))
