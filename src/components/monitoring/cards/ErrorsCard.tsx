import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  BugReport as BugIcon,
  Warning as WarningIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import MetricCard from './shared/MetricCard';

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const StyledMetricBox = styled(Box)(({ theme }) => ({
  background: 'rgba(150, 90, 190, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(150, 90, 190, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const AnimatedIcon = styled(Box)(({ theme }) => ({
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const errorData = [
  { name: 'API', value: 35, color: '#FF6B6B' },
  { name: 'UI', value: 25, color: '#4ECDC4' },
  { name: 'Auth', value: 20, color: '#FFD93D' },
  { name: 'DB', value: 20, color: '#95A5A6' },
];

interface ErrorsCardProps {
  config: any;
}

const ErrorsCard: React.FC<ErrorsCardProps> = ({ config }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metrics = [
    {
      icon: <BugIcon />,
      label: 'Erreurs Critiques',
      value: '12',
      trend: { value: 15, isPositive: false },
    },
    {
      icon: <WarningIcon />,
      label: 'Avertissements',
      value: '45',
      trend: { value: -8, isPositive: true },
    },
    {
      icon: <NetworkIcon />,
      label: 'Erreurs Réseau',
      value: '7',
      trend: { value: -12, isPositive: true },
    },
    {
      icon: <SecurityIcon />,
      label: 'Erreurs Auth',
      value: '3',
      trend: { value: -5, isPositive: true },
    },
  ];

  const handleMetricClick = (metricLabel: string) => {
    setSelectedMetric(selectedMetric === metricLabel ? null : metricLabel);
  };

  return (
    <MetricCard
      title="Erreurs"
      value={metrics[0].value}
      description="Suivi des erreurs en temps réel"
      icon={<ErrorIcon />}
      themeColor="#965ABE"
      patternUrl="/images/mewtwo-pattern.png"
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
                  <AnimatedIcon sx={{ mr: 2, color: '#965ABE' }}>
                    {metric.icon}
                  </AnimatedIcon>
                  <Typography variant="subtitle2">{metric.label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#965ABE' }}>
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
                Distribution des Erreurs par Type
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {errorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: 8,
                      backdropFilter: 'blur(4px)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Collapse>
        )}
      </Box>
    </MetricCard>
  );
};

export default ErrorsCard;
