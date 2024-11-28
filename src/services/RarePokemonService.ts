import axios from 'axios';
import { RarePokemonCard } from '../types';

class RarePokemonService {
  private static instance: RarePokemonService;
  private rareCards: RarePokemonCard[] = [
    {
      id: "pikachu-illustrator",
      name: "Pikachu Illustrator",
      frontImage: "https://assets.tcgcollector.com/build/images/cards/pokemon/sm12/243_pikachu_illustrator.jpg",
      backImage: "https://i.ebayimg.com/images/g/MqwAAOSwYXxgxPNv/s-l1600.jpg",
      rarity: {
        rank: 1,
        description: "La carte la plus rare et la plus chère au monde",
        estimatedValue: 5400000
      },
      lastKnownSale: {
        date: "2021-07-02",
        price: 5275000,
        currency: "EUR",
        location: "Japon"
      },
      historicalPrices: [
        { date: "2019-01-01", price: 195000 },
        { date: "2020-01-01", price: 233000 },
        { date: "2021-01-01", price: 5275000 }
      ],
      description: "Créée en 1998 pour un concours d'illustration au Japon. Seuls 39 exemplaires ont été distribués."
    },
    {
      id: "trophy-trainer-no2",
      name: "Trophy Trainer Card No. 2",
      frontImage: "https://i.ebayimg.com/images/g/r~QAAOSwQjZXP5eb/s-l1600.jpg",
      backImage: "https://i.ebayimg.com/images/g/r~QAAOSwQjZXP5eb/s-l1600.back.jpg",
      rarity: {
        rank: 2,
        description: "Une des cartes promotionnelles les plus rares",
        estimatedValue: 2000000
      },
      lastKnownSale: {
        date: "2021-08-15",
        price: 1900000,
        currency: "EUR",
        location: "États-Unis"
      },
      historicalPrices: [
        { date: "2019-01-01", price: 85000 },
        { date: "2020-01-01", price: 150000 },
        { date: "2021-01-01", price: 1900000 }
      ],
      description: "Carte trophée distribuée lors du tournoi Super Secret Battle au Japon en 1999."
    },
    {
      id: "prerelease-raichu",
      name: "Prerelease Raichu",
      frontImage: "https://i.ebayimg.com/images/g/YVwAAOSwv9hW4Kq6/s-l1600.jpg",
      backImage: "https://i.ebayimg.com/images/g/YVwAAOSwv9hW4Kq6/s-l1600.back.jpg",
      rarity: {
        rank: 3,
        description: "Une des cartes test les plus rares",
        estimatedValue: 850000
      },
      lastKnownSale: {
        date: "2020-10-12",
        price: 825000,
        currency: "EUR",
        location: "États-Unis"
      },
      historicalPrices: [
        { date: "2018-01-01", price: 250000 },
        { date: "2019-01-01", price: 450000 },
        { date: "2020-01-01", price: 825000 }
      ],
      description: "Carte test de préproduction. Seulement 10 exemplaires connus."
    },
    {
      id: "pokemon-snap-magikarp",
      name: "Pokemon Snap Magikarp",
      frontImage: "https://i.ebayimg.com/images/g/0~sAAOSwQYZWu8oL/s-l1600.jpg",
      backImage: "https://i.ebayimg.com/images/g/0~sAAOSwQYZWu8oL/s-l1600.back.jpg",
      rarity: {
        rank: 4,
        description: "Carte promotionnelle très rare du jeu Pokemon Snap",
        estimatedValue: 750000
      },
      lastKnownSale: {
        date: "2021-03-20",
        price: 735000,
        currency: "EUR",
        location: "Japon"
      },
      historicalPrices: [
        { date: "2019-01-01", price: 200000 },
        { date: "2020-01-01", price: 450000 },
        { date: "2021-01-01", price: 735000 }
      ],
      description: "Carte promotionnelle du jeu Pokemon Snap N64. Très peu d'exemplaires distribués."
    },
    {
      id: "espeon-gold-star",
      name: "Espeon Gold Star",
      frontImage: "https://i.ebayimg.com/images/g/qZ4AAOSwQYZWu8oM/s-l1600.jpg",
      backImage: "https://i.ebayimg.com/images/g/qZ4AAOSwQYZWu8oM/s-l1600.back.jpg",
      rarity: {
        rank: 5,
        description: "Une des cartes Gold Star les plus rares",
        estimatedValue: 700000
      },
      lastKnownSale: {
        date: "2021-05-15",
        price: 680000,
        currency: "EUR",
        location: "États-Unis"
      },
      historicalPrices: [
        { date: "2019-01-01", price: 150000 },
        { date: "2020-01-01", price: 400000 },
        { date: "2021-01-01", price: 680000 }
      ],
      description: "Version Gold Star d'Espeon. Moins de 100 exemplaires connus."
    },
    {
      id: "master-scroll",
      name: "Master's Scroll",
      frontImage: "https://i.ebayimg.com/images/g/ab4AAOSwv9hW4Kq7/s-l1600.jpg",
      backImage: "https://i.ebayimg.com/images/g/ab4AAOSwv9hW4Kq7/s-l1600.back.jpg",
      rarity: {
        rank: 6,
        description: "Carte promotionnelle très rare des tournois",
        estimatedValue: 650000
      },
      lastKnownSale: {
        date: "2021-06-10",
        price: 630000,
        currency: "EUR",
        location: "Japon"
      },
      historicalPrices: [
        { date: "2019-01-01", price: 120000 },
        { date: "2020-01-01", price: 350000 },
        { date: "2021-01-01", price: 630000 }
      ],
      description: "Carte donnée aux vainqueurs de tournois majeurs au Japon. Très peu d'exemplaires."
    },
    {
      id: "base1-4",
      name: "Charizard",
      images: {
        small: "https://images.pokemontcg.io/base1/4.png",
        large: "https://images.pokemontcg.io/base1/4_hires.png",
        back: {
          small: "https://images.pokemontcg.io/base1/back.png",
          large: "https://images.pokemontcg.io/base1/back_hires.png"
        }
      },
      cardmarket: {
        prices: {
          averageSellPrice: 399.99,
          lowPrice: 299.99,
          trendPrice: 449.99
        }
      },
      rarity: {
        rank: 1,
        description: "1ère édition Dracaufeu Base Set PSA 10",
        estimatedValue: 420000,
        lastKnownSale: {
          date: "2022-03-19",
          price: 420000,
          condition: "PSA 10",
          source: "PWCC Marketplace"
        }
      },
      historicalPrices: [
        {
          date: "2022-03-19",
          price: 420000,
          condition: "PSA 10",
          source: "PWCC Marketplace"
        },
        {
          date: "2020-10-10",
          price: 220000,
          condition: "PSA 10",
          source: "Heritage Auctions"
        }
      ]
    },
    {
      id: "base1-2",
      name: "Blastoise",
      images: {
        small: "https://images.pokemontcg.io/base1/2.png",
        large: "https://images.pokemontcg.io/base1/2_hires.png",
        back: {
          small: "https://images.pokemontcg.io/base1/back.png",
          large: "https://images.pokemontcg.io/base1/back_hires.png"
        }
      },
      cardmarket: {
        prices: {
          averageSellPrice: 199.99,
          lowPrice: 149.99,
          trendPrice: 249.99
        }
      },
      rarity: {
        rank: 5,
        description: "1ère édition Tortank Base Set PSA 10",
        estimatedValue: 45000,
        lastKnownSale: {
          date: "2021-11-15",
          price: 45000,
          condition: "PSA 10",
          source: "eBay"
        }
      },
      historicalPrices: [
        {
          date: "2021-11-15",
          price: 45000,
          condition: "PSA 10",
          source: "eBay"
        },
        {
          date: "2020-08-15",
          price: 28000,
          condition: "PSA 10",
          source: "PWCC Marketplace"
        }
      ]
    }
  ];

  private constructor() {}

  public static getInstance(): RarePokemonService {
    if (!RarePokemonService.instance) {
      RarePokemonService.instance = new RarePokemonService();
    }
    return RarePokemonService.instance;
  }

  public getRareCards(): RarePokemonCard[] {
    return this.rareCards;
  }

  public getRareCardById(id: string): RarePokemonCard | undefined {
    return this.rareCards.find(card => card.id === id);
  }

  public getTopRareCards(limit: number = 5): RarePokemonCard[] {
    return this.rareCards
      .sort((a, b) => b.rarity.estimatedValue - a.rarity.estimatedValue)
      .slice(0, limit);
  }

  public getCardPriceHistory(id: string): { date: string; price: number }[] {
    const card = this.getRareCardById(id);
    return card ? card.historicalPrices : [];
  }
}

export const rarePokemonService = RarePokemonService.getInstance();
