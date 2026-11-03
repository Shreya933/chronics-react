import type { ImageKey } from '../assets/images'

export const CATEGORIES = [
  'Women’s Wear',
  'Men’s Wear',
  'Shoes',
  'Bags',
  'Sunglasses',
  'Jewellery',
  'Accessories',
] as const
export type Category = (typeof CATEGORIES)[number]
export type Tag = 'best' | 'new' | 'top'

export interface Product {
  id: number
  name: string
  image: ImageKey
  /** photo fills the frame (object-fit: cover) instead of being letterboxed */
  cover?: boolean
  category: Category
  discount: number
  rating: number
  reviews: number
  price: number
  oldPrice: number
  tags: Tag[]
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Purple Midi Dress', image: 'p0', category: 'Women’s Wear', discount: 25, rating: 4.5, reviews: 128, price: 29.99, oldPrice: 39.99, tags: ['best', 'top'] },
  { id: 2, name: 'Yellow Ruffle Top', image: 'p1', category: 'Women’s Wear', discount: 30, rating: 4.5, reviews: 86, price: 21.99, oldPrice: 31.99, tags: ['best', 'new'] },
  { id: 3, name: 'Striped Shirt', image: 'p2', category: 'Women’s Wear', discount: 20, rating: 4.5, reviews: 150, price: 27.99, oldPrice: 34.99, tags: ['best', 'top'] },
  { id: 4, name: 'Denim Jacket', image: 'p3', category: 'Men’s Wear', discount: 0, rating: 4.4, reviews: 76, price: 49.99, oldPrice: 0, tags: ['new'] },
  { id: 5, name: 'Floral Wrap Dress', image: 'p4', category: 'Women’s Wear', discount: 20, rating: 4.5, reviews: 89, price: 31.99, oldPrice: 39.99, tags: ['best', 'new', 'top'] },
  { id: 6, name: 'Denim Jacket & Tee Set', image: 'c1', cover: true, category: 'Men’s Wear', discount: 15, rating: 4.6, reviews: 64, price: 54.99, oldPrice: 64.99, tags: ['new', 'top'] },
  { id: 7, name: 'Pink Court Sneakers', image: 'c2', cover: true, category: 'Shoes', discount: 0, rating: 4.7, reviews: 212, price: 52.99, oldPrice: 0, tags: ['best', 'top'] },
  { id: 8, name: 'Blush Structured Handbag', image: 'c3', cover: true, category: 'Bags', discount: 20, rating: 4.5, reviews: 97, price: 39.99, oldPrice: 49.99, tags: ['best', 'new'] },
  { id: 9, name: 'Retro Round Sunglasses', image: 'c4', cover: true, category: 'Sunglasses', discount: 20, rating: 4.3, reviews: 58, price: 19.99, oldPrice: 24.99, tags: ['new'] },
  { id: 10, name: 'Gold Ring Necklace', image: 'c5', cover: true, category: 'Jewellery', discount: 0, rating: 4.8, reviews: 141, price: 24.99, oldPrice: 0, tags: ['top'] },
  { id: 11, name: 'Rose Leather Watch', image: 'c6', cover: true, category: 'Accessories', discount: 10, rating: 4.6, reviews: 103, price: 44.99, oldPrice: 49.99, tags: ['best', 'top'] },
]

export const TABS: ReadonlyArray<readonly [Tag, string]> = [
  ['best', 'Best Seller'],
  ['new', 'New Arrivals'],
  ['top', 'Top Rated'],
]

export const CATEGORY_IMAGES: Record<Category, ImageKey> = {
  'Women’s Wear': 'c0',
  'Men’s Wear': 'c1',
  Shoes: 'c2',
  Bags: 'c3',
  Sunglasses: 'c4',
  Jewellery: 'c5',
  Accessories: 'c6',
}

export const DESCRIPTIONS: Record<Category, string> = {
  'Women’s Wear': 'A flattering, easy-to-wear piece in soft, breathable fabric. Dress it up with heels or down with sneakers.',
  'Men’s Wear': 'A relaxed everyday layer in a durable, comfortable fabric that works across seasons.',
  Shoes: 'Cushioned insoles and a grippy sole make these comfortable from morning to night.',
  Bags: 'A roomy, structured bag with an inner pocket for your phone and keys.',
  Sunglasses: 'Lightweight frames with UV400 lenses for all-day comfort.',
  Jewellery: 'A delicate piece with a polished gold finish that goes with everything.',
  Accessories: 'A clean dial and a soft strap that stay comfortable all day.',
}

export const BRANDS = ['ZARA', 'H&M', 'MANGO', 'LEVI’S', 'GUESS', 'NIKE', 'adidas']

export const FREE_SHIPPING_FROM = 50
export const MAX_PRICE = 60

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES = ['6', '7', '8', '9', '10']

export const findProduct = (id: number) => PRODUCTS.find((p) => p.id === id)

export const sizesOf = (p: Product): string[] =>
  p.category === 'Shoes' ? SHOE_SIZES : /Wear/.test(p.category) ? CLOTHING_SIZES : []

/** the middle size is pre-selected; products without sizes use "" */
export const defaultSize = (p: Product) => {
  const sizes = sizesOf(p)
  return sizes[Math.floor(sizes.length / 2)] ?? ''
}
