import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { PokemonCard } from '../services/PokemonTCGService';

interface CollectionCard extends PokemonCard {
  docId: string;
  status: 'keep' | 'sell' | 'trade';
  price?: number;
  quantity: number;
}

const Collection = () => {
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null);
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [status, setStatus] = useState<'keep' | 'sell' | 'trade'>('keep');
  const [quantity, setQuantity] = useState<string>('1');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCollection();
    } else {
      setCards([]);
      setLoading(false);
    }
  }, [user]);

  const loadCollection = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'collection'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const cardsData = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as CollectionCard),
        docId: doc.id,
      }));
      setCards(cardsData);
    } catch (error) {
      console.error('Erreur lors du chargement de la collection:', error);
      setError('Impossible de charger votre collection. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCard = async () => {
    if (!selectedCard || !user) return;

    try {
      const cardRef = doc(db, 'collection', selectedCard.docId);
      await updateDoc(cardRef, {
        status,
        price: status === 'sell' ? parseFloat(price) : null,
        quantity: parseInt(quantity),
      });

      setNotification('Carte mise à jour avec succès !');
      loadCollection();
      setSelectedCard(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la carte:', error);
      setError('Impossible de mettre à jour la carte. Veuillez réessayer.');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'collection', cardId));
      setNotification('Carte supprimée avec succès !');
      loadCollection();
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
      setError('Impossible de supprimer la carte. Veuillez réessayer.');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Connectez-vous pour voir votre collection
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ma Collection
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : cards.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            Votre collection est vide. Ajoutez des cartes depuis le Marketplace !
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={card.docId}>
                <Card>
                  <CardMedia
                    component="img"
                    image={card.images.small}
                    alt={card.name}
                    sx={{ objectFit: 'contain', cursor: 'pointer' }}
                    onClick={() => setSelectedCard(card)}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {card.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {card.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {card.quantity}
                    </Typography>
                    {card.status === 'sell' && card.price && (
                      <Typography variant="body2" color="text.secondary">
                        Prix: {card.price}€
                      </Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedCard(card)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCard(card.docId)}
                        sx={{ ml: 1 }}
                      >
                        Supprimer
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={!!selectedCard} onClose={() => setSelectedCard(null)}>
        <DialogTitle>Modifier la carte</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as 'keep' | 'sell' | 'trade')}
              >
                <MenuItem value="keep">Garder</MenuItem>
                <MenuItem value="sell">Vendre</MenuItem>
                <MenuItem value="trade">Échanger</MenuItem>
              </Select>
            </FormControl>

            {status === 'sell' && (
              <TextField
                label="Prix (€)"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              label="Quantité"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCard(null)}>Annuler</Button>
          <Button onClick={handleUpdateCard} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        message={notification}
      />
    </Container>
  );
};

export default Collection;
