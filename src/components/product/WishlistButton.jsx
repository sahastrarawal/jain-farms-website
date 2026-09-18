import { useCommerce } from '../../state/CommerceContext'
import { Icon } from '../ui/Icon'

export function WishlistButton({ productId, className = '' }) {
  const { wishlistIds, toggleWishlist } = useCommerce()
  const selected = wishlistIds.includes(productId)
  return (
    <button
      type="button"
      className={`wishlist-button ${selected ? 'is-selected' : ''} ${className}`.trim()}
      aria-label={selected ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={selected}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleWishlist(productId)
      }}
    >
      <Icon name="heart" />
    </button>
  )
}
