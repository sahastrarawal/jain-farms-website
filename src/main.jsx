import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './state/CartContext'
import { CatalogProvider } from './state/CatalogContext'
import { CommerceProvider } from './state/CommerceContext'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/components.css'
import './styles/style-02-fullwidth.css'
import './styles/parity.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <CommerceProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CommerceProvider>
      </CatalogProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
