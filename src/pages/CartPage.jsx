import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, EmptyState, QuantitySelector } from '../components/ui/Primitives'
import { ProductGrid } from '../components/product/ProductCard'
import { previewCommerceService } from '../services/previewCommerceService'
import { useCatalogData } from '../state/CatalogContext'
import { useCart } from '../state/CartContext'
import { useCommerce } from '../state/CommerceContext'
import { getComparePrice } from '../utils/pricing'

function couponDiscount(coupon, subtotal) {
  if (!coupon || subtotal < coupon.minimumOrder) return 0
  if (coupon.discount) return coupon.discount
  return Math.min(
    coupon.maximumDiscount || Infinity,
    Math.round((subtotal * coupon.percentage) / 100),
  )
}

export function CartPage() {
  const { products } = useCatalogData()
  const { items, removeItem, subtotal, updateQuantity } = useCart()
  const { appliedCoupon, applyCoupon, coupons, removeCoupon } = useCommerce()
  const selectedCoupon = coupons.find((coupon) => coupon.code === appliedCoupon)

  useEffect(() => {
    if (selectedCoupon && subtotal < selectedCoupon.minimumOrder) removeCoupon()
  }, [removeCoupon, selectedCoupon, subtotal])
  const productSavings = items.reduce(
    (total, item) =>
      total +
      Math.max(
        0,
        (getComparePrice(item.product, item.variant) || item.variant.price) - item.variant.price,
      ) *
        item.quantity,
    0,
  )
  const offerSavings = couponDiscount(selectedCoupon, subtotal)
  const deliveryFee = subtotal >= 799 ? 0 : 49
  const total = Math.max(0, subtotal - offerSavings + deliveryFee)
  const recommendations = products
    .filter((product) => !items.some((item) => item.product.id === product.id))
    .slice(0, 5)

  if (!items.length)
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="Your cart is waiting."
            copy="Add fresh picks and they’ll appear here."
            action={<Button to="/shop">Continue shopping</Button>}
          />
        </div>
      </section>
    )

  return (
    <section className="section cart-page">
      <div className="container">
        <p className="eyebrow">Your basket</p>
        <h1>Cart</h1>
        <div className="cart-layout">
          <div className="cart-main">
            <div className="cart-panel">
              <h2>
                {items.length} fresh pick{items.length === 1 ? '' : 's'}
              </h2>
              {items.map((item) => (
                <article className="cart-row" key={item.key}>
                  <img src={item.product.images[0]} alt="" />
                  <div>
                    <Link to={`/products/${item.product.slug}`}>
                      <strong>{item.product.name}</strong>
                    </Link>
                    <span>{item.variant.label}</span>
                    <span>₹{item.variant.price} each</span>
                  </div>
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(quantity) => updateQuantity(item.key, quantity)}
                  />
                  <div>
                    <b>₹{item.variant.price * item.quantity}</b>
                    <button type="button" onClick={() => removeItem(item.key)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <CouponPanel
              appliedCoupon={appliedCoupon}
              coupons={coupons}
              subtotal={subtotal}
              onApply={applyCoupon}
              onRemove={removeCoupon}
            />
            <div className="cart-panel recommendations">
              <h2>People also bought</h2>
              <ProductGrid layout="rail" products={recommendations} />
            </div>
          </div>
          <aside className="order-summary">
            <h2>Bill Details</h2>
            <div>
              <span>Basket Value</span>
              <b>₹{subtotal}</b>
            </div>
            <div className="saving-row">
              <span>Savings</span>
              <b>− ₹{productSavings + offerSavings}</b>
            </div>
            <div>
              <span>Delivery Fee</span>
              <b>{deliveryFee ? `₹${deliveryFee}` : 'FREE'}</b>
            </div>
            <hr />
            <div className="summary-total">
              <span>To Pay</span>
              <b>₹{total}</b>
            </div>
            <p>
              {deliveryFee
                ? `Add ₹${Math.max(0, 799 - subtotal)} more for free delivery.`
                : 'You unlocked free delivery.'}
            </p>
            <Button className="button--wide checkout-cta" to="/checkout">
              Choose address & delivery
            </Button>
          </aside>
        </div>
      </div>
    </section>
  )
}

function CouponPanel({ appliedCoupon, coupons, subtotal, onApply, onRemove }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="cart-panel coupon-panel">
      <div className="coupon-heading">
        <div>
          <p className="eyebrow">Coupons & offers</p>
          <h2>{appliedCoupon ? `${appliedCoupon} applied` : 'Save more on this order'}</h2>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)}>
          {open ? 'Hide offers' : 'View offers'}
        </button>
      </div>
      {appliedCoupon && (
        <div className="applied-coupon">
          <span>Offer successfully applied</span>
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}
      {open && (
        <div className="coupon-list">
          {coupons.map((coupon) => {
            const eligible = subtotal >= coupon.minimumOrder
            return (
              <article className={!eligible ? 'is-disabled' : ''} key={coupon.code}>
                <div className="coupon-code">{coupon.code}</div>
                <div>
                  <strong>{coupon.benefit}</strong>
                  <span>{coupon.title}</span>
                  <small>
                    {eligible
                      ? coupon.description
                      : `Add ₹${coupon.minimumOrder - subtotal} more to unlock`}
                  </small>
                </div>
                <Button
                  variant="outline"
                  disabled={!eligible || appliedCoupon === coupon.code}
                  onClick={() => onApply(coupon.code)}
                >
                  {appliedCoupon === coupon.code ? 'Applied' : 'Apply'}
                </Button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { clearCart, items, subtotal } = useCart()
  const { addresses, appliedCoupon, coupons, placeOrder, removeCoupon, session, wallet } =
    useCommerce()
  const { dates, slots } = useMemo(() => previewCommerceService.deliveryOptions(), [])
  const [addressId, setAddressId] = useState(
    addresses.find((item) => item.isDefault)?.id || addresses[0]?.id || '',
  )
  const [date, setDate] = useState(dates[0].id)
  const [slot, setSlot] = useState(slots[0])
  const [payment, setPayment] = useState('cod')
  const [error, setError] = useState('')
  const selectedCoupon = coupons.find((item) => item.code === appliedCoupon)
  const savings = couponDiscount(selectedCoupon, subtotal)
  const deliveryFee = subtotal >= 799 ? 0 : 49
  const total = subtotal - savings + deliveryFee
  if (!items.length)
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="Nothing to check out yet."
            copy="Add products to continue."
            action={<Button to="/shop">Shop products</Button>}
          />
        </div>
      </section>
    )
  const complete = () => {
    if (!session?.profileComplete) return navigate('/login?next=/checkout')
    if (!addressId) return setError('Choose or add a delivery address.')
    if (!date || !slot) return setError('Choose your delivery date and window.')
    const order = placeOrder({
      total,
      itemIds: items.map((item) => item.product.id),
      deliveryDate: date,
      deliverySlot: slot,
      paymentMethod: payment,
    })
    removeCoupon()
    clearCart()
    navigate(`/order-confirmation/${order.id}`, { state: { order } })
  }
  return (
    <section className="section checkout-page">
      <div className="container">
        <p className="eyebrow">Secure checkout</p>
        <h1>Delivery & payment</h1>
        <div className="checkout-layout">
          <div>
            <CheckoutBlock number="1" title="Delivery address">
              <div className="checkout-options">
                {addresses.map((address) => (
                  <label className={addressId === address.id ? 'is-selected' : ''} key={address.id}>
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === address.id}
                      onChange={() => setAddressId(address.id)}
                    />
                    <span>
                      <strong>
                        {address.label} · {address.recipientName}
                      </strong>
                      <small>
                        {address.addressLine1}, {address.city} {address.pincode}
                      </small>
                    </span>
                  </label>
                ))}
                <Link className="inline-link" to="/account/addresses">
                  Manage addresses →
                </Link>
              </div>
            </CheckoutBlock>
            <CheckoutBlock number="2" title="Delivery date">
              <div className="delivery-choices">
                {dates.map((item) => (
                  <button
                    className={date === item.id ? 'is-selected' : ''}
                    key={item.id}
                    type="button"
                    onClick={() => setDate(item.id)}
                  >
                    <strong>{item.day}</strong>
                    <span>{item.date}</span>
                  </button>
                ))}
              </div>
            </CheckoutBlock>
            <CheckoutBlock number="3" title="Delivery window">
              <div className="delivery-window is-selected">
                <input checked readOnly type="radio" />
                <span>
                  <strong>{slot}</strong>
                  <small>Fixed Jain Farms delivery window</small>
                </span>
              </div>
            </CheckoutBlock>
            <CheckoutBlock number="4" title="Payment">
              <label className="payment-option is-selected">
                <input
                  checked={payment === 'cod'}
                  name="payment"
                  type="radio"
                  onChange={() => setPayment('cod')}
                />
                <span>
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>
              <label className="payment-option">
                <input
                  checked={payment === 'wallet'}
                  disabled={wallet.refundBalance < total}
                  name="payment"
                  type="radio"
                  onChange={() => setPayment('wallet')}
                />
                <span>
                  <strong>Wallet balance</strong>
                  <small>₹{wallet.refundBalance} available</small>
                </span>
              </label>
            </CheckoutBlock>
          </div>
          <aside className="order-summary">
            <h2>Order summary</h2>
            <div>
              <span>Basket Value</span>
              <b>₹{subtotal}</b>
            </div>
            <div className="saving-row">
              <span>Savings</span>
              <b>− ₹{savings}</b>
            </div>
            <div>
              <span>Delivery Fee</span>
              <b>{deliveryFee ? `₹${deliveryFee}` : 'FREE'}</b>
            </div>
            <hr />
            <div className="summary-total">
              <span>To Pay</span>
              <b>₹{total}</b>
            </div>
            {error && <p className="form-error">{error}</p>}
            <Button className="button--wide checkout-cta" onClick={complete}>
              Place order
            </Button>
            <small>This is a frontend preview. No payment or backend order is created.</small>
          </aside>
        </div>
      </div>
    </section>
  )
}

function CheckoutBlock({ number, title, children }) {
  return (
    <section className="checkout-block">
      <div className="checkout-block__head">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

export function OrderConfirmationPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="confirmation-card">
          <span>✓</span>
          <p className="eyebrow">Order placed</p>
          <h1>Your fresh picks are confirmed.</h1>
          <p>The order is saved in this frontend preview and can be seen in Your Orders.</p>
          <div>
            <Button to="/account/orders">View orders</Button>
            <Button variant="outline" to="/">
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
