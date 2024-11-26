import React from 'react'
import { Grid } from '@mui/material'
import CardItem from './CardItem'
import { PokemonCard } from '../types'

interface CardGridProps {
  cards: PokemonCard[]
  onAddToCart?: (card: PokemonCard) => void
  onAddToFavorites?: (card: PokemonCard) => void
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onAddToCart, onAddToFavorites }) => {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={6} md={4} lg={3}>
          <CardItem
            card={card}
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default CardGrid
