// Stripe product configuration
export const STRIPE_PRODUCTS = {
  month_recurring: {
    productId: 'prod_UDpvvaKHkiMatb',
    priceId: 'price_1TFOFvEm5dlcFnN4GN8mva86',
    name: 'Month Recurring',
    description: 'Monthly recurring contribution',
    price: 1.00,
    currency: 'usd',
    mode: 'subscription' as const,
  },
  recurring_donation: {
    productId: 'prod_UDpuDn1ioap2LQ',
    priceId: 'price_1TFOEZEm5dlcFnN4lv9ps6Cn',
    name: 'Recurring Donation',
    description: 'Recurring Donation',
    price: 5.00,
    currency: 'usd',
    mode: 'subscription' as const,
  },
  training_support: {
    productId: 'prod_UCc44KnOES6aBc',
    priceId: 'price_1TECqQEm5dlcFnN40XqZe2Jk',
    name: 'Training Support',
    description: 'Help cover training materials and resources for one service member',
    price: 50.00,
    currency: 'usd',
    mode: 'subscription' as const,
  },
} as const;

export type StripeProduct = (typeof STRIPE_PRODUCTS)[keyof typeof STRIPE_PRODUCTS];