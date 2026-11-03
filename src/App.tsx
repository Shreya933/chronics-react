import { Route, Routes } from 'react-router-dom'
import { BackToTop, ScrollManager, Toast } from './components/Chrome'
import { CartDrawer, MenuDrawer, Scrim } from './components/Drawers'
import { Footer } from './components/Footer'
import { Header, TopBar } from './components/Header'
import { QuickView } from './components/QuickView'
import { Account } from './pages/Account'
import { Checkout } from './pages/Checkout'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProductPage } from './pages/Product'
import { Shop } from './pages/Shop'
import { Wishlist } from './pages/Wishlist'

export default function App() {
  return (
    <>
      <ScrollManager />
      <TopBar />
      <Header />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Scrim />
      <CartDrawer />
      <MenuDrawer />
      <QuickView />
      <Toast />
      <BackToTop />
    </>
  )
}
