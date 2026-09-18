import { categories as sampleCategories } from '../data/categories'
import { products as sampleProducts } from '../data/products'
import { adaptCatalog } from './catalogAdapters'
import { customerApi, isApiConfigured } from './customerApi'

let catalogRequest

const sampleCatalog = {
  products: sampleProducts,
  categories: sampleCategories,
  banners: [],
}

async function fetchCatalog() {
  if (!isApiConfigured()) return sampleCatalog

  const [rawCategories, rawProducts, banners] = await Promise.all([
    customerApi.categories(),
    customerApi.products(),
    customerApi.banners(),
  ])

  return {
    ...adaptCatalog(rawCategories, rawProducts),
    banners: Array.isArray(banners) ? banners : [],
  }
}

function getCatalog({ refresh = false } = {}) {
  if (refresh || !catalogRequest) {
    catalogRequest = fetchCatalog().catch((error) => {
      catalogRequest = undefined
      throw error
    })
  }
  return catalogRequest
}

export const catalogService = {
  getCatalog,
  refresh: () => getCatalog({ refresh: true }),
}
