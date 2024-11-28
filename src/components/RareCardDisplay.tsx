import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { Flip, Euro, Timeline } from '@mui/icons-material';
import { RarePokemonCard } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RareCardDisplayProps {
  card: RarePokemonCard;
}

const RareCardDisplay: React.FC<RareCardDisplayProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const priceHistoryData = {
    labels: card.historicalPrices.map(p => new Date(p.date).toLocaleDateString('fr-FR')),
    datasets: [
      {
        label: 'Prix',
        data: card.historicalPrices.map(p => p.price),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const priceHistoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Historique des prix'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatPrice(value)
        }
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2, position: 'relative' }}>
      <Box sx={{ position: 'relative', paddingTop: '139%' }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: isFlipped ? 'rotateY(180deg)' : 'none',
            transition: 'transform 0.6s',
            backfaceVisibility: 'hidden'
          }}
          image={isFlipped ? card.images.back?.large : card.images.large}
          alt={card.name}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            display: 'flex',
            gap: 1
          }}
        >
          <IconButton
            onClick={handleFlip}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <Flip />
          </IconButton>
          <IconButton
            onClick={() => setShowPriceHistory(!showPriceHistory)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <Timeline />
          </IconButton>
        </Box>
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {card.name}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Chip
            icon={<Euro />}
            label={formatPrice(card.rarity.estimatedValue)}
            color="primary"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {card.rarity.description}
        </Typography>
        {showPriceHistory && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Line data={priceHistoryData} options={priceHistoryOptions} />
          </Paper>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Dernière vente connue :
          </Typography>
          <Typography variant="body2">
            {formatPrice(card.rarity.lastKnownSale.price)} ({new Date(card.rarity.lastKnownSale.date).toLocaleDateString('fr-FR')})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lieu : {card.rarity.lastKnownSale.source}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Condition : {card.rarity.lastKnownSale.condition}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export { RareCardDisplay };
export default RareCardDisplay;
