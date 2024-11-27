import { collection, addDoc, query, where, getDocs, orderBy, limit, startAfter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { CartItem } from '../types'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  paymentMethod: 'stripe' | 'paypal'
  paymentId: string
  date: Date
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export class OrderService {
  private static instance: OrderService
  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  async createOrder(orderData: Omit<Order, 'id' | 'date'>) {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        date: Timestamp.now()
      })
      return orderRef.id
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async getUserOrders(
    userId: string,
    lastDoc?: QueryDocumentSnapshot,
    pageSize: number = 10
  ) {
    try {
      let ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(pageSize)
      )

      if (lastDoc) {
        ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('date', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        )
      }

      const snapshot = await getDocs(ordersQuery)
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      })) as Order[]

      return {
        orders,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === pageSize
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const orderRef = collection(db, 'orders')
      await addDoc(orderRef, {
        id: orderId,
        status,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }
}
