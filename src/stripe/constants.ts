const { STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL } = process.env

if (!STRIPE_API_KEY || !STRIPE_WEBHOOK_SECRET || !STRIPE_SUCCESS_URL || !STRIPE_CANCEL_URL) {
  throw new Error('Stripe environment variables are missing')
}

export const constants = {
  apiKey: STRIPE_API_KEY,
  webhookSecret: STRIPE_WEBHOOK_SECRET,
  successUrl: STRIPE_SUCCESS_URL,
  cancelUrl: STRIPE_CANCEL_URL
}
