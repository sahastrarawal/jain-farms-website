import { assets } from './assets'

export const navigation = [
  { label: 'Shop', to: '/shop' },
  { label: 'Fruits', to: '/collections/fresh-fruits' },
  { label: 'Vegetables', to: '/collections/fresh-vegetables' },
  { label: 'Dry Fruits', to: '/collections/dry-fruits' },
  { label: 'Desi Ghee', to: '/collections/desi-ghee' },
  { label: 'Snacks', to: '/collections/snacks' },
]
export const homepage = {
  announcement: 'Fresh orders close at 7:00 AM for the next delivery cycle',
  hero: {
    eyebrow: 'From farm to Pune',
    title: 'The freshest part of your day.',
    copy: 'Seasonal produce and everyday pantry essentials, thoughtfully procured and quality-checked for your home.',
    primary: { label: 'Shop fresh today', to: '/shop' },
    secondary: { label: 'How we source', to: '/about' },
    image: assets.banners.hero,
    imageAlt: 'Fresh seasonal cherries from the Jain Farms range',
  },
  promo: {
    eyebrow: 'Fresh from the source',
    title: 'Farm Fresh Goodness!',
    copy: 'Straight from farms to your home, selected and packed with care.',
    cta: { label: 'Explore grocery', to: '/collections/grocery' },
    image: assets.banners.seeds,
  },
}
