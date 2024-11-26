export interface PokemonCard {
  id: string
  name: string
  images: {
    small: string
    large: string
  }
  cardmarket: {
    prices: {
      averageSellPrice: number
      lowPrice: number
      trendPrice: number
    }
  }
}

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

export interface CartItem {
  card: PokemonCard
  quantity: number
}
