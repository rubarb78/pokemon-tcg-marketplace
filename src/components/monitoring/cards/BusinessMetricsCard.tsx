import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Collapse,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Group as UsersIcon,
  Loyalty as LoyaltyIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import MetricCard from './shared/MetricCard';

const growthAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
  50% { transform: scale(1.1) rotate(5deg); filter: brightness(1.2); }
  100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
`;

const StyledMetricBox = styled(Box)(({ theme }) => ({
  background: 'rgba(87, 148, 80, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(87, 148, 80, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const AnimatedIcon = styled(Box)(({ theme }) => ({
  animation: `${growthAnimation} 3s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const businessData = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}`,
  revenue: Math.floor(Math.random() * 10000) + 5000,
  users: Math.floor(Math.random() * 1000) + 500,
  engagement: Math.floor(Math.random() * 50) + 30,
}));

interface BusinessMetricsCardProps {
  config: any;
}

const BusinessMetricsCard: React.FC<BusinessMetricsCardProps> = ({ config }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics = [
    {
      icon: <AssessmentIcon />,
      label: 'Chiffre d\'affaires',
      value: '125.4K €',
      trend: { value: 32, isPositive: true },
    },
    {
      icon: <UsersIcon />,
      label: 'Utilisateurs Actifs',
      value: '3,456',
      trend: { value: 15, isPositive: true },
    },
    {
      icon: <LoyaltyIcon />,
      label: 'Taux de Fidélité',
      value: '78%',
      trend: { value: 8, isPositive: true },
    },
    {
      icon: <TrendingUpIcon />,
      label: 'Croissance Mensuelle',
      value: '+22%',
      trend: { value: 12, isPositive: true },
    },
  ];

  const handleMetricClick = (metricLabel: string) => {
    setSelectedMetric(selectedMetric === metricLabel ? null : metricLabel);
  };

  return (
    <MetricCard
      title="Métriques Commerciales"
      value={metrics[0].value}
      description="Indicateurs clés de performance"
      icon={<BusinessIcon />}
      themeColor="#579450"
      patternUrl="/images/venusaur-pattern.png"
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
                  <AnimatedIcon sx={{ mr: 2, color: '#579450' }}>
                    {metric.icon}
                  </AnimatedIcon>
                  <Typography variant="subtitle2">{metric.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#579450' }}>
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
                  {metric.trend.value}% vs mois dernier
                </Typography>
              </StyledMetricBox>
            </Grid>
          ))}
        </Grid>

        {selectedMetric && (
          <Collapse in={!!selectedMetric} timeout="auto">
            <Box sx={{ mt: 3, height: 300 }}>
              <Typography variant="subtitle2" gutterBottom>
                {selectedMetric} - Évolution Annuelle
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={businessData}>
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
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#579450" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#579450" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#579450"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Collapse>
        )}
      </Box>
    </MetricCard>
  );
};

export default BusinessMetricsCard;
