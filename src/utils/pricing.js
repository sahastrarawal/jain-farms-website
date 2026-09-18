export function getComparePrice(product, variant) {
  if (variant.compareAtPrice) return variant.compareAtPrice
  const isDefaultVariant = variant.id === product.variants[0].id
  return isDefaultVariant ? product.compareAtPrice : null
}

export function getDiscountPercentage(price, comparePrice) {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round((1 - price / comparePrice) * 100)
}

export function getUnitPrice(variant) {
  const label = String(variant?.label || '').toLowerCase()
  const match = label.match(/([\d.]+)\s*(kg|g|l|ml|pc|piece)/)
  if (!match) return null
  const amount = Number(match[1])
  if (!amount) return null
  const unit = match[2]
  if (unit === 'kg' || unit === 'l') return `₹${Math.round(variant.price / amount)}/${unit}`
  if (unit === 'g') return `₹${Math.round((variant.price / amount) * 1000)}/kg`
  if (unit === 'ml') return `₹${Math.round((variant.price / amount) * 1000)}/l`
  return `₹${Math.round(variant.price / amount)}/pc`
}
