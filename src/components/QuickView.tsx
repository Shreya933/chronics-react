import { useEffect, useRef, useState } from 'react'
import { IMG } from '../assets/images'
import { defaultSize, findProduct, sizesOf, type Product } from '../data/products'
import { useStore } from '../store/useStore'
import { Icon } from './Icon'
import { Price, Rating } from './ProductCard'

function Body({ p, close }: { p: Product; close: () => void }) {
  const [size, setSize] = useState(defaultSize(p))
  const addToCart = useStore((s) => s.addToCart)
  const openDrawer = useStore((s) => s.openDrawer)
  const sizes = sizesOf(p)

  return (
    <div className="q">
      <div className="pic"><img src={IMG[p.image]} alt={p.name} /></div>
      <div className="inf">
        <button className="x" aria-label="Close" onClick={close}><Icon name="x" /></button>
        <Rating rating={p.rating} reviews={p.reviews} long />
        <h3>{p.name}</h3>
        <Price p={p} large={22} />
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Soft, breathable fabric with a relaxed fit. Machine washable.</p>
        <b style={{ fontSize: 13 }}>{sizes.length ? 'Size' : ''}</b>
        <div className="opt">
          {sizes.map((s) => (
            <button key={s} className={s === size ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>
          ))}
        </div>
        <button
          className="btn p"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => { addToCart(p.id, size); close(); openDrawer('cart') }}
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}

export function QuickView() {
  const id = useStore((s) => s.quickViewId)
  const setQuickView = useStore((s) => s.setQuickView)
  const ref = useRef<HTMLDialogElement>(null)
  const p = id ? findProduct(id) : undefined

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (p && !d.open) d.showModal()
    if (!p && d.open) d.close()
  }, [p])

  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      onClose={() => setQuickView(null)}
      onClick={(e) => { if (e.target === ref.current) close() }}
    >
      {p ? <Body key={p.id} p={p} close={close} /> : null}
    </dialog>
  )
}
