import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import PriceChartingService from '../services/PriceChartingService';

interface CardDetailsProps {
  card: {
    id: string;
    name: string;
    set: {
      name: string;
    };
    cardmarket?: {
      prices?: {
        averageSellPrice?: number;
        lowPrice?: number;
        trendPrice?: number;
      };
    };
  };
}

const CardDetails: React.FC<CardDetailsProps> = ({ card }) => {
  const [priceComparison, setPriceComparison] = useState<{
    tcgPrice: number;
    priceChartingPrice: number | null;
    difference: number | null;
    recommendation: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceComparison = async () => {
      if (card.cardmarket?.prices?.averageSellPrice) {
        const comparison = await PriceChartingService.comparePrice(
          card.cardmarket.prices.averageSellPrice,
          card.name,
          card.set.name
        );
        setPriceComparison(comparison);
      }
      setLoading(false);
    };

    fetchPriceComparison();
  }, [card]);

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null) return 'N/A';
    return `${price.toFixed(2)} €`;
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Comparaison des prix
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell align="right">Prix</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Pokemon TCG</TableCell>
                    <TableCell align="right">
                      {formatPrice(card.cardmarket?.prices?.averageSellPrice)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PriceCharting</TableCell>
                    <TableCell align="right">
                      {formatPrice(priceComparison?.priceChartingPrice)}
                    </TableCell>
                  </TableRow>
                  {priceComparison?.difference && (
                    <TableRow>
                      <TableCell>Différence</TableCell>
                      <TableCell align="right">
                        {formatPrice(priceComparison.difference)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {priceComparison && (
              <Box mt={2}>
                <Chip
                  label={priceComparison.recommendation}
                  color={
                    priceComparison.recommendation.includes('compétitif')
                      ? 'success'
                      : priceComparison.recommendation.includes('dessous')
                      ? 'warning'
                      : 'error'
                  }
                  variant="outlined"
                />
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Les prix sont mis à jour régulièrement. Dernière mise à jour : {new Date().toLocaleDateString()}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CardDetails;
