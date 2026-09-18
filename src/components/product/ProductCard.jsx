import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productMetadata } from '../../data/productMetadata'
import { useCart } from '../../state/CartContext'
import { getComparePrice, getDiscountPercentage, getUnitPrice } from '../../utils/pricing'
import { Badge, Button, EmptyState, QuantitySelector, SkeletonGrid } from '../ui/Primitives'
import { WishlistButton } from './WishlistButton'

export function ProductCard({ product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const { items, addItem, updateQuantity } = useCart()
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0]
  const cartItem = items.find((item) => item.key === `${product.id}:${variantId}`)
  const comparePrice = getComparePrice(product, variant)
  const discountPercentage = getDiscountPercentage(variant.price, comparePrice)
  const unitPrice = getUnitPrice(variant)
  const metadata = productMetadata(product)
  const badgeTone = (badge) =>
    badge.includes('%')
      ? 'accent'
      : badge.toLowerCase().includes('popular') || badge.toLowerCase().includes('premium')
        ? 'soft'
        : 'brand'

  return (
    <article className={`product-card ${!product.available ? 'is-unavailable' : ''}`}>
      <Link className="product-card__image" to={`/products/${product.slug}`}>
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <div className="product-card__badges">
          {product.badges.slice(0, 1).map((badge) => (
            <Badge key={badge} tone={badgeTone(badge)}>
              {badge}
            </Badge>
          ))}
          {!product.available && <Badge tone="neutral">Sold out</Badge>}
        </div>
        <WishlistButton productId={product.id} />
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{metadata.origin}</span>
          <span>{metadata.seasonal ? 'Seasonal' : 'Everyday'}</span>
        </div>
        <h3>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="product-card__variant">
          {product.variants.length > 1 ? (
            <label className="select-wrap">
              <span className="sr-only">Choose size</span>
              <select value={variantId} onChange={(event) => setVariantId(event.target.value)}>
                {product.variants.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span className="unit">{variant.label}</span>
          )}
        </div>
        <div className="product-card__purchase">
          <div className="product-card__price">
            <span className="price">₹{variant.price}</span>
            {comparePrice && <span className="compare-price">₹{comparePrice}</span>}
            {unitPrice && <small className="unit-price">{unitPrice}</small>}
            {discountPercentage > 0 && <small className="saving">Save {discountPercentage}%</small>}
          </div>
          {!product.available ? (
            <Button variant="disabled" disabled>
              Unavailable
            </Button>
          ) : cartItem ? (
            <QuantitySelector
              value={cartItem.quantity}
              onChange={(quantity) => updateQuantity(cartItem.key, quantity)}
            />
          ) : (
            <Button
              className="product-add"
              variant="outline"
              onClick={() => addItem(product, variant)}
            >
              <span>Add</span>
              <strong>+</strong>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({
  products,
  layout = 'grid',
  loading = false,
  emptyTitle = 'No products found.',
  emptyCopy = 'Try another category or filter.',
}) {
  if (loading) return <SkeletonGrid />
  if (!products?.length) return <EmptyState compact title={emptyTitle} copy={emptyCopy} />
  return (
    <div className={`product-grid product-grid--${layout}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
