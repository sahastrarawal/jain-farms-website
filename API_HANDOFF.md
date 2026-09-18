# Jain Farms Website — Frontend API Handoff

The website currently runs with frontend preview data when `VITE_API_BASE_URL` is not configured. Keep the UI components unchanged and replace the boundaries below with backend calls.

| Feature              | Current frontend source                                | Expected API data                                             | Connection point                                               |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------- |
| Authentication       | `CommerceContext` preview OTP (`123456`)               | Firebase token exchange, access token, customer, expiry       | `src/state/CommerceContext.jsx`, `src/services/customerApi.js` |
| Profile              | Persisted browser preview state                        | Customer ID, phone, name, optional email, profile completion  | `CommerceContext`, `ProfilePage`                               |
| Categories           | Local catalogue fallback                               | Active categories with slug, order and image                  | `catalogService.js`, `catalogAdapters.js`                      |
| Products             | Local catalogue fallback                               | Product, inventory, price, MRP, images, metadata and variants | `catalogService.js`, `catalogAdapters.js`                      |
| Product detail       | Catalogue lookup                                       | Full product by ID/slug, gallery and active variants          | `ProductPage.jsx`, `customerApi.js`                            |
| Banners              | Local hero fallback                                    | Placement, platform, image, CTA/deep link and order           | `catalogService.js`, `HomePage.jsx`                            |
| Previously Bought    | `previewHomeCollections` IDs                           | Delivered-order product history for authenticated customer    | `previewCommerceService.js`, `HomePage.jsx`                    |
| Spotlight            | `previewHomeCollections` IDs                           | Admin-managed ordered product collection                      | `previewCommerceService.js`, `HomePage.jsx`                    |
| New Launches         | `previewHomeCollections` IDs                           | Admin-managed ordered product collection                      | `previewCommerceService.js`, `HomePage.jsx`                    |
| Search               | Client-side catalogue search                           | Optional server search by product name                        | `SearchPage.jsx`                                               |
| Filters              | Client-side metadata adapter                           | Origin, seasonal flag and colour on products                  | `productMetadata.js`, `ShopPage.jsx`                           |
| Wishlist             | Browser-persisted product IDs                          | Customer wishlist CRUD                                        | `CommerceContext.jsx`, `WishlistButton.jsx`                    |
| Cart                 | LocalStorage; existing conditional server-cart adapter | Customer cart items and totals                                | `CartContext.jsx`, `customerApi.js`                            |
| Coupons              | `previewCoupons`                                       | Available coupons, eligibility and computed discount          | `previewCommerce.js`, `CartPage.jsx`                           |
| Addresses            | `previewAddresses` with browser CRUD                   | Address list, create, update, delete and default selection    | `CommerceContext.jsx`, `AddressesPage`                         |
| Delivery dates/slots | Frontend-generated four dates and fixed window         | Deliverable dates/windows for selected PIN/address            | `previewCommerceService.js`, `CheckoutPage`                    |
| Checkout             | Frontend order creation                                | Validated address, delivery and payment order placement       | `CheckoutPage`, `customerApi.js`                               |
| Orders               | `previewOrders`                                        | Customer orders and fulfillment status                        | `CommerceContext.jsx`, `OrdersPage`                            |
| Reorder              | Adds preview order product IDs to cart                 | Backend reorder response and unavailable items                | `OrdersPage`, `CartContext.jsx`                                |
| Wallet               | `previewWallet`                                        | Refund balance, reward points and ledger                      | `CommerceContext.jsx`, `WalletPage`                            |

## Boundary rules

- `src/data/previewCommerce.js` contains preview business data only.
- `src/services/previewCommerceService.js` exposes replaceable Home and delivery reads.
- `src/state/CommerceContext.jsx` owns frontend-only customer state and persistence.
- Do not move API requests directly into presentational cards, sections or forms.
- Preserve anonymous cart contents when exchanging them for an authenticated server cart.
