import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useTitle } from '../components/Chrome'
import { ProductCard } from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import { useStore } from '../store/useStore'

export function Wishlist() {
  useTitle('Wishlist — Chronics')
  const wish = useStore((s) => s.wish)
  const addWishlistToCart = useStore((s) => s.addWishlistToCart)
  const list = PRODUCTS.filter((p) => wish.includes(p.id))

  return (
    <div className="wrap pg">
      <h1 className="h1">Your wishlist</h1>
      {list.length ? (
        <>
          <p><button className="btn p sm" onClick={addWishlistToCart}>Add all to cart</button></p>
          <div className="pgrid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </>
      ) : (
        <div className="empty">
          <b><Icon name="heart" /></b>
          Nothing saved yet.<br />Tap a heart on any product to save it here.<br /><br />
          <Link className="btn p sm" to="/shop">Browse the shop</Link>
        </div>
      )}
    </div>
  )
}
