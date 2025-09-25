export const api = {
    baseUrl: (import.meta.env.VITE_API_URL as string) ?? (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-ten-red-40.vercel.app'),
    createCheckoutSession: '/create-checkout-session',
    createPaymentIntent: '/create-payment-intent',
}