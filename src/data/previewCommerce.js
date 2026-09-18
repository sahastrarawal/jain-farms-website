export const previewHomeCollections = {
  previouslyBought: ['p5', 'p10', 'p8', 'p6'],
  spotlight: ['p1', 'p5', 'p8', 'p10', 'p3'],
  newLaunches: ['p1', 'p3', 'p11', 'dev-6'],
}

export const previewCoupons = [
  {
    code: 'FRESH50',
    title: 'Fresh basket savings',
    benefit: '₹50 off',
    description: 'Valid on orders of ₹499 or more.',
    minimumOrder: 499,
    discount: 50,
  },
  {
    code: 'FARM10',
    title: 'Farm favourites',
    benefit: '10% off',
    description: 'Save up to ₹100 on orders of ₹799 or more.',
    minimumOrder: 799,
    percentage: 10,
    maximumDiscount: 100,
  },
]

export const previewAddresses = [
  {
    id: 'address-home',
    label: 'Home',
    recipientName: 'Jain Farms Customer',
    contactPhone: '9876543210',
    addressLine1: '18 Green Avenue',
    addressLine2: 'Near Central Park',
    landmark: 'Opposite the community garden',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    isDefault: true,
  },
]

export const previewWallet = {
  refundBalance: 245,
  rewardPoints: 780,
  activity: [
    {
      id: 'w1',
      title: 'Refund for order JF-1042',
      amount: 120,
      type: 'credit',
      date: '18 Aug 2026',
    },
    { id: 'w2', title: 'Used on order JF-1038', amount: 75, type: 'debit', date: '10 Aug 2026' },
    { id: 'w3', title: 'Freshness reward', amount: 200, type: 'points', date: '02 Aug 2026' },
  ],
}

export const previewOrders = [
  {
    id: 'order-1042',
    number: 'JF-1042',
    date: '18 Aug 2026',
    status: 'Delivered',
    total: 1084,
    itemIds: ['p5', 'p10', 'p8'],
  },
  {
    id: 'order-1038',
    number: 'JF-1038',
    date: '10 Aug 2026',
    status: 'Delivered',
    total: 614,
    itemIds: ['p6', 'p3', 'p11'],
  },
]

export function createPreviewDeliveryDates(now = new Date()) {
  return Array.from({ length: 4 }, (_, index) => {
    const date = new Date(now)
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() + index)
    return {
      id: date.toISOString().slice(0, 10),
      day:
        index === 0
          ? 'Today'
          : index === 1
            ? 'Tomorrow'
            : new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date),
      date: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date),
    }
  })
}

export const previewDeliverySlots = ['3 PM – 7 PM']
