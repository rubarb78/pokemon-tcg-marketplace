import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, CircularProgress, Box } from '@mui/material';
import CardDetail from '../components/CardDetail';
import { PokemonCard } from '../types';

const CardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<PokemonCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        // Ici, vous devrez implémenter l'appel à votre API pour récupérer les détails de la carte
        // const response = await fetch(`your-api-endpoint/${id}`);
        // const data = await response.json();
        // setCard(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching card details:', error);
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!card) {
    return null;
  }

  const handleAddToCart = (card: PokemonCard) => {
    // Implémentez la logique d'ajout au panier ici
    console.log('Adding to cart:', card);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CardDetail card={card} onAddToCart={handleAddToCart} />
    </Container>
  );
};

export default CardDetailPage;
