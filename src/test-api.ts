import axios from 'axios';

const API_KEY = 'b2b2c3b9-cab6-4908-acc8-c0b296524fef';
const API_URL = 'https://api.pokemontcg.io/v2';

async function testPokemonAPI() {
  try {
    const response = await axios.get(`${API_URL}/cards`, {
      headers: {
        'X-Api-Key': API_KEY
      },
      params: {
        q: 'name:charizard',
        pageSize: 10
      }
    });

    console.log('Cartes trouvées:', response.data.data.length);
    console.log('Première carte:', response.data.data[0].name);
    console.log('Prix:', response.data.data[0].cardmarket?.prices?.averageSellPrice);
    
    return response.data;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

// Test de l'API
testPokemonAPI();
