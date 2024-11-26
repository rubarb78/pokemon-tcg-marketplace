import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { pokemonTCGService, PokemonCard } from '../services/PokemonTCGService';
import { useAuth } from '../hooks/useAuth';

const Marketplace = () => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    searchCards();
  }, [page]);

  const searchCards = async () => {
    try {
      const { data, totalCount } = await pokemonTCGService.searchCards(searchQuery || '*', page);
      setCards(data);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error('Error searching cards:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    searchCards();
  };

  const handleBuyCard = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  const handleCloseDialog = () => {
    setSelectedCard(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Marketplace
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Rechercher des cartes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>
            Rechercher
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <Card>
              <CardMedia
                component="img"
                image={card.images.small}
                alt={card.name}
                sx={{ objectFit: 'contain', pt: 2 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {card.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Set: {card.set.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rareté: {card.rarity}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {card.cardmarket?.prices?.averageSellPrice?.toFixed(2) || 'N/A'} €
                </Typography>
                {user && (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleBuyCard(card)}
                  >
                    Acheter
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={!!selectedCard} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Acheter {selectedCard?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <Typography variant="h6">
              Prix: {selectedCard?.cardmarket?.prices?.averageSellPrice?.toFixed(2)} €
            </Typography>
            <PayPalButtons
              createOrder={(_, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: selectedCard?.cardmarket?.prices?.averageSellPrice?.toString() || '0',
                        currency_code: 'EUR',
                      },
                    },
                  ],
                });
              }}
              onApprove={async (_, actions) => {
                await actions.order?.capture();
                handleCloseDialog();
                // TODO: Save order in database
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Marketplace;
