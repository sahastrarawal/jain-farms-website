import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductCard'
import { Button, EmptyState } from '../components/ui/Primitives'
import { Icon } from '../components/ui/Icon'
import { useCatalogData } from '../state/CatalogContext'
import { useCart } from '../state/CartContext'
import { useCommerce } from '../state/CommerceContext'

function AccountShell({ title, copy, children }) {
  return (
    <section className="section account-page">
      <div className="container">
        <p className="eyebrow">Your Jain Farms</p>
        <h1>{title}</h1>
        {copy && <p className="account-intro">{copy}</p>}
        {children}
      </div>
    </section>
  )
}

export function WishlistPage() {
  const { products, loading } = useCatalogData()
  const { wishlistIds } = useCommerce()
  const saved = products.filter((product) => wishlistIds.includes(product.id))
  return (
    <AccountShell title="Wishlist" copy="Your saved farm favourites, ready when you are.">
      <ProductGrid
        products={saved}
        loading={loading}
        emptyTitle="Your wishlist is ready for something fresh."
        emptyCopy="Tap the heart on any product to save it here."
      />
    </AccountShell>
  )
}

export function AccountPage() {
  const { addresses, orders, session, signOut, wallet } = useCommerce()
  if (!session?.profileComplete) return <Navigate replace to="/login" />
  return (
    <AccountShell
      title={`Hello, ${session.name.split(' ')[0]}.`}
      copy="Manage your details, deliveries and Jain Farms activity."
    >
      <div className="account-grid">
        <Link className="account-tile account-tile--profile" to="/account/profile">
          <Icon name="user" />
          <span>
            <strong>Profile</strong>
            <small>{session.phone}</small>
          </span>
          <Icon name="arrow" />
        </Link>
        <Link className="account-tile" to="/account/addresses">
          <Icon name="pin" />
          <span>
            <strong>Saved addresses</strong>
            <small>{addresses.length} saved</small>
          </span>
          <Icon name="arrow" />
        </Link>
        <Link className="account-tile" to="/account/orders">
          <Icon name="bag" />
          <span>
            <strong>Your orders</strong>
            <small>{orders.length} orders</small>
          </span>
          <Icon name="arrow" />
        </Link>
        <Link className="account-tile" to="/wishlist">
          <Icon name="heart" />
          <span>
            <strong>Wishlist</strong>
            <small>Saved favourites</small>
          </span>
          <Icon name="arrow" />
        </Link>
        <Link className="account-tile" to="/account/wallet">
          <Icon name="wallet" />
          <span>
            <strong>Wallet</strong>
            <small>₹{wallet.refundBalance} available</small>
          </span>
          <Icon name="arrow" />
        </Link>
        <Link className="account-tile" to="/cart">
          <Icon name="ticket" />
          <span>
            <strong>Coupons & offers</strong>
            <small>View in your cart</small>
          </span>
          <Icon name="arrow" />
        </Link>
      </div>
      <button className="signout" type="button" onClick={signOut}>
        Sign out
      </button>
    </AccountShell>
  )
}

export function ProfilePage() {
  const { session, updateProfile } = useCommerce()
  const [name, setName] = useState(session?.name || '')
  const [email, setEmail] = useState(session?.email || '')
  const [saved, setSaved] = useState(false)
  if (!session?.profileComplete) return <Navigate replace to="/login" />
  return (
    <AccountShell title="Profile" copy="Keep your delivery details up to date.">
      <div className="form-card form-card--inline">
        <label className="field-label">Mobile number</label>
        <input disabled value={session.phone} />
        <label className="field-label">Name</label>
        <input value={name} onChange={(event) => setName(event.target.value)} />
        <label className="field-label">
          Email <span>Optional</span>
        </label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button
          disabled={!name.trim()}
          onClick={() => {
            updateProfile({ name: name.trim(), email: email.trim() })
            setSaved(true)
          }}
        >
          Save changes
        </Button>
        {saved && <span className="success-note">Profile saved.</span>}
      </div>
    </AccountShell>
  )
}

const blankAddress = {
  label: 'Home',
  recipientName: '',
  contactPhone: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '',
  isDefault: false,
}

export function AddressesPage() {
  const { addresses, deleteAddress, saveAddress, session, setDefaultAddress } = useCommerce()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankAddress)
  if (!session?.profileComplete) return <Navigate replace to="/login" />
  const openForm = (address = blankAddress) => {
    setEditing(address.id || 'new')
    setForm({ ...blankAddress, ...address })
  }
  const fields = [
    ['recipientName', 'Recipient name'],
    ['contactPhone', 'Contact phone'],
    ['addressLine1', 'Address line 1'],
    ['addressLine2', 'Address line 2'],
    ['landmark', 'Landmark'],
    ['city', 'City'],
    ['state', 'State'],
    ['pincode', 'PIN code'],
  ]
  return (
    <AccountShell
      title="Saved addresses"
      copy="Choose where you want your Jain Farms orders delivered."
    >
      <div className="address-grid">
        {addresses.map((address) => (
          <article
            className={`address-card ${address.isDefault ? 'is-default' : ''}`}
            key={address.id}
          >
            <div>
              <span className="address-label">{address.label}</span>
              {address.isDefault && <small>Default</small>}
            </div>
            <strong>{address.recipientName}</strong>
            <p>
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              <br />
              {address.city}, {address.state} {address.pincode}
            </p>
            <div>
              <button type="button" onClick={() => openForm(address)}>
                Edit
              </button>
              {!address.isDefault && (
                <button type="button" onClick={() => setDefaultAddress(address.id)}>
                  Set default
                </button>
              )}
              <button type="button" onClick={() => deleteAddress(address.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
        <button className="address-add" type="button" onClick={() => openForm()}>
          <strong>＋ Add new address</strong>
          <span>Home, Work or Other</span>
        </button>
      </div>
      {editing && (
        <div className="modal-backdrop" role="presentation">
          <div className="web-sheet" role="dialog" aria-modal="true" aria-label="Address form">
            <div className="sheet-head">
              <div>
                <p className="eyebrow">Delivery details</p>
                <h2>{editing === 'new' ? 'Add address' : 'Edit address'}</h2>
              </div>
              <button
                aria-label="Close address form"
                type="button"
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </div>
            <div className="address-fields">
              <label>
                Label
                <select
                  value={form.label}
                  onChange={(event) => setForm({ ...form, label: event.target.value })}
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </label>
              {fields.map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    inputMode={key === 'pincode' || key === 'contactPhone' ? 'numeric' : undefined}
                    value={form[key]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                </label>
              ))}
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) => setForm({ ...form, isDefault: event.target.checked })}
                />{' '}
                Set as default
              </label>
            </div>
            <Button
              className="button--wide"
              disabled={!form.recipientName || !form.addressLine1 || !/^\d{6}$/.test(form.pincode)}
              onClick={() => {
                saveAddress({ ...form, id: editing === 'new' ? undefined : editing })
                setEditing(null)
              }}
            >
              Save address
            </Button>
          </div>
        </div>
      )}
    </AccountShell>
  )
}

export function OrdersPage() {
  const navigate = useNavigate()
  const { products } = useCatalogData()
  const { addItem } = useCart()
  const { orders, session } = useCommerce()
  if (!session?.profileComplete) return <Navigate replace to="/login" />
  const reorder = (order) => {
    order.itemIds.forEach((id) => {
      const product = products.find((item) => item.id === id)
      if (product) addItem(product, product.variants[0])
    })
    navigate('/cart')
  }
  return (
    <AccountShell title="Your orders" copy="Order history and familiar favourites.">
      {orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <span>{order.date}</span>
                <h2>{order.number}</h2>
                <p>
                  {order.itemIds.length} items · ₹{order.total}
                </p>
              </div>
              <div>
                <strong className="status-chip">{order.status}</strong>
                <Button variant="outline" onClick={() => reorder(order)}>
                  Reorder
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No orders yet."
          copy="Your Jain Farms orders will appear here."
          action={<Button to="/shop">Start shopping</Button>}
        />
      )}
    </AccountShell>
  )
}

export function WalletPage() {
  const { session, wallet } = useCommerce()
  if (!session?.profileComplete) return <Navigate replace to="/login" />
  return (
    <AccountShell title="Wallet" copy="Refund balance and Jain Farms rewards in one place.">
      <div className="wallet-hero">
        <span>Available refund balance</span>
        <strong>₹{wallet.refundBalance}</strong>
        <p>Use this balance on an eligible order at checkout.</p>
        <div>
          <span>Reward points</span>
          <b>{wallet.rewardPoints}</b>
        </div>
      </div>
      <div className="activity-list">
        <h2>Recent activity</h2>
        {wallet.activity.map((item) => (
          <div key={item.id}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.date}</small>
            </span>
            <b className={`amount-${item.type}`}>
              {item.type === 'debit' ? '−' : '+'}
              {item.type === 'points' ? `${item.amount} pts` : `₹${item.amount}`}
            </b>
          </div>
        ))}
      </div>
    </AccountShell>
  )
}
