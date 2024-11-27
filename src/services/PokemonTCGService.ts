import axios from 'axios';

const API_URL = 'https://api.pokemontcg.io/v2';

export interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  cardmarket?: {
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
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
    if (!this.apiKey) {
      console.error('Pokemon TCG API Key is missing!');
    } else {
      console.log('Pokemon TCG API Key is configured');
    }
  }

  private getHeaders() {
    return {
      'X-Api-Key': this.apiKey,
    };
  }

  async searchCards(query: string = '*', page = 1, pageSize = 20): Promise<{ data: PokemonCard[], totalCount: number }> {
    try {
      console.log('Searching cards with query:', query);
      
      const response = await axios.get(`${API_URL}/cards`, {
        headers: this.getHeaders(),
        params: {
          q: query === '*' ? 'supertype:Pokémon' : `supertype:Pokémon name:*${query}*`,
          page,
          pageSize,
          orderBy: 'name',
        },
      });

      console.log('API Response:', {
        count: response.data.count,
        totalCount: response.data.totalCount,
        pageSize: response.data.pageSize,
        page: response.data.page,
      });

      return {
        data: response.data.data,
        totalCount: response.data.totalCount || 0,
      };
    } catch (error: any) {
      console.error('Error fetching cards:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Erreur lors de la recherche des cartes'
      );
    }
  }

  async getCardById(id: string): Promise<PokemonCard> {
    try {
      const response = await axios.get(`${API_URL}/cards/${id}`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching card:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Erreur lors de la récupération de la carte'
      );
    }
  }
}

export const pokemonTCGService = new PokemonTCGService();
