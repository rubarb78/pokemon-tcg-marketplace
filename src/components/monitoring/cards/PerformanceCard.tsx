import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
  Grid,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  CloudQueue as ApiIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import MetricCard from './shared/MetricCard';

const flameAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const StyledMetricBox = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 107, 107, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(255, 107, 107, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const AnimatedIcon = styled(Box)(({ theme }) => ({
  animation: `${flameAnimation} 2s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  loadTime: Math.random() * 1000 + 500,
  apiTime: Math.random() * 200 + 100,
  renderTime: Math.random() * 300 + 200,
}));

interface PerformanceCardProps {
  config: any;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ config }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics = [
    {
      icon: <TimelineIcon />,
      label: 'Temps de Chargement',
      value: '789ms',
      trend: { value: -12, isPositive: true },
    },
    {
      icon: <ApiIcon />,
      label: 'Latence API',
      value: '120ms',
      trend: { value: -8, isPositive: true },
    },
    {
      icon: <MemoryIcon />,
      label: 'Utilisation Mémoire',
      value: '45%',
      trend: { value: 5, isPositive: false },
    },
    {
      icon: <StorageIcon />,
      label: 'Cache Hit Rate',
      value: '92%',
      trend: { value: 3, isPositive: true },
    },
  ];

  const handleMetricClick = (metricLabel: string) => {
    setSelectedMetric(selectedMetric === metricLabel ? null : metricLabel);
  };

  return (
    <MetricCard
      title="Performance"
      value={metrics[0].value}
      description="Métriques de performance en temps réel"
      icon={<SpeedIcon />}
      themeColor="#FF6B6B"
      patternUrl="/images/charizard-pattern.png"
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
                  <AnimatedIcon sx={{ mr: 2, color: '#FF6B6B' }}>
                    {metric.icon}
                  </AnimatedIcon>
                  <Typography variant="subtitle2">{metric.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#FF6B6B' }}>
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
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="time"
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
                    type="monotone"
                    dataKey="loadTime"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    dot={{ fill: '#FF6B6B' }}
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

export default PerformanceCard;
