import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { CartItem } from '../types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export class PaymentService {
  private static instance: PaymentService
  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async createCheckoutSession(items: CartItem[]) {
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      const response = await axios.post('/api/create-checkout-session', {
        items: items.map(item => ({
          cardId: item.card.id,
          quantity: item.quantity,
          price: item.card.cardmarket.prices.averageSellPrice
        }))
      })

      const { sessionId } = response.data
      const result = await stripe.redirectToCheckout({
        sessionId
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Payment error:', error)
      throw error
    }
  }

  async createPayPalOrder(items: CartItem[]) {
    try {
      const response = await axios.post('/api/create-paypal-order', {
        items: items.map(item => ({
          cardId: item.card.id,
          quantity: item.quantity,
          price: item.card.cardmarket.prices.averageSellPrice
        }))
      })
      
      return response.data
    } catch (error) {
      console.error('PayPal order creation error:', error)
      throw error
    }
  }

  async capturePayPalOrder(orderId: string) {
    try {
      const response = await axios.post(`/api/capture-paypal-order/${orderId}`)
      return response.data
    } catch (error) {
      console.error('PayPal capture error:', error)
      throw error
    }
  }
}
