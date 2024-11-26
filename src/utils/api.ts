import { PokemonCard } from '../types'

const API_KEY = import.meta.env.VITE_POKEMON_TCG_API_KEY
const BASE_URL = 'https://api.pokemontcg.io/v2'

export const searchCards = async (query: string): Promise<PokemonCard[]> => {
  const response = await fetch(`${BASE_URL}/cards?q=name:${query}*`, {
    headers: {
      'X-Api-Key': API_KEY,
    },
  })
  const data = await response.json()
  return data.data
}

export const getCardById = async (id: string): Promise<PokemonCard> => {
  const response = await fetch(`${BASE_URL}/cards/${id}`, {
    headers: {
      'X-Api-Key': API_KEY,
    },
  })
  const data = await response.json()
  return data.data
}
