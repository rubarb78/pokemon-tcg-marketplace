import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { OrderService, Order } from '../services/OrderService'
import { PaymentService } from '../services/PaymentService'
import { useCart } from './useCart'
import { QueryDocumentSnapshot } from 'firebase/firestore'

export const useOrder = () => {
  const { user } = useAuth()
  const cart = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const orderService = OrderService.getInstance()
  const paymentService = PaymentService.getInstance()

  const fetchOrders = useCallback(async (reset = false) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const result = await orderService.getUserOrders(user.uid, reset ? null : lastDoc)
      
      setOrders(reset ? result.orders : [...orders, ...result.orders])
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des commandes')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }, [user, lastDoc, orders])

  const createOrder = async (
    paymentMethod: 'stripe' | 'paypal',
    shippingAddress?: Order['shippingAddress']
  ) => {
    if (!user) throw new Error('User must be authenticated')
    if (cart.items.length === 0) throw new Error('Cart is empty')

    try {
      setLoading(true)
      setError(null)

      let paymentId: string

      if (paymentMethod === 'stripe') {
        await paymentService.createCheckoutSession(cart.items)
        return // Stripe will redirect to checkout
      } else {
        const paypalOrder = await paymentService.createPayPalOrder(cart.items)
        paymentId = paypalOrder.id
      }

      const orderData: Omit<Order, 'id' | 'date'> = {
        userId: user.uid,
        items: cart.items,
        total: cart.total(),
        status: 'pending',
        paymentMethod,
        paymentId,
        shippingAddress
      }

      const orderId = await orderService.createOrder(orderData)
      cart.clearCart()
      await fetchOrders(true)
      
      return orderId
    } catch (err) {
      setError('Une erreur est survenue lors de la création de la commande')
      console.error('Error creating order:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const capturePayPalOrder = async (orderId: string) => {
    try {
      setLoading(true)
      setError(null)

      await paymentService.capturePayPalOrder(orderId)
      await orderService.updateOrderStatus(orderId, 'completed')
      await fetchOrders(true)
    } catch (err) {
      setError('Une erreur est survenue lors de la capture du paiement PayPal')
      console.error('Error capturing PayPal order:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    orders,
    loading,
    error,
    hasMore,
    fetchOrders,
    createOrder,
    capturePayPalOrder
  }
}
