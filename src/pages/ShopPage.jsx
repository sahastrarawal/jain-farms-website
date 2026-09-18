import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductCard'
import { Breadcrumbs, Button, EmptyState, SkeletonGrid } from '../components/ui/Primitives'
import { Icon } from '../components/ui/Icon'
import { useCatalogData } from '../state/CatalogContext'
import { productMetadata } from '../data/productMetadata'

const sortComparators = {
  popular: (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0),
  new: (a, b) => b.createdAt - a.createdAt,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
}

export function ShopPage({ categorySlug }) {
  const { products, categories, loading, error, refresh } = useCatalogData()
  const category = categories.find((item) => item.slug === categorySlug)
  const [sort, setSort] = useState('popular')
  const [availability, setAvailability] = useState('all')
  const [maxPrice, setMaxPrice] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [origin, setOrigin] = useState('all')
  const [season, setSeason] = useState('all')
  const [colour, setColour] = useState('all')
  const catalogMaxPrice = useMemo(() => {
    const highestPrice = Math.max(100, ...products.map((product) => product.price))
    return Math.ceil(highestPrice / 100) * 100
  }, [products])
  const effectiveMaxPrice = maxPrice ?? catalogMaxPrice

  const result = useMemo(() => {
    const categoryProducts = category
      ? products.filter((product) => product.category === category.slug)
      : products
    const availableProducts =
      availability === 'available'
        ? categoryProducts.filter((product) => product.available)
        : categoryProducts
    const productsInPriceRange = availableProducts.filter((product) => {
      const metadata = productMetadata(product)
      return (
        product.price <= effectiveMaxPrice &&
        (origin === 'all' || metadata.origin === origin) &&
        (season === 'all' || (season === 'seasonal') === metadata.seasonal) &&
        (colour === 'all' || metadata.colour === colour)
      )
    })

    return [...productsInPriceRange].sort(sortComparators[sort])
  }, [availability, category, colour, effectiveMaxPrice, origin, products, season, sort])

  const clearFilters = () => {
    setAvailability('all')
    setMaxPrice(null)
    setOrigin('all')
    setSeason('all')
    setColour('all')
  }
  const origins = [...new Set(products.map((product) => productMetadata(product).origin))]
  const colours = [...new Set(products.map((product) => productMetadata(product).colour))]
  return (
    <>
      <section className={`collection-hero ${category ? 'collection-hero--image' : ''}`}>
        <div className="container">
          <Breadcrumbs
            items={
              category
                ? [{ label: 'Shop', to: '/shop' }, { label: category.name }]
                : [{ label: 'Shop' }]
            }
          />
          <p className="eyebrow">{category ? 'Collection' : 'The complete market'}</p>
          <h1>{category?.name || 'Shop all fresh picks'}</h1>
          <p>
            {category?.description ||
              'From the everyday to the exceptional, explore produce and pantry essentials chosen with care.'}
          </p>
          <nav className="collection-chips" aria-label="Shop categories">
            {categories.map((item) => (
              <Link
                className={item.slug === category?.slug ? 'is-active' : ''}
                key={item.slug}
                to={`/collections/${item.slug}`}
              >
                {item.shortName}
              </Link>
            ))}
          </nav>
        </div>
        {category && <img src={category.image} alt="" />}
      </section>
      <section className="section collection">
        <div className="container">
          <div className="collection-toolbar">
            <span>
              <strong>{result.length}</strong> products
            </span>
            <Button
              variant="outline"
              className="filter-trigger"
              aria-expanded={filtersOpen}
              aria-controls="collection-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <Icon name="filter" /> Filters
            </Button>
            <div id="collection-filters" className={`filter-panel ${filtersOpen ? 'is-open' : ''}`}>
              <label>
                Availability
                <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                  <option value="all">All products</option>
                  <option value="available">In stock</option>
                </select>
              </label>
              <label className="price-filter">
                Price up to ₹{effectiveMaxPrice}
                <input
                  type="range"
                  min="100"
                  max={catalogMaxPrice}
                  step="100"
                  value={effectiveMaxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </label>
              <label>
                Origin
                <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
                  <option value="all">All origins</option>
                  {origins.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Season
                <select value={season} onChange={(event) => setSeason(event.target.value)}>
                  <option value="all">All products</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="everyday">Non-seasonal</option>
                </select>
              </label>
              <label>
                Colour
                <select value={colour} onChange={(event) => setColour(event.target.value)}>
                  <option value="all">All colours</option>
                  {colours.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="sort-control">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Popular</option>
                <option value="new">Newest</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>
          <main>
            {loading ? (
              <SkeletonGrid />
            ) : error ? (
              <EmptyState
                title="We couldn’t load the market."
                copy={error.message}
                action={<Button onClick={refresh}>Try again</Button>}
              />
            ) : result.length ? (
              <ProductGrid products={result} />
            ) : (
              <EmptyState
                title="Nothing fresh fits those filters."
                copy="Try widening your price range or including unavailable items."
                action={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            )}
          </main>
        </div>
      </section>
    </>
  )
}
