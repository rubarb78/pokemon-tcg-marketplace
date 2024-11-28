import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  CircularProgress,
  Grid,
  Button
} from '@mui/material';
import { RareCardDisplay } from '../components/RareCardDisplay';
import { rarePokemonService } from '../services/RarePokemonService';
import { RarePokemonCard } from '../types';
import { Link } from 'react-router-dom';

export const RareCardsPage: React.FC = () => {
  const [cards, setCards] = useState<RarePokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const rareCards = await rarePokemonService.getTopRareCards();
        setCards(rareCards);
      } catch (error) {
        console.error('Error loading rare cards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          component={Link} 
          to="/" 
          variant="outlined" 
          sx={{ mb: 2 }}
        >
          Retour à l'accueil
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Cartes Pokémon les Plus Rares
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Découvrez les cartes Pokémon les plus rares et les plus chères au monde.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item xs={12} key={card.id || card.name}>
            <RareCardDisplay card={card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RareCardsPage;
