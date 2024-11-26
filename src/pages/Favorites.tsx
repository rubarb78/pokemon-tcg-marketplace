import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import CardGrid from '../components/CardGrid'
import { useFavorites } from '../hooks/useFavorites'
import useCart from '../hooks/useCart'

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites()
  const { addItem: addToCart } = useCart()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Mes Favoris
        </Typography>
        {favorites.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary" sx={{ py: 4 }}>
            Vous n'avez pas encore de cartes favorites
          </Typography>
        ) : (
          <CardGrid
            cards={favorites}
            onAddToCart={addToCart}
            onAddToFavorites={toggleFavorite}
          />
        )}
      </Box>
    </Container>
  )
}

export default Favorites
