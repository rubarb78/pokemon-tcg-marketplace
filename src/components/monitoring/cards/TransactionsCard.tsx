import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Collapse,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as OfferIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import MetricCard from './shared/MetricCard';

const sparkAnimation = keyframes`
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.1); filter: brightness(1.2); }
  100% { transform: scale(1); filter: brightness(1); }
`;

const StyledMetricBox = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 203, 5, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(255, 203, 5, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const AnimatedIcon = styled(Box)(({ theme }) => ({
  animation: `${sparkAnimation} 2s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const transactionData = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}`,
  value: Math.floor(Math.random() * 5000) + 1000,
  volume: Math.floor(Math.random() * 100) + 20,
}));

interface TransactionsCardProps {
  config: any;
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({ config }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics = [
    {
      icon: <MoneyIcon />,
      label: 'Volume Total',
      value: '42.5K €',
      trend: { value: 25, isPositive: true },
    },
    {
      icon: <SwapIcon />,
      label: 'Transactions',
      value: '1,234',
      trend: { value: 18, isPositive: true },
    },
    {
      icon: <OfferIcon />,
      label: 'Prix Moyen',
      value: '34.5 €',
      trend: { value: -5, isPositive: false },
    },
    {
      icon: <TrendingUpIcon />,
      label: 'Croissance',
      value: '+25%',
      trend: { value: 15, isPositive: true },
    },
  ];

  const handleMetricClick = (metricLabel: string) => {
    setSelectedMetric(selectedMetric === metricLabel ? null : metricLabel);
  };

  return (
    <MetricCard
      title="Transactions"
      value={metrics[0].value}
      description="Suivi des transactions en temps réel"
      icon={<CartIcon />}
      themeColor="#FFCB05"
      patternUrl="/images/pikachu-pattern.png"
      onClick={() => setExpanded(!expanded)}
      isExpanded={expanded}
    >
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={6} key={metric.label}>
              <StyledMetricBox
                onClick={() => handleMetricClick(metric.label)}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AnimatedIcon sx={{ mr: 2, color: '#FFCB05' }}>
                    {metric.icon}
                  </AnimatedIcon>
                  <Typography variant="subtitle2">{metric.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#FFCB05' }}>
                  {metric.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: metric.trend.isPositive ? '#4CAF50' : '#F44336',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {metric.trend.value}% vs hier
                </Typography>
              </StyledMetricBox>
            </Grid>
          ))}
        </Grid>

        {selectedMetric && (
          <Collapse in={!!selectedMetric} timeout="auto">
            <Box sx={{ mt: 3, height: 300 }}>
              <Typography variant="subtitle2" gutterBottom>
                {selectedMetric} - Tendance Annuelle
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="month"
                    stroke="#fff"
                    tick={{ fill: '#fff' }}
                  />
                  <YAxis
                    stroke="#fff"
                    tick={{ fill: '#fff' }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: 8,
                      backdropFilter: 'blur(4px)',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#FFCB05"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Collapse>
        )}
      </Box>
    </MetricCard>
  );
};

export default TransactionsCard;
