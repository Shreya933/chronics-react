import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useTitle } from '../components/Chrome'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, type Product } from '../data/products'
import { useStore, type SortKey } from '../store/useStore'

const SORTS: ReadonlyArray<readonly [SortKey, string]> = [
  ['pop', 'Most popular'],
  ['low', 'Price: low to high'],
  ['high', 'Price: high to low'],
  ['rate', 'Top rated'],
]

const COMPARE: Record<SortKey, (a: Product, b: Product) => number> = {
  pop: (a, b) => b.reviews - a.reviews,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  rate: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
}

export function Shop() {
  useTitle('Shop — Chronics')
  const { category, sort, maxPrice, minRating, setCategory, setSort, setMaxPrice, setMinRating, resetFilters } = useStore()

  const list = PRODUCTS
    .filter((p) => (category === 'All' || p.category === category) && p.price <= maxPrice && (!minRating || p.rating >= minRating))
    .sort(COMPARE[sort])

  return (
    <div className="wrap pg">
      <nav className="bc"><Link to="/">Home</Link> / Shop</nav>
      <h1 className="h1">Shop all</h1>
      <div className="shop">
        <aside className="flt">
          <h4>Category</h4>
          {(['All', ...CATEGORIES] as const).map((c) => (
            <label key={c}>
              <input type="radio" name="cat" value={c} checked={c === category} onChange={() => setCategory(c)} />
              {c}
            </label>
          ))}
          <h4>Max price: <span>${maxPrice}</span></h4>
          <input type="range" min={10} max={60} value={maxPrice} aria-label="Maximum price" onChange={(e) => setMaxPrice(+e.target.value)} />
          <h4>Rating</h4>
          <label>
            <input type="checkbox" checked={!!minRating} onChange={(e) => setMinRating(e.target.checked ? 4.5 : 0)} />
            4.5 stars and up
          </label>
          <button className="lnk" onClick={resetFilters}>Reset filters</button>
        </aside>
        <div>
          <div className="sbar">
            <span>{list.length} {list.length === 1 ? 'product' : 'products'}</span>
            <label>
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>
          <div className="pgrid">
            {list.length ? (
              list.map((p) => <ProductCard key={p.id} p={p} />)
            ) : (
              <div className="empty" style={{ gridColumn: '1/-1' }}>
                <b><Icon name="search" /></b>
                No products match these filters.<br /><br />
                <button className="btn p sm" onClick={resetFilters}>Reset filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
