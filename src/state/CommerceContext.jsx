import { createContext, useContext, useMemo, useState } from 'react'
import {
  previewAddresses,
  previewCoupons,
  previewOrders,
  previewWallet,
} from '../data/previewCommerce'

const STORAGE_KEY = 'jain-farms-web-preview-commerce-v1'

const initialState = {
  session: null,
  wishlistIds: [],
  addresses: previewAddresses,
  orders: previewOrders,
  wallet: previewWallet,
  appliedCoupon: null,
}

function loadState() {
  try {
    return { ...initialState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }
  } catch {
    return initialState
  }
}

const CommerceContext = createContext(null)

export function CommerceProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [notice, setNotice] = useState(null)

  const update = (change) => {
    setState((current) => {
      const next = typeof change === 'function' ? change(current) : { ...current, ...change }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 2200)
  }

  const value = useMemo(
    () => ({
      ...state,
      coupons: previewCoupons,
      notice,
      requestOtp: async (phone) => ({ phone, previewCode: '123456' }),
      verifyOtp: async (phone, code) => {
        if (code !== '123456') throw new Error('Use 123456 for this frontend preview.')
        update((current) => ({
          ...current,
          session: {
            phone,
            profileComplete: false,
            name: '',
            email: '',
          },
        }))
      },
      completeProfile: ({ name, email }) =>
        update((current) => ({
          ...current,
          session: { ...current.session, name, email, profileComplete: true },
        })),
      updateProfile: ({ name, email }) =>
        update((current) => ({ ...current, session: { ...current.session, name, email } })),
      signOut: () => update((current) => ({ ...current, session: null })),
      toggleWishlist: (productId) => {
        const adding = !state.wishlistIds.includes(productId)
        update((current) => ({
          ...current,
          wishlistIds: current.wishlistIds.includes(productId)
            ? current.wishlistIds.filter((id) => id !== productId)
            : [...current.wishlistIds, productId],
        }))
        showNotice(adding ? 'Added to wishlist' : 'Removed from wishlist')
      },
      saveAddress: (address) =>
        update((current) => {
          const id = address.id || `address-${Date.now()}`
          const nextAddress = { ...address, id }
          const exists = current.addresses.some((item) => item.id === id)
          let addresses = exists
            ? current.addresses.map((item) => (item.id === id ? nextAddress : item))
            : [...current.addresses, nextAddress]
          if (nextAddress.isDefault) {
            addresses = addresses.map((item) => ({ ...item, isDefault: item.id === id }))
          }
          return { ...current, addresses }
        }),
      deleteAddress: (id) =>
        update((current) => ({
          ...current,
          addresses: current.addresses.filter((address) => address.id !== id),
        })),
      setDefaultAddress: (id) =>
        update((current) => ({
          ...current,
          addresses: current.addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
          })),
        })),
      applyCoupon: (code) => update((current) => ({ ...current, appliedCoupon: code })),
      removeCoupon: () => update((current) => ({ ...current, appliedCoupon: null })),
      placeOrder: (order) => {
        const next = {
          id: `order-${Date.now()}`,
          number: `JF-${String(Date.now()).slice(-5)}`,
          date: new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }).format(new Date()),
          status: 'Order placed',
          ...order,
        }
        update((current) => ({ ...current, orders: [next, ...current.orders] }))
        return next
      },
    }),
    [notice, state],
  )

  return (
    <CommerceContext.Provider value={value}>
      {children}
      {notice && (
        <div className="site-toast" role="status">
          {notice}
        </div>
      )}
    </CommerceContext.Provider>
  )
}

export function useCommerce() {
  const context = useContext(CommerceContext)
  if (!context) throw new Error('useCommerce must be used inside CommerceProvider')
  return context
}
