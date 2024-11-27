import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Button
} from '@mui/material';
import { Add as AddIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { pokemonTCGService } from '../services/PokemonTCGService';
import CardDetails from '../components/CardDetails';
import { useAuth } from '../hooks/useAuth';
import { useCollection } from '../hooks/useCollection';
import { useFavorites } from '../hooks/useFavorites';

interface Card {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  set: {
    name: string;
    series: string;
    releaseDate: string;
  };
  cardmarket?: {
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
    };
  };
  rarity?: string;
}

const CardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCollection } = useCollection();
  const { addToFavorites, favorites } = useFavorites();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const cardData = await pokemonTCGService.getCard(id);
        setCard(cardData);
        setError(null);
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Erreur lors du chargement de la carte');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleAddToCollection = async () => {
    if (!card || !user) return;
    
    try {
      await addToCollection(card);
    } catch (err) {
      console.error('Error adding to collection:', err);
      setError('Erreur lors de l\'ajout à la collection');
    }
  };

  const handleAddToFavorites = async () => {
    if (!card || !user) return;
    
    try {
      await addToFavorites(card);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Erreur lors de l\'ajout aux favoris');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !card) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error || 'Carte non trouvée'}
        </Typography>
      </Container>
    );
  }

  const isFavorite = favorites.some(fav => fav.id === card.id);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <img 
              src={card.images.large} 
              alt={card.name}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {card.name}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Set: {card.set.name} ({card.set.series})
            </Typography>
            
            {card.rarity && (
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Rareté: {card.rarity}
              </Typography>
            )}

            <Box sx={{ mt: 3, mb: 4 }}>
              <CardDetails card={card} />
            </Box>

            {user && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddToCollection}
                  fullWidth
                >
                  Ajouter à ma collection
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FavoriteIcon />}
                  onClick={handleAddToFavorites}
                  color={isFavorite ? 'secondary' : 'primary'}
                  fullWidth
                >
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CardPage;
