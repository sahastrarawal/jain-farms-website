import { assets } from '../data/assets'

const categoryFallbackImages = {
  'fresh-fruits': assets.categories.fruits,
  'exotic-fruits': assets.categories.fruits,
  'fresh-vegetables': assets.categories.vegetables,
  'exotic-vegetables': assets.categories.exoticVegetables,
  'dry-fruits': assets.categories.dryFruits,
  'desi-ghee': assets.categories.ghee,
  snacks: assets.categories.snacks,
  grocery: assets.categories.grocery,
}

function number(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function unitLabel(value, unit) {
  const normalizedValue = String(value ?? '').trim()
  const normalizedUnit = String(unit ?? '').trim()
  return `${normalizedValue} ${normalizedUnit}`.trim() || '1 unit'
}

function adaptCategory(category) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    shortName: category.name,
    description: category.description || `Explore fresh ${category.name.toLowerCase()}.`,
    image: category.image_url || categoryFallbackImages[category.slug] || assets.categories.grocery,
  }
}

function adaptVariant(variant, product) {
  return {
    id: variant.id,
    backendId: variant.id,
    label: variant.title || unitLabel(variant.unit_value, variant.unit),
    price: number(variant.price, number(product.price)),
    compareAtPrice: number(variant.mrp) || null,
  }
}

function adaptProduct(product, categoryById) {
  const category = categoryById.get(product.category_id)
  const rawActiveVariants = (product.variants || [])
    .filter((variant) => variant.is_active !== false)
    .sort((a, b) => number(a.display_order) - number(b.display_order))
  const activeVariants = rawActiveVariants.map((variant) => adaptVariant(variant, product))
  const defaultVariant = {
    id: `default:${product.id}`,
    backendId: null,
    label: unitLabel(product.unit_value, product.unit),
    price: number(product.price),
    compareAtPrice: number(product.mrp) || null,
  }
  const variants = activeVariants.length ? activeVariants : [defaultVariant]
  const tags = product.tags || []
  const image =
    product.image_url ||
    product.variants?.find((variant) => variant.image_url)?.image_url ||
    category?.image ||
    assets.categories.grocery

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category:
      category?.slug || product.category_name?.toLowerCase().replaceAll(' ', '-') || 'grocery',
    description: product.short_description || product.description || '',
    images: [image],
    variants,
    price: number(product.minimum_price, number(product.price)),
    compareAtPrice: number(product.mrp) || null,
    badges: tags.slice(0, 1),
    available:
      product.is_active !== false &&
      (rawActiveVariants.length
        ? rawActiveVariants.some((variant) => number(variant.stock_quantity) > 0)
        : number(product.stock_quantity) > 0),
    rating: null,
    reviewCount: 0,
    featured: tags.some((tag) => /featured|best|popular/i.test(tag)),
    seasonal: tags.some((tag) => /season|fresh|new/i.test(tag)),
    createdAt: number(product.display_order),
  }
}

export function adaptCatalog(rawCategories, rawProducts) {
  const categories = rawCategories
    .filter((category) => category.is_active !== false)
    .sort((a, b) => number(a.display_order) - number(b.display_order))
    .map(adaptCategory)
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const products = rawProducts
    .filter((product) => product.is_active !== false)
    .map((product) => adaptProduct(product, categoryById))
    .sort((a, b) => a.createdAt - b.createdAt)

  return { categories, products }
}
