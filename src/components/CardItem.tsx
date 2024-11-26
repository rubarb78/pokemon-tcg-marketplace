import React from 'react'
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Box } from '@mui/material'
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { PokemonCard } from '../types'
import { useFavorites } from '../hooks/useFavorites'

interface CardItemProps {
  card: PokemonCard
  onAddToCart?: (card: PokemonCard) => void
  onAddToFavorites?: (card: PokemonCard) => void
}

const CardItem: React.FC<CardItemProps> = ({ card, onAddToCart, onAddToFavorites }) => {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleCardClick = () => {
    navigate(`/card/${card.id}`)
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={card.images.small}
        alt={card.name}
        sx={{ cursor: 'pointer', objectFit: 'contain', pt: 2 }}
        onClick={handleCardClick}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {card.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prix: {card.cardmarket.prices.averageSellPrice}€
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <IconButton
            onClick={() => onAddToCart?.(card)}
            color="primary"
            aria-label="add to cart"
          >
            <AddShoppingCart />
          </IconButton>
          <IconButton
            onClick={() => {
              toggleFavorite(card)
              onAddToFavorites?.(card)
            }}
            color="primary"
            aria-label="add to favorites"
          >
            {isFavorite(card.id) ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  )
}

export default CardItem
