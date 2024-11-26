import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PokemonCard } from '../types'

interface FavoritesStore {
  favorites: PokemonCard[]
  addFavorite: (card: PokemonCard) => void
  removeFavorite: (cardId: string) => void
  isFavorite: (cardId: string) => boolean
  toggleFavorite: (card: PokemonCard) => void
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (card) =>
        set((state) => ({
          favorites: [...state.favorites, card],
        })),
      removeFavorite: (cardId) =>
        set((state) => ({
          favorites: state.favorites.filter((card) => card.id !== cardId),
        })),
      isFavorite: (cardId) =>
        get().favorites.some((card) => card.id === cardId),
      toggleFavorite: (card) => {
        const isFav = get().isFavorite(card.id)
        if (isFav) {
          get().removeFavorite(card.id)
        } else {
          get().addFavorite(card)
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
)
