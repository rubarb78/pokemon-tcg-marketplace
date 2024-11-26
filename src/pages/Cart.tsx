import React from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Button,
} from '@mui/material'
import { Delete, Add, Remove } from '@mui/icons-material'
import useCart from '../hooks/useCart'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const Cart = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  const handleCheckout = async () => {
    const stripe = await stripePromise
    if (!stripe) return

    // Ici, vous devrez implémenter l'appel à votre backend pour créer une session de paiement
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    })

    const session = await response.json()
    await stripe.redirectToCheckout({
      sessionId: session.id,
    })
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Votre panier est vide
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panier
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {items.map((item) => (
              <Card key={item.card.id} sx={{ mb: 2, display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100 }}
                  image={item.card.images.small}
                  alt={item.card.name}
                />
                <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{item.card.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prix: {item.card.cardmarket.prices.averageSellPrice}€
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton
                      onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                    <IconButton
                      onClick={() => removeItem(item.card.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Résumé de la commande
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Total: {total().toFixed(2)}€
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Payer
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Cart
