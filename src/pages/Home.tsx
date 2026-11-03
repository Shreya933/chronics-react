import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IMG, hero, promoNew, promoSale } from '../assets/images'
import { Icon, type IconName } from '../components/Icon'
import { useTitle } from '../components/Chrome'
import { ProductCard } from '../components/ProductCard'
import { BRANDS, CATEGORIES, CATEGORY_IMAGES, PRODUCTS, TABS, type Tag } from '../data/products'
import { useStore } from '../store/useStore'

const SLIDES = [
  { kicker: 'Special offer', before: 'Refresh your ', em: 'fashion vibe', sub: 'Grab up to 40% off your first order. Limited time only.', cta: 'Shop now' },
  { kicker: 'New collection', before: 'Pastel looks for ', em: 'every day', sub: 'Dresses, tops and jackets that move with you.', cta: 'See new arrivals' },
  { kicker: 'Seasonal sale', before: 'Flat 40% off ', em: 'on everything', sub: 'Prices already marked down. No code needed.', cta: 'Shop the sale' },
]

function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [index, paused])

  const s = SLIDES[index]
  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap">
        <div className="txt">
          <div className="slide" key={index}>
            <p className="kick">{s.kicker}</p>
            <h1>{s.before}<em>{s.em}</em></h1>
            <p className="sub">{s.sub}</p>
            <Link className="btn p" to="/shop">{s.cta} <Icon name="arrow" /></Link>{' '}
            <Link className="btn o" to="/" state={{ section: 'cats' }}>Explore collection</Link>
          </div>
          <div className="dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={i === index ? 'on' : ''} aria-label={`Slide ${i + 1}`} onClick={() => setIndex(i)} />
            ))}
          </div>
        </div>
      </div>
      <img src={hero} alt="Woman in pink blazer holding shopping bags" width={1512} height={966} />
    </section>
  )
}

function Categories() {
  const setCategory = useStore((s) => s.setCategory)
  return (
    <section className="s wrap" id="cats">
      <div className="title"><small>SHOP BY CATEGORY</small><h2>Find your style</h2></div>
      <div className="cats">
        {CATEGORIES.map((c) => (
          <Link key={c} className="cat" to="/shop" onClick={() => setCategory(c)}>
            <img src={IMG[CATEGORY_IMAGES[c]]} alt="" loading="lazy" />
            <div>{c}<b><Icon name="arrow" /></b></div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TopPicks() {
  const [tab, setTab] = useState<Tag>('best')
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (track.current) track.current.scrollLeft = 0
  }, [tab])

  const scroll = (dir: -1 | 1) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="s wrap" id="picks">
      <div className="title"><small>TRENDING PRODUCTS</small><h2>Top picks for you</h2></div>
      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={key === tab ? 'on' : ''} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      <div className="car">
        <button className="arrow l" aria-label="Previous products" onClick={() => scroll(-1)}><Icon name="chev-l" /></button>
        <div className="track" ref={track}>
          {PRODUCTS.filter((p) => p.tags.includes(tab)).map((p) => <ProductCard key={`${tab}-${p.id}`} p={p} />)}
        </div>
        <button className="arrow r" aria-label="Next products" onClick={() => scroll(1)}><Icon name="chev-r" /></button>
      </div>
      <p style={{ textAlign: 'center', margin: '8px 0 0' }}>
        <Link className="btn o sm" to="/shop">View all products</Link>
      </p>
    </section>
  )
}

const FEATURES: ReadonlyArray<readonly [IconName, string, string]> = [
  ['truck', 'Free worldwide shipping', 'On orders over $50'],
  ['return', '30-day return policy', 'No-hassle returns'],
  ['lock', 'Secure payment', '100% secure checkout'],
  ['headphones', '24/7 customer support', 'We’re here to help'],
]

export function Home() {
  useTitle('Chronics — Refresh Your Fashion Vibe')
  return (
    <>
      <Hero />
      <Categories />
      <TopPicks />

      <section className="s wrap">
        <div className="feat">
          {FEATURES.map(([icon, title, sub]) => (
            <div key={title}>
              <i><Icon name={icon} /></i>
              <p><b>{title}</b><span>{sub}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="s wrap" id="sale">
        <div className="promos">
          <div className="promo">
            <div>
              <small>New collection</small>
              <h3>New arrivals<br />just for you</h3>
              <Link className="btn p sm" to="/shop">Shop now</Link>
            </div>
            <img src={promoNew} alt="Woman in white blazer" loading="lazy" />
          </div>
          <div className="promo">
            <div>
              <small>Seasonal sale</small>
              <h3>Flat 40% off<br />on everything</h3>
              <Link className="btn sm" style={{ background: 'var(--ink)', color: 'var(--ink-fg)' }} to="/shop">Shop sale</Link>
            </div>
            <img src={promoSale} alt="Sneakers" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="s wrap" id="brands">
        <div className="title"><h2>Our top brands</h2></div>
        <div className="brands">
          <div>
            {[...BRANDS, ...BRANDS].map((b, i) => <span key={i}>{b}</span>)}
          </div>
        </div>
      </section>
    </>
  )
}
