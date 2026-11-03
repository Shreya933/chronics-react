import { useState, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IMG } from '../assets/images'
import { Icon } from '../components/Icon'
import { useTitle } from '../components/Chrome'
import { Price, ProductCard, Rating } from '../components/ProductCard'
import { DESCRIPTIONS, PRODUCTS, defaultSize, findProduct, sizesOf, type Product } from '../data/products'
import { useStore } from '../store/useStore'
import { NotFound } from './NotFound'

const COLOURS = ['#f2a7c3', '#b9a4ec', '#2a1d45']
const REVIEWS: ReadonlyArray<readonly [string, number, string]> = [
  ['Anika R.', 5, 'Fits perfectly and the colour is just like the photos.'],
  ['Sam T.', 4, 'Good quality for the price. Arrived in three days.'],
  ['Priya M.', 5, 'Bought a second one as a gift. Highly recommend.'],
]
type PaneKey = 'd' | 's' | 'r'

function Pane({ p, tab }: { p: Product; tab: PaneKey }) {
  if (tab === 'd') return <p>{DESCRIPTIONS[p.category]} Designed in pastel shades to mix and match with the rest of the Chronics collection.</p>
  if (tab === 's') {
    return (
      <ul>
        <li>Fabric: soft, breathable blend</li>
        <li>Care: machine wash cold, dry flat</li>
        <li>Fit: true to size</li>
        <li>Free returns within 30 days</li>
      </ul>
    )
  }
  return (
    <>
      {REVIEWS.map(([name, stars, text]) => (
        <div className="rv" key={name}>
          <b>{name}</b> <span style={{ color: 'var(--star)' }}>{'★'.repeat(stars)}</span>
          <br />{text}
        </div>
      ))}
    </>
  )
}

function ProductDetail({ p }: { p: Product }) {
  const navigate = useNavigate()
  const wished = useStore((s) => s.wish.includes(p.id))
  const { addToCart, toggleWish, setCategory } = useStore.getState()
  const [size, setSize] = useState(defaultSize(p))
  const [qty, setQty] = useState(1)
  const [colour, setColour] = useState(0)
  const [tab, setTab] = useState<PaneKey>('d')
  const [origin, setOrigin] = useState('50% 50%')

  useTitle(`${p.name} — Chronics`)

  const sizes = sizesOf(p)
  const related = [...PRODUCTS.filter((x) => x !== p && x.category === p.category), ...PRODUCTS.filter((x) => x.category !== p.category)].slice(0, 4)

  const onZoomMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div className="wrap pg">
      <nav className="bc">
        <Link to="/">Home</Link> / <Link to="/shop" onClick={() => setCategory(p.category)}>{p.category}</Link> / {p.name}
      </nav>
      <div className="pd">
        <div className="zoom" onMouseMove={onZoomMove}>
          <img className={p.cover ? 'cv' : ''} src={IMG[p.image]} alt={p.name} style={{ transformOrigin: origin }} />
        </div>
        <div>
          <Rating rating={p.rating} reviews={p.reviews} long />
          <h1 className="h1" style={{ margin: '4px 0' }}>{p.name}</h1>
          <Price p={p} large={26}>
            {p.oldPrice ? <span className="tag" style={{ position: 'static', marginLeft: 8 }}>Save {p.discount}%</span> : null}
          </Price>
          <p style={{ color: 'var(--muted)' }}>{DESCRIPTIONS[p.category]}</p>

          <b style={{ fontSize: 13 }}>Colour</b>
          <div className="sw">
            {COLOURS.map((c, i) => (
              <button key={c} className={i === colour ? 'on' : ''} style={{ background: c }} aria-label={`Colour ${i + 1}`} onClick={() => setColour(i)} />
            ))}
          </div>

          {sizes.length ? (
            <>
              <b style={{ fontSize: 13 }}>Size</b>
              <div className="opt">
                {sizes.map((x) => (
                  <button key={x} className={x === size ? 'on' : ''} onClick={() => setSize(x)}>{x}</button>
                ))}
              </div>
            </>
          ) : null}

          <div className="buy">
            <div className="qty">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
            </div>
            <button className="btn p" onClick={() => addToCart(p.id, size, qty)}>Add to cart</button>
            <button className="btn o" onClick={() => { addToCart(p.id, size, qty); navigate('/checkout') }}>Buy now</button>
            <button className="btn o" onClick={() => toggleWish(p.id)}>
              <Icon name="heart" filled={wished} />{wished ? ' Saved' : ' Wishlist'}
            </button>
          </div>

          <ul className="perk">
            <li><Icon name="truck" /> Free shipping on orders over $50</li>
            <li><Icon name="return" /> 30-day easy returns</li>
            <li><Icon name="package" /> Delivered in 3–5 working days</li>
          </ul>
        </div>
      </div>

      <div className="tb">
        <button className={tab === 'd' ? 'on' : ''} onClick={() => setTab('d')}>Description</button>
        <button className={tab === 's' ? 'on' : ''} onClick={() => setTab('s')}>Details</button>
        <button className={tab === 'r' ? 'on' : ''} onClick={() => setTab('r')}>Reviews ({p.reviews})</button>
      </div>
      <div className="pn"><Pane p={p} tab={tab} /></div>

      <h2 style={{ marginTop: 30 }}>You may also like</h2>
      <div className="pgrid">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div>
    </div>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const p = /^\d+$/.test(id ?? '') ? findProduct(Number(id)) : undefined
  if (!p) return <NotFound />
  // keyed so size / quantity / tab reset when moving between products
  return <ProductDetail key={p.id} p={p} />
}
