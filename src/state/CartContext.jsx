import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { customerApi } from '../services/customerApi'
import { readCustomerSession } from '../services/sessionService'
import { useCatalogData } from './CatalogContext'

const CART_STORAGE_KEY = 'jain-farms-cart'

function readStoredCart() {
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY))
    return Array.isArray(storedCart) ? storedCart : []
  } catch {
    return []
  }
}

function getLineItemKey(product, variant) {
  return `${product.id}:${variant.id}`
}

function mapServerCart(cart, products) {
  return (cart?.items || []).flatMap((item) => {
    const product = products.find((candidate) => String(candidate.id) === String(item.product_id))
    if (!product) return []
    const variant =
      product.variants.find(
        (candidate) => String(candidate.backendId) === String(item.variant_id),
      ) || product.variants[0]
    return [
      {
        key: getLineItemKey(product, variant),
        product,
        variant: { ...variant, price: Number(item.unit_price) },
        quantity: Number(item.quantity),
      },
    ]
  })
}

const CartContext = createContext(null)
export function CartProvider({ children }) {
  const { products } = useCatalogData()
  const [session] = useState(readCustomerSession)
  const usesServerCart = Boolean(session?.token && session?.customer?.customer_id)
  const [items, setItems] = useState(() => (usesServerCart ? [] : readStoredCart()))
  const [isOpen, setOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!usesServerCart) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items, usesServerCart])

  const applyServerCart = useCallback(
    (cart) => {
      setItems(mapServerCart(cart, products))
      setError(null)
    },
    [products],
  )

  useEffect(() => {
    if (!usesServerCart || products.length === 0) return
    customerApi.cart(session.token).then(applyServerCart).catch(setError)
  }, [applyServerCart, products.length, session?.token, usesServerCart])

  const addItem = useCallback(
    async (product, variant, quantity = 1) => {
      const key = getLineItemKey(product, variant)
      if (usesServerCart) {
        const existingQuantity = items.find((item) => item.key === key)?.quantity || 0
        try {
          const cart = await customerApi.setCartItem(session.token, {
            product_id: product.id,
            variant_id: variant.backendId ?? null,
            quantity: existingQuantity + quantity,
          })
          applyServerCart(cart)
          setOpen(true)
        } catch (nextError) {
          setError(nextError)
        }
        return
      }
      setItems((current) => {
        const found = current.find((item) => item.key === key)
        return found
          ? current.map((item) =>
              item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
            )
          : [...current, { key, product, variant, quantity }]
      })
      setOpen(true)
    },
    [applyServerCart, items, session?.token, usesServerCart],
  )

  const updateQuantity = useCallback(
    async (key, quantity) => {
      if (usesServerCart) {
        const item = items.find((candidate) => candidate.key === key)
        if (!item) return
        try {
          const cart =
            quantity < 1
              ? await customerApi.removeCartItem(
                  session.token,
                  item.product.id,
                  item.variant.backendId,
                )
              : await customerApi.setCartItem(session.token, {
                  product_id: item.product.id,
                  variant_id: item.variant.backendId ?? null,
                  quantity,
                })
          applyServerCart(cart)
        } catch (nextError) {
          setError(nextError)
        }
        return
      }
      setItems((current) =>
        quantity < 1
          ? current.filter((item) => item.key !== key)
          : current.map((item) => (item.key === key ? { ...item, quantity } : item)),
      )
    },
    [applyServerCart, items, session?.token, usesServerCart],
  )

  const removeItem = useCallback(
    async (key) => {
      if (usesServerCart) {
        const item = items.find((candidate) => candidate.key === key)
        if (!item) return
        try {
          applyServerCart(
            await customerApi.removeCartItem(
              session.token,
              item.product.id,
              item.variant.backendId,
            ),
          )
        } catch (nextError) {
          setError(nextError)
        }
        return
      }
      setItems((current) => current.filter((item) => item.key !== key))
    },
    [applyServerCart, items, session?.token, usesServerCart],
  )

  const clearCart = useCallback(() => {
    if (usesServerCart) {
      setError(new Error('Clearing a server cart will be connected with the checkout API.'))
      return
    }
    setItems([])
  }, [usesServerCart])

  const value = useMemo(
    () => ({
      items,
      isOpen,
      setOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      error,
      usesServerCart,
      count: items.reduce((n, item) => n + item.quantity, 0),
      subtotal: items.reduce((n, item) => n + item.variant.price * item.quantity, 0),
    }),
    [addItem, clearCart, error, isOpen, items, removeItem, updateQuantity, usesServerCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
