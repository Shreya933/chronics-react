import { Link, useNavigate } from 'react-router-dom'
import { IMG } from '../assets/images'
import { FREE_SHIPPING_FROM, findProduct } from '../data/products'
import { money } from '../lib/format'
import { cartSubtotal, useStore } from '../store/useStore'
import { Icon } from './Icon'
import { MobileSearch } from './Header'

export function CartDrawer() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const open = useStore((s) => s.drawer === 'cart')
  const { changeQty, removeFromCart, closeDrawers } = useStore.getState()

  const sub = cartSubtotal(cart)
  const left = Math.max(0, FREE_SHIPPING_FROM - sub)

  return (
    <aside className={`drawer${open ? ' on' : ''}`} aria-label="Shopping cart">
      <div className="dh">
        Your cart
        <button className="ib" aria-label="Close cart" onClick={closeDrawers}><Icon name="x" /></button>
      </div>
      <div className="dl">
        {cart.length ? (
          cart.map((c) => {
            const p = findProduct(c.id)
            if (!p) return null
            return (
              <div className="row" key={c.k}>
                <img src={IMG[p.image]} alt="" />
                <div style={{ flex: 1 }}>
                  <h4>{p.name}</h4>
                  {c.sz ? <small style={{ color: 'var(--muted)' }}>Size {c.sz}</small> : null}
                  <div className="pr">{money(p.price)}</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="qty">
                      <button aria-label="Decrease quantity" onClick={() => changeQty(c.k, -1)}>−</button>
                      <span>{c.q}</span>
                      <button aria-label="Increase quantity" onClick={() => changeQty(c.k, 1)}>+</button>
                    </div>
                    <button className="rm" onClick={() => removeFromCart(c.k)}>Remove</button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="empty">
            <b><Icon name="bag" /></b>
            Your cart is empty.<br />Add something you love.<br /><br />
            <button className="btn p sm" onClick={closeDrawers}>Keep shopping</button>
          </div>
        )}
      </div>
      <div className="df" style={{ display: cart.length ? '' : 'none' }}>
        <div className="ship">
          {left ? (
            <>Add <b>{money(left)}</b> more for free shipping</>
          ) : (
            <><Icon name="check" /> You’ve unlocked free shipping</>
          )}
          <div className="pb"><i style={{ width: `${Math.min(100, (sub / FREE_SHIPPING_FROM) * 100)}%` }} /></div>
        </div>
        <div className="sum"><span>Subtotal</span><span>{money(sub)}</span></div>
        <button className="btn p" onClick={() => { closeDrawers(); navigate('/checkout') }}>Checkout</button>
      </div>
    </aside>
  )
}

const MENU_LINKS: ReadonlyArray<readonly [string, string, string | undefined]> = [
  ['Home', '/', undefined],
  ['Shop', '/shop', undefined],
  ['Categories', '/', 'cats'],
  ['Sale', '/', 'sale'],
  ['Brands', '/', 'brands'],
  ['Contact', '/contact', undefined],
  ['Wishlist', '/wishlist', undefined],
  ['Account', '/account', undefined],
]

export function MenuDrawer() {
  const open = useStore((s) => s.drawer === 'menu')
  const closeDrawers = useStore((s) => s.closeDrawers)
  return (
    <aside className={`drawer left${open ? ' on' : ''}`} aria-label="Menu">
      <div className="dh">
        Menu
        <button className="ib" aria-label="Close menu" onClick={closeDrawers}><Icon name="x" /></button>
      </div>
      <MobileSearch />
      {MENU_LINKS.map(([label, to, section]) => (
        <Link key={label} to={to} state={section ? { section } : {}} onClick={closeDrawers}>{label}</Link>
      ))}
    </aside>
  )
}

export function Scrim() {
  const on = useStore((s) => s.drawer !== null)
  const closeDrawers = useStore((s) => s.closeDrawers)
  return <div className={`scrim${on ? ' on' : ''}`} onClick={closeDrawers} />
}
