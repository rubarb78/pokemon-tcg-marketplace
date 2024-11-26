import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Pokemon TCG Marketplace
        </Typography>
        <Typography variant="h5" component="h2" align="center" color="text.secondary" paragraph>
          Achetez, vendez et échangez vos cartes Pokémon en toute sécurité
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!user ? (
            <Button variant="contained" size="large" component={RouterLink} to="/login">
              Commencer
            </Button>
          ) : (
            <Button variant="contained" size="large" component={RouterLink} to="/marketplace">
              Explorer le Marketplace
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Marketplace
            </Typography>
            <Typography variant="body1" paragraph>
              Trouvez les cartes que vous recherchez parmi notre vaste sélection. Prix du marché en temps réel et paiement sécurisé.
            </Typography>
            <Button component={RouterLink} to="/marketplace" variant="outlined">
              Voir le Marketplace
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Collection
            </Typography>
            <Typography variant="body1" paragraph>
              Gérez votre collection de cartes. Marquez les cartes à vendre, à échanger ou à garder. Suivez la valeur de votre collection.
            </Typography>
            <Button component={RouterLink} to="/collection" variant="outlined">
              Gérer ma Collection
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Blog
            </Typography>
            <Typography variant="body1" paragraph>
              Rejoignez notre communauté active. Partagez vos expériences, discutez des dernières sorties et trouvez des conseils.
            </Typography>
            <Button component={RouterLink} to="/blog" variant="outlined">
              Voir le Blog
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
