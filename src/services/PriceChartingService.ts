import axios from 'axios';

interface PriceChartingResponse {
  name: string;
  loose_price: number;
  graded_price?: number;
  last_updated: string;
}

class PriceChartingService {
  private static BASE_URL = 'https://www.pricecharting.com/api/product';

  static async getCardPrice(cardName: string, setName: string): Promise<PriceChartingResponse | null> {
    try {
      // Format the search query
      const query = `pokemon ${setName} ${cardName}`.toLowerCase();
      
      const response = await axios.get(`${this.BASE_URL}`, {
        params: {
          t: query,
          format: 'json'
        }
      });

      if (response.data && response.data.loose_price) {
        return {
          name: response.data.name,
          loose_price: response.data.loose_price,
          graded_price: response.data.graded_price,
          last_updated: response.data.last_updated
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching price from PriceCharting:', error);
      return null;
    }
  }

  static async comparePrice(tcgPrice: number, cardName: string, setName: string): Promise<{
    tcgPrice: number;
    priceChartingPrice: number | null;
    difference: number | null;
    recommendation: string;
  }> {
    const priceChartingData = await this.getCardPrice(cardName, setName);
    
    if (!priceChartingData) {
      return {
        tcgPrice,
        priceChartingPrice: null,
        difference: null,
        recommendation: "Prix PriceCharting non disponible"
      };
    }

    const priceChartingPrice = priceChartingData.loose_price;
    const difference = tcgPrice - priceChartingPrice;
    const percentDifference = (difference / priceChartingPrice) * 100;

    let recommendation = "";
    if (Math.abs(percentDifference) <= 10) {
      recommendation = "Prix compétitif (±10% du marché)";
    } else if (percentDifference > 10) {
      recommendation = "Prix au-dessus du marché";
    } else {
      recommendation = "Prix en dessous du marché";
    }

    return {
      tcgPrice,
      priceChartingPrice,
      difference,
      recommendation
    };
  }
}

export default PriceChartingService;
