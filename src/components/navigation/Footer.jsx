import { Link } from 'react-router-dom'
import { assets } from '../../data/assets'
import { Icon } from '../ui/Icon'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-trust">
        <div>
          <Icon name="sprout" />
          <strong>Thoughtfully sourced</strong>
          <span>Picked with quality and freshness in mind.</span>
        </div>
        <div>
          <Icon name="check" />
          <strong>5-level quality check</strong>
          <span>Carefully reviewed before it reaches your home.</span>
        </div>
        <div>
          <Icon name="bag" />
          <strong>Farm-to-home care</strong>
          <span>Packed for dependable neighbourhood delivery.</span>
        </div>
      </div>
      <div className="container footer-main">
        <div className="footer-brand">
          <img src={assets.logo} alt="Jain Farms" />
          <p>
            Good food, brighter days. Fresh produce and pantry essentials selected for homes that
            care about what they eat.
          </p>
        </div>
        <div>
          <strong>Shop</strong>
          <Link to="/shop">All products</Link>
          <Link to="/collections/fresh-fruits">Fresh fruits</Link>
          <Link to="/collections/fresh-vegetables">Vegetables</Link>
        </div>
        <div>
          <strong>Jain Farms</strong>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/account">Your account</Link>
        </div>
        <div>
          <strong>Customer care</strong>
          <span>Delivery across Pune</span>
          <span>3 PM – 7 PM delivery window</span>
          <span>Carefully packed every day</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Jain Farms</span>
        <span>Goodness grows.</span>
      </div>
    </footer>
  )
}
