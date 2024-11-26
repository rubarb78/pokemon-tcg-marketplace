import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material'
import { getCardById } from '../utils/api'
import { PokemonCard } from '../types'
import useCart from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'

const CardDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [card, setCard] = useState<PokemonCard | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem: addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return
      try {
        const cardData = await getCardById(id)
        setCard(cardData)
      } catch (error) {
        console.error('Error fetching card:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCard()
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!card) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ py: 8 }}>
          Carte non trouvée
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={card.images.large}
                alt={card.name}
                sx={{ width: '100%', objectFit: 'contain' }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {card.name}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Prix du marché
                </Typography>
                <Typography variant="h5" color="primary">
                  {card.cardmarket.prices.averageSellPrice}€
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(card)}
                  fullWidth
                >
                  Ajouter au panier
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => toggleFavorite(card)}
                  fullWidth
                >
                  {isFavorite(card.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
              </Box>
              {/* Ajoutez ici d'autres détails de la carte si nécessaire */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default CardDetail
