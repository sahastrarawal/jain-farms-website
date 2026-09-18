import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './components/navigation/Header'
import { CartDrawer } from './components/cart/CartDrawer'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { SearchPage } from './pages/SearchPage'
import { AboutPage, ContactPage } from './pages/ContentPages'
import { LoginPage, RegistrationPage } from './pages/AuthPages'
import {
  AccountPage,
  AddressesPage,
  OrdersPage,
  ProfilePage,
  WalletPage,
  WishlistPage,
} from './pages/AccountPages'
import { CartPage, CheckoutPage, OrderConfirmationPage } from './pages/CartPage'

const HOME_TITLE = 'Jain Farms — Freshness, thoughtfully delivered'

function getDocumentTitle(pathname) {
  if (pathname === '/') return HOME_TITLE

  const pageName = pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ')
  return `${pageName || 'Jain Farms'} — Jain Farms`
}

function PageEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = getDocumentTitle(pathname)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <PageEffects />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections/:slug" element={<CollectionRoute />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/addresses" element={<AddressesPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/wallet" element={<WalletPage />} />
          <Route path="*" element={<ShopPage />} />
        </Routes>
      </main>
      <CartDrawer />
    </>
  )
}

function CollectionRoute() {
  const { slug } = useParams()
  return <ShopPage categorySlug={slug} />
}
