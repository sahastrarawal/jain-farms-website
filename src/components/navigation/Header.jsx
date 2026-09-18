import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../../data/assets'
import { homepage, navigation } from '../../data/content'
import { useCart } from '../../state/CartContext'
import { useCatalogData } from '../../state/CatalogContext'
import { useCommerce } from '../../state/CommerceContext'
import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Primitives'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()
  const { count, setOpen } = useCart()
  const { products } = useCatalogData()
  const { session, wishlistIds } = useCommerce()
  const suggestions = products
    .filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 4)

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span>{homepage.announcement}</span>
        <Link to="/contact">
          Delivery help <Icon name="arrow" size={16} />
        </Link>
      </div>
      <header className="site-header">
        <div className="container--wide header-row">
          <IconButton
            className="mobile-only"
            label="Open menu"
            icon="menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(true)}
          />
          <Link to="/" className="logo-link" aria-label="Jain Farms home">
            <img src={assets.logo} alt="Jain Farms" />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <form
            className="header-search"
            role="search"
            onSubmit={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setSearchFocused(false)
            }}
          >
            <Icon name="search" />
            <label className="sr-only" htmlFor="header-search">
              Search products
            </label>
            <input
              id="header-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fresh produce…"
            />
            <button aria-label="Search" type="submit">
              <Icon name="arrow" />
            </button>
            {searchFocused && query.trim() && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={() => setSearchFocused(false)}
                  >
                    <img src={product.images[0]} alt="" />
                    <span>
                      <strong>{product.name}</strong>
                      <small>From ₹{product.price}</small>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </form>
          <div className="header-actions">
            <Link
              className="icon-button header-heart"
              to="/wishlist"
              aria-label={`Wishlist with ${wishlistIds.length} products`}
            >
              <Icon name="heart" />
              {wishlistIds.length > 0 && <span className="cart-count">{wishlistIds.length}</span>}
            </Link>
            <Link
              className="icon-button desktop-only"
              to={session ? '/account' : '/login'}
              aria-label={session ? 'Account' : 'Login'}
            >
              <Icon name="user" />
            </Link>
            <IconButton label={`Open cart with ${count} items`} onClick={() => setOpen(true)}>
              <Icon name="bag" />
              <span className="cart-count" aria-live="polite">
                {count}
              </span>
            </IconButton>
          </div>
        </div>
      </header>
      <div
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-nav__head">
          <img src={assets.logo} alt="Jain Farms" />
          <IconButton label="Close menu" icon="close" onClick={() => setMenuOpen(false)} />
        </div>
        <nav>
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
              {item.label}
              <Icon name="arrow" />
            </NavLink>
          ))}
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            Our story
            <Icon name="arrow" />
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
            <Icon name="arrow" />
          </NavLink>
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist <Icon name="arrow" />
          </NavLink>
          <NavLink to={session ? '/account' : '/login'} onClick={() => setMenuOpen(false)}>
            {session ? 'Your account' : 'Login / Sign up'} <Icon name="arrow" />
          </NavLink>
        </nav>
      </div>
      {menuOpen && (
        <button className="overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}
