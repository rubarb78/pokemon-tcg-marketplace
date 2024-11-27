import React from 'react'
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Box, Chip } from '@mui/material'
import { AddShoppingCart, Favorite, FavoriteBorder, TrendingUp } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PokemonCard } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import { useInView } from 'react-intersection-observer'

interface CardItemProps {
  card: PokemonCard
  onAddToCart?: (card: PokemonCard) => void
  onAddToFavorites?: (card: PokemonCard) => void
}

const CardItem: React.FC<CardItemProps> = ({ card, onAddToCart, onAddToFavorites }) => {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const handleCardClick = () => {
    navigate(`/card/${card.id}`)
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
          }
        }}
      >
        <Box sx={{ position: 'relative', pt: '8px' }}>
          <CardMedia
            component={motion.img}
            whileHover={{ scale: 1.05 }}
            image={card.images.small}
            alt={card.name}
            sx={{ 
              cursor: 'pointer',
              objectFit: 'contain',
              height: '200px'
            }}
            onClick={handleCardClick}
          />
          {card.rarity && (
            <Chip
              label={card.rarity}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white'
              }}
            />
          )}
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              mb: 1
            }}
          >
            {card.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUp sx={{ color: 'success.main', fontSize: '1rem' }} />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontWeight: 'medium' }}
            >
              {card.cardmarket.prices.averageSellPrice}€
            </Typography>
          </Box>
        </CardContent>

        <CardActions 
          disableSpacing 
          sx={{ 
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'rgba(0,0,0,0.02)',
            px: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={() => onAddToCart?.(card)}
                color="primary"
                aria-label="add to cart"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                <AddShoppingCart />
              </IconButton>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={() => {
                  toggleFavorite(card)
                  onAddToFavorites?.(card)
                }}
                color="error"
                aria-label="add to favorites"
                sx={{ 
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
        </CardActions>
      </Card>
    </motion.div>
  )
}

export default CardItem
