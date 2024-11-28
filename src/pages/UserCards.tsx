import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
} from '@mui/material';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

interface UserCard {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  userEmail: string;
  timestamp: Date;
}

const UserCards = () => {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserCards();
  }, []);

  const fetchUserCards = async () => {
    try {
      const q = query(
        collection(db, 'userCards'),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const cardsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserCard[];
      setCards(cardsList);
    } catch (error) {
      console.error('Error fetching user cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user || !image || !title || !price) return;
    setUploading(true);

    try {
      // Upload image
      const imageRef = ref(storage, `userCards/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Save card data
      await addDoc(collection(db, 'userCards'), {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date(),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setOpenDialog(false);
      
      // Refresh cards
      await fetchUserCards();
    } catch (error) {
      console.error('Error adding card:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h4" gutterBottom>
          Cartes des Collectionneurs
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          disabled={!user}
        >
          Proposer une carte
        </Button>
      </Box>

      {!user && (
        <Paper sx={{ p: 2, mb: 4, bgcolor: 'warning.light' }}>
          <Typography>
            Connectez-vous pour proposer vos cartes à la vente
          </Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}>
              <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.title}
                sx={{ 
                  pt: '100%',
                  objectFit: 'contain',
                  background: 'linear-gradient(45deg, #f3f4f6 0%, #fff 100%)'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {card.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {card.price}€
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proposé par {card.userEmail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Proposer une carte</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Prix (€)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {image ? 'Changer l\'image' : 'Ajouter une image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Typography variant="body2" color="text.secondary">
                Image sélectionnée: {image.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !price || !image || uploading}
            variant="contained"
          >
            {uploading ? <CircularProgress size={24} /> : 'Publier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserCards;
