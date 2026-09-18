import { Link } from 'react-router-dom'
import { homepage } from '../../data/content'
import { Icon } from '../ui/Icon'
import { Button, SkeletonGrid } from '../ui/Primitives'
import { ProductGrid } from '../product/ProductCard'

export function Hero({ banner }) {
  const h = homepage.hero
  const image = banner?.image_url || h.image
  return (
    <section className="hero container--wide">
      <div className="hero__copy">
        <p className="eyebrow">{h.eyebrow}</p>
        <h1>{h.title}</h1>
        <p>{h.copy}</p>
        <div className="hero__actions">
          <Button to={h.primary.to}>
            {h.primary.label}
            <Icon name="arrow" />
          </Button>
          <Button variant="text" to={h.secondary.to}>
            {h.secondary.label}
          </Button>
        </div>
        <div className="hero__note">
          <Icon name="pin" />
          <span>
            <strong>Pune delivery</strong>
            <small>Thoughtfully packed for your neighbourhood</small>
          </span>
        </div>
      </div>
      <div className="hero__media">
        <img src={image} alt={banner?.title || h.imageAlt} />
        <span className="hero__stamp">
          Picked for
          <br />
          <strong>freshness</strong>
        </span>
      </div>
    </section>
  )
}
export function CategorySection({ categories = [] }) {
  return (
    <section className="section category-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse the market</p>
            <h2>Categories</h2>
          </div>
          <Button variant="text" to="/shop">
            View everything <Icon name="arrow" />
          </Button>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              className={`category-card category-card--${index % 3}`}
              to={`/collections/${category.slug}`}
              key={category.slug}
            >
              <img src={category.image} alt="" loading="lazy" />
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <i>
                  <Icon name="arrow" />
                </i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
export function ProductSection({
  eyebrow,
  title,
  copy,
  products,
  tone = 'default',
  layout = 'grid',
  actionTo = '/shop',
  loading = false,
}) {
  return (
    <section className={`section product-section product-section--${tone}`}>
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div className="section-heading__aside">
            <p>{copy}</p>
            <Button variant="text" to={actionTo}>
              View all <Icon name="arrow" />
            </Button>
          </div>
        </div>
        {loading ? <SkeletonGrid /> : <ProductGrid products={products} layout={layout} />}
      </div>
    </section>
  )
}
export function PromoBanner({ banner }) {
  const p = homepage.promo
  const image = banner?.image_url || p.image
  const title = banner?.title || p.title
  return (
    <section className="container promo">
      <div className="promo__media">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="promo__copy">
        <p className="eyebrow">{p.eyebrow}</p>
        <h2>{title}</h2>
        <p>{p.copy}</p>
        <Button to={p.cta.to}>
          {p.cta.label}
          <Icon name="arrow" />
        </Button>
      </div>
    </section>
  )
}
