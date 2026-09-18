import { useCatalogData } from '../state/CatalogContext'
import { CategorySection, Hero, ProductSection } from '../components/sections/HomeSections'
import { Footer } from '../components/navigation/Footer'
import { previewCommerceService } from '../services/previewCommerceService'

export function HomePage() {
  const { products, categories, banners, loading } = useCatalogData()
  const collections = previewCommerceService.homeCollections()
  const byId = new Map(products.map((product) => [product.id, product]))
  const select = (ids) => ids.flatMap((id) => byId.get(id) || [])
  const previouslyBoughtProducts = select(collections.previouslyBought)
  const spotlightProducts = select(collections.spotlight)
  const newLaunchProducts = select(collections.newLaunches)
  const topBanner = banners.find((banner) => banner.placement === 'home_top')

  return (
    <>
      <Hero banner={topBanner} />
      <CategorySection categories={categories} />
      <ProductSection
        tone="fresh"
        eyebrow="Your familiar picks"
        title="Previously Bought"
        copy="A preview of the products from your recent Jain Farms baskets."
        products={previouslyBoughtProducts}
        layout="rail"
        loading={loading}
      />
      <ProductSection
        eyebrow="Thoughtfully selected"
        title="In the Spotlight"
        copy="Seasonal favourites and pantry essentials worth discovering now."
        products={spotlightProducts}
        layout="rail"
        loading={loading}
      />
      <ProductSection
        tone="warm"
        eyebrow="Fresh additions"
        title="New Launches"
        copy="The latest additions to the Jain Farms market."
        products={newLaunchProducts}
        layout="rail"
        loading={loading}
      />
      <Footer />
    </>
  )
}
