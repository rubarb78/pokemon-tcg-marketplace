import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PokemonCard } from '../types'

interface CartItem {
  card: PokemonCard
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (card: PokemonCard) => void
  removeItem: (cardId: string) => void
  updateQuantity: (cardId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (card) => {
        const items = get().items
        const existingItem = items.find((item) => item.card.id === card.id)
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.card.id === card.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({ items: [...items, { card, quantity: 1 }] })
        }
      },
      removeItem: (cardId) => {
        set({ items: get().items.filter((item) => item.card.id !== cardId) })
      },
      updateQuantity: (cardId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.card.id === cardId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (total, item) =>
            total + item.card.cardmarket.prices.averageSellPrice * item.quantity,
          0
        ),
    }),
    {
      name: 'cart-storage',
    }
  )
)

export default useCart
