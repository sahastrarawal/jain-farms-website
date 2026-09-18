import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../state/CartContext'
import { Button, EmptyState, IconButton, QuantitySelector } from '../ui/Primitives'

export function CartDrawer() {
  const { pathname } = useLocation()
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal, count } = useCart()
  const hidesFloatingCart = ['/login', '/register', '/cart', '/checkout'].includes(pathname)

  useEffect(() => {
    document.body.classList.toggle('drawer-open', isOpen)

    if (!isOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.classList.remove('drawer-open')
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, setOpen])

  return (
    <>
      {count > 0 &&
        !isOpen &&
        !hidesFloatingCart &&
        !pathname.startsWith('/order-confirmation/') && (
          <button className="mobile-cart-bar" type="button" onClick={() => setOpen(true)}>
            <span>
              {count} items · ₹{subtotal}
            </span>
            <strong>View cart</strong>
          </button>
        )}
      {isOpen && (
        <button className="overlay" aria-label="Close cart" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Shopping cart"
        aria-modal="true"
        inert={!isOpen}
        role="dialog"
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Your basket</span>
            <h2>{count ? `${count} fresh pick${count > 1 ? 's' : ''}` : 'Cart'}</h2>
          </div>
          <IconButton label="Close cart" icon="close" onClick={() => setOpen(false)} />
        </div>
        {!items.length ? (
          <EmptyState
            title="Your basket is ready for something fresh."
            copy="Explore today’s produce, pantry staples and farm favourites."
            action={
              <Button to="/shop" onClick={() => setOpen(false)}>
                Start shopping
              </Button>
            }
          />
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.key}>
                  <img src={item.product.images[0]} alt="" />
                  <div>
                    <Link to={`/products/${item.product.slug}`} onClick={() => setOpen(false)}>
                      <h3>{item.product.name}</h3>
                    </Link>
                    <p>{item.variant.label}</p>
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(quantity) => updateQuantity(item.key, quantity)}
                    />
                  </div>
                  <div className="cart-item__end">
                    <strong>₹{item.variant.price * item.quantity}</strong>
                    <button type="button" onClick={() => removeItem(item.key)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>₹{subtotal}</strong>
              </div>
              <p>Delivery charges and final availability are confirmed at checkout.</p>
              <Button className="button--wide" to="/cart" onClick={() => setOpen(false)}>
                View cart & savings
              </Button>
              <Link to="/shop" onClick={() => setOpen(false)}>
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
