import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IMG } from '../assets/images'
import { PRODUCTS } from '../data/products'
import { money } from '../lib/format'
import { cartCount, useStore } from '../store/useStore'
import { Icon } from './Icon'

export function TopBar() {
  return (
    <div className="top">
      <div className="wrap">
        <span><Icon name="truck" /> Free shipping on orders over $50</span>
        <span><Icon name="return" /> Easy 30-day returns</span>
        <span><Icon name="phone" /> +1 800 567 8900</span>
      </div>
    </div>
  )
}

export function Logo({ muted = false }: { muted?: boolean }) {
  return (
    <Link to="/" state={{}} className="logo">
      <i>C</i>
      <span>
        Chronics
        <small style={muted ? { color: 'inherit', opacity: 0.7 } : undefined}>Style · Your Way</small>
      </span>
    </Link>
  )
}

/** Home sections are anchors on the home page: /  with { section } in router state. */
const SECTION_LINKS = [
  ['Categories', 'cats'],
  ['Sale', 'sale'],
  ['Brands', 'brands'],
] as const

function SearchBox() {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => setOpen(false), [location.key])
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const q = value.trim().toLowerCase()
  const matches = q ? PRODUCTS.filter((p) => (p.name + p.category).toLowerCase().includes(q)) : []

  return (
    <div className="search" ref={box}>
      <input
        type="search"
        placeholder="Search for products…"
        autoComplete="off"
        aria-label="Search products"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(!!e.target.value.trim())
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && matches[0]) {
            navigate(`/product/${matches[0].id}`)
            setValue('')
          }
        }}
      />
      <div className={`sug${open ? ' open' : ''}`}>
        {matches.length ? (
          matches.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`}>
              <img src={IMG[p.image]} alt="" style={{ objectFit: 'cover' }} />
              <span>
                {p.name}
                <br />
                <b style={{ color: 'var(--brand)' }}>{money(p.price)}</b>
              </span>
            </Link>
          ))
        ) : (
          <p>No products match “{value.trim()}”. Try “dress” or “shirt”.</p>
        )}
      </div>
    </div>
  )
}

export function Header() {
  const [stuck, setStuck] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const cartItems = useStore((s) => cartCount(s.cart))
  const wishCount = useStore((s) => s.wish.length)
  const user = useStore((s) => s.user)
  const openDrawer = useStore((s) => s.openDrawer)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme:dark)').matches
    root.dataset.theme = dark ? 'light' : 'dark'
  }

  const onHome = location.pathname === '/'
  const section = (location.state as { section?: string } | null)?.section
  const homeActive = onHome && !section
  const shopActive = location.pathname === '/shop' || location.pathname.startsWith('/product/')

  return (
    <header className={stuck ? 'stuck' : ''}>
      <div className="wrap bar">
        <button className="ib" id="burger" aria-label="Open menu" onClick={() => openDrawer('menu')}>
          <Icon name="menu" />
        </button>
        <Logo />
        <nav className="main">
          <Link className={homeActive ? 'on' : ''} to="/" state={{}}>Home</Link>
          <NavLink className={shopActive ? 'on' : ''} to="/shop">Shop</NavLink>
          {SECTION_LINKS.map(([label, id]) => (
            <Link key={id} className={onHome && section === id ? 'on' : ''} to="/" state={{ section: id }}>
              {label}
            </Link>
          ))}
          <NavLink className={location.pathname === '/contact' ? 'on' : ''} to="/contact">Contact</NavLink>
        </nav>
        <div className="tools">
          <SearchBox />
          <Link className="ib" to="/account" aria-label="Account">
            {user ? <b>{user.name[0].toUpperCase()}</b> : <Icon name="user" />}
          </Link>
          <button className="ib" aria-label="Toggle dark mode" onClick={toggleTheme}>
            <Icon name="moon" />
          </button>
          <button className="ib" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
            <Icon name="heart" />
            <span className="badge">{wishCount > 0 ? wishCount : null}</span>
          </button>
          <button className="ib" aria-label="Open cart" onClick={() => openDrawer('cart')}>
            <Icon name="cart" />
            <span className="badge">{cartItems > 0 ? cartItems : null}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

/** Mobile search inside the slide-out menu: Enter jumps to the first product whose name matches. */
export function MobileSearch() {
  const navigate = useNavigate()
  const closeDrawers = useStore((s) => s.closeDrawers)
  const showToast = useStore((s) => s.showToast)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const v = (new FormData(e.currentTarget).get('q') as string).trim().toLowerCase()
    if (!v) return
    closeDrawers()
    const p = PRODUCTS.find((x) => x.name.toLowerCase().includes(v))
    if (p) navigate(`/product/${p.id}`)
    else showToast('No products found')
  }
  return (
    <form className="msearch" style={{ padding: '12px 16px' }} onSubmit={onSubmit}>
      <input
        name="q"
        type="search"
        placeholder="Search products…"
        style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 999, padding: '9px 14px', background: 'var(--bg)', color: 'var(--fg)', font: 'inherit' }}
      />
    </form>
  )
}
