import axios from 'axios';

const API_URL = 'https://api.pokemontcg.io/v2';

export interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  cardmarket: {
    prices: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
    };
  };
  set: {
    name: string;
    series: string;
  };
  rarity: string;
}

class PokemonTCGService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_POKEMON_TCG_API_KEY || '';
  }

  private getHeaders() {
    return {
      'X-Api-Key': this.apiKey,
    };
  }

  async searchCards(query: string, page = 1, pageSize = 20): Promise<{ data: PokemonCard[], totalCount: number }> {
    try {
      const response = await axios.get(`${API_URL}/cards`, {
        headers: this.getHeaders(),
        params: {
          q: query,
          page,
          pageSize,
        },
      });
      return {
        data: response.data.data,
        totalCount: response.data.totalCount,
      };
    } catch (error) {
      console.error('Error searching cards:', error);
      throw error;
    }
  }

  async getCardById(id: string): Promise<PokemonCard> {
    try {
      const response = await axios.get(`${API_URL}/cards/${id}`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting card:', error);
      throw error;
    }
  }
}

export const pokemonTCGService = new PokemonTCGService();
