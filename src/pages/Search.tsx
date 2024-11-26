import React, { useState } from 'react'
import { Container, Typography, Box, CircularProgress } from '@mui/material'
import SearchBar from '../components/SearchBar'
import CardGrid from '../components/CardGrid'
import { searchCards } from '../utils/api'
import { PokemonCard } from '../types'
import useCart from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'

const Search = () => {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [loading, setLoading] = useState(false)
  const { addItem: addToCart } = useCart()
  const { toggleFavorite } = useFavorites()

  const handleSearch = async (query: string) => {
    setLoading(true)
    try {
      const results = await searchCards(query)
      setCards(results)
    } catch (error) {
      console.error('Error searching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Rechercher des cartes
        </Typography>
        <Box sx={{ mb: 4 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CardGrid
            cards={cards}
            onAddToCart={addToCart}
            onAddToFavorites={toggleFavorite}
          />
        )}
      </Box>
    </Container>
  )
}

export default Search
