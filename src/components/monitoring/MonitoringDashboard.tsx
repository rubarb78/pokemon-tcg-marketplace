import React from 'react';
import { Box, Grid, ThemeProvider, createTheme } from '@mui/material';
import PerformanceCard from './cards/PerformanceCard';
import ErrorsCard from './cards/ErrorsCard';
import TransactionsCard from './cards/TransactionsCard';
import BusinessMetricsCard from './cards/BusinessMetricsCard';
import TradingMetricsCard from './cards/TradingMetricsCard';
import { MONITORING_CONFIG } from '../../config/monitoring';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000', // Rouge Pokémon
      light: '#FF4444',
      dark: '#CC0000',
    },
    secondary: {
      main: '#3B4CCA', // Bleu Pokémon
      light: '#5566DD',
      dark: '#2233AA',
    },
    error: {
      main: '#FF0000',
    },
    warning: {
      main: '#FFDE00', // Jaune Pokémon
      contrastText: '#000',
    },
    success: {
      main: '#3B4CCA',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Flexo", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1A237E',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1A237E',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#1A237E',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const MonitoringDashboard: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          p: 3,
          background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
          backgroundImage: `url('/images/pokemon-pattern.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      >
        <Box
          sx={{
            maxWidth: 1920,
            margin: '0 auto',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <img
                  src="/images/pokeball.png"
                  alt="Pokéball"
                  style={{ width: 40, marginRight: 16 }}
                />
                <h1 style={{ margin: 0 }}>Tableau de Bord Pokémon TCG</h1>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <PerformanceCard config={MONITORING_CONFIG.performance} />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <ErrorsCard config={MONITORING_CONFIG.errors} />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <TransactionsCard config={MONITORING_CONFIG.transactions} />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <BusinessMetricsCard config={MONITORING_CONFIG.transactions.business} />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <TradingMetricsCard config={MONITORING_CONFIG.transactions} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MonitoringDashboard;
