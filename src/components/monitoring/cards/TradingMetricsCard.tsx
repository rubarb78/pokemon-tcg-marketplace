import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Collapse,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  SwapVert as SwapIcon,
  ShowChart as ChartIcon,
  LocalOffer as OfferIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import MetricCard from './shared/MetricCard';

const psychicAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.8; filter: hue-rotate(0deg); }
  50% { transform: scale(1.1) rotate(180deg); opacity: 1; filter: hue-rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); opacity: 0.8; filter: hue-rotate(360deg); }
`;

const StyledMetricBox = styled(Box)(({ theme }) => ({
  background: 'rgba(156, 85, 170, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(156, 85, 170, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const AnimatedIcon = styled(Box)(({ theme }) => ({
  animation: `${psychicAnimation} 4s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const tradingData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  volume: Math.floor(Math.random() * 1000) + 500,
  price: Math.floor(Math.random() * 100) + 50,
  trades: Math.floor(Math.random() * 50) + 20,
}));

interface TradingMetricsCardProps {
  config: any;
}

const TradingMetricsCard: React.FC<TradingMetricsCardProps> = ({ config }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics = [
    {
      icon: <ChartIcon />,
      label: 'Volume de Trading',
      value: '8.5M €',
      trend: { value: 28, isPositive: true },
    },
    {
      icon: <SwapIcon />,
      label: 'Trades Actifs',
      value: '2,345',
      trend: { value: 15, isPositive: true },
    },
    {
      icon: <OfferIcon />,
      label: 'Prix Moyen',
      value: '156 €',
      trend: { value: -3, isPositive: false },
    },
    {
      icon: <InsightsIcon />,
      label: 'Volatilité',
      value: '12%',
      trend: { value: -8, isPositive: true },
    },
  ];

  const handleMetricClick = (metricLabel: string) => {
    setSelectedMetric(selectedMetric === metricLabel ? null : metricLabel);
  };

  return (
    <MetricCard
      title="Métriques Trading"
      value={metrics[0].value}
      description="Analyse du marché en temps réel"
      icon={<PsychologyIcon />}
      themeColor="#9C55AA"
      patternUrl="/images/alakazam-pattern.png"
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
                  <AnimatedIcon sx={{ mr: 2, color: '#9C55AA' }}>
                    {metric.icon}
                  </AnimatedIcon>
                  <Typography variant="subtitle2">{metric.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#9C55AA' }}>
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
                {selectedMetric} - Dernières 24 heures
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tradingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="hour"
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
                  <Line
                    type="basis"
                    dataKey="volume"
                    stroke="#9C55AA"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="basis"
                    dataKey="price"
                    stroke="#FFD700"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Collapse>
        )}
      </Box>
    </MetricCard>
  );
};

export default TradingMetricsCard;
