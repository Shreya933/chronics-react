import { Link, useNavigate } from 'react-router-dom'
import { IMG } from '../assets/images'
import type { Product } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store/useStore'
import { Icon } from './Icon'

export function Rating({ rating, reviews, long = false }: { rating: number; reviews: number; long?: boolean }) {
  return (
    <p className="rate">
      <i>★</i>
      <b>{rating}</b>
      <span>{long ? `(${reviews} reviews)` : `(${reviews})`}</span>
    </p>
  )
}

export function Price({ p, large, children }: { p: Product; large?: number; children?: React.ReactNode }) {
  return (
    <p className="price" style={large ? { fontSize: large } : undefined}>
      {money(p.price)}
      {p.oldPrice ? <s>{money(p.oldPrice)}</s> : null}
      {children}
    </p>
  )
}

export function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate()
  const wished = useStore((s) => s.wish.includes(p.id))
  const toggleWish = useStore((s) => s.toggleWish)
  const addToCart = useStore((s) => s.addToCart)
  const setQuickView = useStore((s) => s.setQuickView)

  return (
    <article className="card">
      <span className="im">
        <img
          className={p.cover ? 'cv' : ''}
          style={{ cursor: 'pointer' }}
          src={IMG[p.image]}
          alt={p.name}
          onClick={() => navigate(`/product/${p.id}`)}
        />
        {p.discount ? <span className="tag">-{p.discount}%</span> : null}
        <button
          className={`heart${wished ? ' on' : ''}`}
          aria-label={`Add ${p.name} to wishlist`}
          aria-pressed={wished}
          onClick={() => toggleWish(p.id)}
        >
          <Icon name="heart" filled={wished} />
        </button>
        <button className="qv" onClick={() => setQuickView(p.id)}>Quick view</button>
      </span>
      <Rating rating={p.rating} reviews={p.reviews} />
      <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
      <Price p={p} />
      <button className="add" onClick={() => addToCart(p.id)}>
        <Icon name="cart" /> Add to cart
      </button>
    </article>
  )
}
