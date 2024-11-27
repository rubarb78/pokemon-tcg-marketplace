import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  AddShoppingCart,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PokemonCard } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface CardDetailProps {
  card: PokemonCard;
  onAddToCart?: (card: PokemonCard) => void;
}

const CardDetail: React.FC<CardDetailProps> = ({ card, onAddToCart }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          maxWidth: 1200,
          mx: 'auto',
          mt: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" display="inline">
            {card.name}
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                component="img"
                src={card.images.large}
                alt={card.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}
              />
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {card.types?.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
                {card.rarity && (
                  <Chip
                    label={card.rarity}
                    color="secondary"
                    sx={{ borderRadius: 1 }}
                  />
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {card.hp && (
                  <Typography variant="body1">
                    HP: {card.hp}
                  </Typography>
                )}
                {card.attacks?.map((attack, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {attack.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {attack.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  {card.cardmarket.prices.averageSellPrice}€
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddShoppingCart />}
                      onClick={() => onAddToCart?.(card)}
                      sx={{ flex: 1 }}
                    >
                      Add to Cart
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IconButton
                      onClick={() => toggleFavorite(card)}
                      color="error"
                      sx={{ 
                        border: '1px solid',
                        borderColor: 'error.main',
                        '&:hover': { 
                          backgroundColor: 'error.main',
                          color: 'white'
                        }
                      }}
                    >
                      {isFavorite(card.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </motion.div>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default CardDetail;
