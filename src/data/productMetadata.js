const categoryDefaults = {
  'fresh-fruits': { origin: 'India', colour: 'Mixed', seasonal: true },
  'exotic-fruits': { origin: 'Imported & Indian farms', colour: 'Mixed', seasonal: true },
  'fresh-vegetables': { origin: 'Maharashtra', colour: 'Farm fresh', seasonal: true },
  'exotic-vegetables': { origin: 'Selected Indian farms', colour: 'Mixed', seasonal: true },
  'dry-fruits': { origin: 'Trusted growing regions', colour: 'Natural', seasonal: false },
  'desi-ghee': { origin: 'India', colour: 'Golden', seasonal: false },
  snacks: { origin: 'India', colour: 'Natural', seasonal: false },
  grocery: { origin: 'India', colour: 'Natural', seasonal: false },
}

const productOverrides = {
  p1: { origin: 'Maharashtra, India', colour: 'Ruby pink' },
  p3: { origin: 'Maharashtra, India', colour: 'Pearl white' },
  p4: { origin: 'Vietnam', colour: 'Red' },
  p5: { origin: 'Kashmir, India', colour: 'Red & gold' },
  p8: { origin: 'Saudi Arabia', colour: 'Deep brown' },
  p10: { origin: 'India', colour: 'Golden' },
}

export function productMetadata(product) {
  return {
    ...(categoryDefaults[product.category] || categoryDefaults.grocery),
    seasonal: Boolean(product.seasonal),
    ...productOverrides[product.id],
  }
}
