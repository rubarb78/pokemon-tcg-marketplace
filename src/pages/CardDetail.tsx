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
  TextField,
  Divider,
  Avatar,
} from '@mui/material'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { getCardById } from '../utils/api'
import { PokemonCard } from '../types'
import useCart from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'

const CardDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [card, setCard] = useState<PokemonCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [bids, setBids] = useState<any[]>([])
  const { addItem: addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return
      try {
        const cardData = await getCardById(id)
        setCard(cardData)
        await fetchBids()
      } catch (error) {
        console.error('Error fetching card:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCard()
  }, [id])

  const fetchBids = async () => {
    if (!id) return
    const q = query(
      collection(db, 'bids'),
      where('cardId', '==', id),
      orderBy('timestamp', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const bidsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setBids(bidsList)
  }

  const handleBidSubmit = async () => {
    if (!user || !card || !bidAmount) return
    try {
      await addDoc(collection(db, 'bids'), {
        cardId: id,
        userId: user.uid,
        userEmail: user.email,
        amount: parseFloat(bidAmount),
        cardName: card.name,
        timestamp: new Date(),
      })
      setBidAmount('')
      await fetchBids()
    } catch (error) {
      console.error('Error submitting bid:', error)
    }
  }

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
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}>
              <CardMedia
                component="img"
                image={card.images.large}
                alt={card.name}
                sx={{ width: '100%', objectFit: 'contain' }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px'
            }}>
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

              {/* PayPal Integration */}
              <Box sx={{ mb: 3 }}>
                <PayPalScriptProvider options={{ 
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                  currency: "EUR"
                }}>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            value: card.cardmarket.prices.averageSellPrice.toString()
                          }
                        }]
                      })
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(function(details) {
                        alert('Transaction completed by ' + details.payer.name.given_name)
                      })
                    }}
                  />
                </PayPalScriptProvider>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Bidding Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Faire une offre
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    type="number"
                    label="Montant de l'offre (€)"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={handleBidSubmit}
                    disabled={!user || !bidAmount}
                  >
                    Proposer
                  </Button>
                </Box>
                {!user && (
                  <Typography color="error" variant="body2">
                    Connectez-vous pour faire une offre
                  </Typography>
                )}
              </Box>

              {/* Bids History */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Historique des offres
                </Typography>
                {bids.map((bid) => (
                  <Box key={bid.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {bid.userEmail[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {bid.userEmail}
                        </Typography>
                        <Typography variant="h6">
                          {bid.amount}€
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
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
                  {isFavorite(card) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default CardDetail
