import {
  createPreviewDeliveryDates,
  previewCoupons,
  previewDeliverySlots,
  previewHomeCollections,
} from '../data/previewCommerce'

export const previewCommerceService = {
  homeCollections: () => previewHomeCollections,
  coupons: () => previewCoupons,
  deliveryOptions: () => ({ dates: createPreviewDeliveryDates(), slots: previewDeliverySlots }),
}
