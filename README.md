# Jain Farms Storefront

A responsive React ecommerce frontend for Jain Farms. It uses the same `/customer/*` backend
contract as `mobile-jain-farms`, while remaining a separate web frontend.

## Backend setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to the same API origin used by the mobile app.
3. Start the website with `pnpm dev`.

With an API URL configured, the website loads categories, products, and banners from:

- `GET /customer/categories`
- `GET /customer/products`
- `GET /customer/banners`

An unavailable configured API is shown as an error with a retry action; the website does not
silently display stale sample products. If `VITE_API_BASE_URL` is omitted, local sample data is used
so frontend-only development remains possible.

## Customer and cart synchronization

The cart is prepared for the mobile backend contract. After web Firebase sign-in exchanges an ID
token at `POST /customer/auth/firebase`, save the returned response with
`storeCustomerSession()` from `src/services/sessionService.js`. Authenticated carts then use:

- `GET /customer/cart`
- `PUT /customer/cart/items`
- `DELETE /customer/cart/items/:productId`

Until Firebase web configuration and a sign-in screen are supplied, unauthenticated visitors keep
a browser-local cart. This avoids inventing credentials and keeps the storefront usable during
development.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm format
pnpm format:check
```

## Source map

- `src/styles/tokens.css` — centralized brand, typography, spacing, radius, and motion tokens.
- `src/styles/components.css` — base component and page layouts.
- `src/styles/style-02.css` — compact premium commerce foundation.
- `src/styles/style-02-fullwidth.css` — active full-width Idea 02 composition.
- `src/components/ui` — reusable interface primitives.
- `src/components` — navigation, product, cart, and homepage domain components.
- `src/pages` — route-level composition.
- `src/data` — sample catalogue fallback and editorial website content.
- `src/services/customerApi.js` — shared mobile-compatible customer API client.
- `src/services/catalogAdapters.js` — backend-to-website view-model mapping.
- `src/state/CatalogContext.jsx` — one catalogue request shared by every website route.
- `src/state/CartContext.jsx` — authenticated server cart with an anonymous local fallback.
- `src/utils` — framework-independent helpers.

## Data contract

Components only consume normalized website models from `CatalogContext`; they do not import mock
products or transport response shapes. Keep transport changes inside `src/services` when the
backend evolves. Representative products in `src/data/products.js` are development-only.

## Styling conventions

Use semantic variables from `tokens.css` instead of adding raw brand colors to components. Reuse
the existing spacing scale and component classes before introducing one-off values.
