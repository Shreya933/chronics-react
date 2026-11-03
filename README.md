# Chronics – React storefront

The Chronics fashion store, rebuilt with React. Look and behaviour match the original
single-file site (screenshots compared pixel-for-pixel); only the code underneath changed.

## Stack
- **React 19 + TypeScript** (strict) built with **Vite**
- **React Router** – real URLs: `/`, `/shop`, `/product/:id`, `/wishlist`, `/checkout`, `/contact`, `/account`
- **Zustand** – cart, wishlist, account, orders, filters, checkout state, toasts, drawers
- **Zod** – form validation (checkout, contact, sign in/up, newsletter)
- **Vitest** – unit tests for pricing, formatting and validation
- Original stylesheet kept as-is in `src/index.css` (design tokens, dark mode, responsive rules)

## Run it
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/
    npm run preview    # serve the build
    npm test

## Structure
    src/
      assets/       product + hero images (extracted from the old base64 blobs)
      data/         product catalogue, categories, size rules
      store/        Zustand store (same localStorage keys as before: ch-cart, ch-wish, ch-user, ch-orders)
      lib/          money/shipping/format helpers, Zod schemas
      components/   Header, Footer, drawers, quick view, product card, form field, icons
      pages/        Home, Shop, Product, Wishlist, Checkout, Contact, Account, NotFound

## Notes
- Because routes are now real paths, a static host needs an SPA fallback to `index.html`
  (Netlify `_redirects`, Vercel rewrites, `try_files` in nginx, etc.). `npm run dev/preview` already do this.
- No payments are taken; do not enter real card details.
