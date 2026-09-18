import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../state/CartContext'
import {
  Breadcrumbs,
  Button,
  EmptyState,
  QuantitySelector,
  SkeletonGrid,
} from '../components/ui/Primitives'
import { Icon } from '../components/ui/Icon'
import { ProductSection } from '../components/sections/HomeSections'
import { WishlistButton } from '../components/product/WishlistButton'
import { productMetadata } from '../data/productMetadata'
import { getComparePrice, getDiscountPercentage, getUnitPrice } from '../utils/pricing'
import { useCatalogData } from '../state/CatalogContext'

export function ProductPage() {
  const { slug } = useParams()
  const { products, loading, error, refresh } = useCatalogData()
  const product = products.find((p) => p.slug === slug)
  const [variantId, setVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  useEffect(() => {
    if (product) {
      setVariantId(product.variants[0].id)
      setQuantity(1)
    }
  }, [product])
  if (loading)
    return (
      <div className="container section">
        <SkeletonGrid />
      </div>
    )
  if (error)
    return (
      <div className="container section">
        <EmptyState
          title="We couldn’t load this product."
          copy={error.message}
          action={<Button onClick={refresh}>Try again</Button>}
        />
      </div>
    )
  if (!product)
    return (
      <div className="container section">
        <EmptyState
          title="We couldn’t find that product."
          copy="It may be out of season or listed under a new name."
          action={<Button to="/shop">Browse all products</Button>}
        />
      </div>
    )
  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0]
  const comparePrice = getComparePrice(product, variant)
  const discountPercentage = getDiscountPercentage(variant.price, comparePrice)
  const unitPrice = getUnitPrice(variant)
  const metadata = productMetadata(product)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  return (
    <>
      <section className="product-page container">
        <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />
        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-gallery__main">
              <img src={product.images[0]} alt={product.name} />
              {product.badges[0] && <span>{product.badges[0]}</span>}
              <WishlistButton className="wishlist-button--detail" productId={product.id} />
            </div>
            {product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((image, index) => (
                  <button key={image} type="button">
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="product-info">
            <p className="eyebrow">{product.category.replaceAll('-', ' ')}</p>
            <h1>{product.name}</h1>
            {product.rating && (
              <div className="product-rating">
                <span aria-label={`${product.rating} out of 5 stars`}>★★★★★</span>
                <span>
                  {product.rating} · {product.reviewCount} reviews
                </span>
              </div>
            )}
            <p className="product-price">
              ₹{variant.price} {comparePrice && <del>₹{comparePrice}</del>}
              {discountPercentage > 0 && <mark>{discountPercentage}% off</mark>}
              <small>Inclusive of taxes</small>
            </p>
            {unitPrice && <p className="detail-unit-price">{unitPrice}</p>}
            <p className="product-description">{product.description}</p>
            <fieldset className="variant-selector">
              <legend>Choose size</legend>
              {product.variants.map((v) => (
                <label className={variantId === v.id ? 'selected' : ''} key={v.id}>
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={variantId === v.id}
                    onChange={() => setVariantId(v.id)}
                  />
                  <span>{v.label}</span>
                  <strong>₹{v.price}</strong>
                  {getUnitPrice(v) && <small>{getUnitPrice(v)}</small>}
                </label>
              ))}
            </fieldset>
            <div className="product-actions">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                disabled={!product.available}
                variant={product.available ? 'primary' : 'disabled'}
                onClick={() => addItem(product, variant, quantity)}
              >
                {product.available ? 'Add to basket' : 'Currently unavailable'}
              </Button>
            </div>
            <Button
              className="button--wide"
              variant="secondary"
              disabled={!product.available}
              onClick={() => addItem(product, variant, quantity)}
            >
              Add & view cart
            </Button>
            <div className="delivery-card">
              <Icon name="pin" />
              <div>
                <strong>Delivery across Pune</strong>
                <p>
                  Order before 7:00 AM for the next available delivery cycle. Final slot shown at
                  checkout.
                </p>
              </div>
            </div>
            <details open>
              <summary>Product details</summary>
              <p>
                {product.description} Store as appropriate for the product and consume while fresh.
              </p>
            </details>
            <div className="product-discovery">
              <div>
                <span>Origin</span>
                <strong>{metadata.origin}</strong>
              </div>
              <div>
                <span>Season</span>
                <strong>{metadata.seasonal ? 'Seasonal' : 'Non-seasonal'}</strong>
              </div>
              <div>
                <span>Colour</span>
                <strong>{metadata.colour}</strong>
              </div>
            </div>
            <details>
              <summary>Sourcing & quality</summary>
              <p>
                Procured through Jain Farms’ trusted supplier network and checked for quality before
                packing.
              </p>
            </details>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <ProductSection
          eyebrow="Keep exploring"
          title="More from this collection."
          copy="Build a basket around the same considered category."
          products={related}
        />
      )}
    </>
  )
}
