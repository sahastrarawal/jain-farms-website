import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductCard'
import { Breadcrumbs, EmptyState, SkeletonGrid } from '../components/ui/Primitives'
import { Icon } from '../components/ui/Icon'
import { useCatalogData } from '../state/CatalogContext'

const POPULAR_SEARCHES = ['Fresh fruits', 'Ghee', 'Dates', 'Snacks']

function matchesQuery(product, query) {
  const searchableText = `${product.name} ${product.description} ${product.category}`
  return searchableText.toLowerCase().includes(query.trim().toLowerCase())
}

export function SearchPage() {
  const { products, loading, error } = useCatalogData()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const results = query ? products.filter((product) => matchesQuery(product, query)) : []

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextQuery = new FormData(event.currentTarget).get('q')?.toString().trim()
    setParams(nextQuery ? { q: nextQuery } : {})
  }

  return (
    <section className="section search-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Search' }]} />
        <p className="eyebrow">Find something fresh</p>
        <h1>Search Jain Farms</h1>
        <form className="search-hero" onSubmit={handleSubmit}>
          <Icon name="search" size={28} />
          <label className="sr-only" htmlFor="search-q">
            Search products
          </label>
          <input
            id="search-q"
            name="q"
            defaultValue={query}
            placeholder="Try ‘apple’, ‘ghee’ or ‘snacks’"
            autoFocus
          />
          <button type="submit">Search</button>
        </form>
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <EmptyState title="Search is temporarily unavailable." copy={error.message} />
        ) : query ? (
          results.length ? (
            <>
              <p className="search-count">
                {results.length} result{results.length !== 1 ? 's' : ''} for “{query}”
              </p>
              <ProductGrid products={results} />
            </>
          ) : (
            <EmptyState
              title={`No matches for “${query}”`}
              copy="Check the spelling or try a broader ingredient or category."
            />
          )
        ) : (
          <div className="search-suggestions">
            <span>Popular searches</span>
            {POPULAR_SEARCHES.map((term) => (
              <button type="button" key={term} onClick={() => setParams({ q: term })}>
                {term}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
