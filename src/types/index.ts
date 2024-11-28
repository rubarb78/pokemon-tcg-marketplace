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

export interface RarePokemonCard extends PokemonCard {
  rarity: {
    rank: number
    description: string
    estimatedValue: number
    lastKnownSale?: {
      date: string
      price: number
      condition: string
      source: string
    }
  }
  images: {
    small: string
    large: string
    back?: {
      small: string
      large: string
    }
  }
  historicalPrices?: {
    date: string
    price: number
    condition: string
    source: string
  }[]
}
