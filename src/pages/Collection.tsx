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
} from '@mui/material';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { PokemonCard } from '../services/PokemonTCGService';

interface CollectionCard extends PokemonCard {
  docId: string;
  status: 'keep' | 'sell' | 'trade';
  price?: number;
}

const Collection = () => {
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null);
  const [price, setPrice] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCollection();
    }
  }, [user]);

  const loadCollection = async () => {
    if (!user) return;

    try {
      const q = query(collection(db, 'collection'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const cardsData = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as CollectionCard),
        docId: doc.id,
      }));
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading collection:', error);
    }
  };

  const handleStatusChange = async (card: CollectionCard, newStatus: 'keep' | 'sell' | 'trade') => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'collection'), {
        ...card,
        userId: user.uid,
        status: newStatus,
        price: newStatus === 'sell' ? parseFloat(price) : undefined,
      });
      
      if (card.docId) {
        await deleteDoc(doc(db, 'collection', card.docId));
      }

      loadCollection();
      setSelectedCard(null);
      setPrice('');
    } catch (error) {
      console.error('Error updating card status:', error);
    }
  };

  const handleCardClick = (card: CollectionCard) => {
    setSelectedCard(card);
    setPrice(card.price?.toString() || '');
  };

  const handleCloseDialog = () => {
    setSelectedCard(null);
    setPrice('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ma Collection
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <Card onClick={() => handleCardClick(card)} sx={{ cursor: 'pointer' }}>
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
                  Status: {card.status}
                </Typography>
                {card.status === 'sell' && card.price && (
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    {card.price.toFixed(2)} €
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedCard} onClose={handleCloseDialog}>
        <DialogTitle>{selectedCard?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Choisissez le status de cette carte :
            </Typography>
            {selectedCard?.status === 'sell' && (
              <TextField
                fullWidth
                label="Prix de vente (€)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleStatusChange(selectedCard!, 'keep')}>Garder</Button>
          <Button onClick={() => handleStatusChange(selectedCard!, 'trade')}>Échanger</Button>
          <Button onClick={() => handleStatusChange(selectedCard!, 'sell')}>Vendre</Button>
          <Button onClick={handleCloseDialog}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Collection;
