import { Link } from 'react-router-dom'
import { Icon } from './Icon'

export function Button({ children, variant = 'primary', to, className = '', ...props }) {
  const classNames = `button button--${variant} ${className}`.trim()
  return to ? (
    <Link className={classNames} to={to} {...props}>
      {children}
    </Link>
  ) : (
    <button type="button" className={classNames} {...props}>
      {children}
    </button>
  )
}
export function IconButton({ label, icon, children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      {children || <Icon name={icon} />}
    </button>
  )
}
export function Badge({ children, tone = 'brand' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
export function QuantitySelector({ value, onChange, label = 'Quantity' }) {
  return (
    <div className="quantity" aria-label={label}>
      <IconButton
        label="Decrease quantity"
        icon="minus"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      />
      <output aria-live="polite">{value}</output>
      <IconButton label="Increase quantity" icon="plus" onClick={() => onChange(value + 1)} />
    </div>
  )
}
export function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, index) => (
        <span key={item.label}>
          <span aria-hidden="true">/</span>
          {item.to && index < items.length - 1 ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
export function EmptyState({ title, copy, action, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'empty-state--compact' : ''}`}>
      <span className="empty-state__leaf" aria-hidden="true">
        ☘
      </span>
      <h2>{title}</h2>
      <p>{copy}</p>
      {action}
    </div>
  )
}
export function SkeletonGrid() {
  return (
    <div className="product-grid" aria-label="Loading products">
      {[1, 2, 3, 4].map((n) => (
        <div className="skeleton-card" key={n}>
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  )
}
