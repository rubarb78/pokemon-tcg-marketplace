import { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Divider,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Google as GoogleIcon } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { signIn, signInWithGoogle, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await signIn(email, password);
      navigate('/marketplace');
    } catch (error) {
      // L'erreur est déjà gérée par le hook useAuth
      console.error('Erreur de connexion:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/marketplace');
    } catch (error) {
      // L'erreur est déjà gérée par le hook useAuth
      console.error('Erreur de connexion avec Google:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Connexion
        </Typography>

        {(localError || authError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError || authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            fullWidth
          >
            Se connecter
          </Button>
        </form>

        <Box sx={{ my: 2 }}>
          <Divider>ou</Divider>
        </Box>

        <Button
          variant="outlined"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          fullWidth
          size="large"
        >
          Continuer avec Google
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Pas encore de compte ?{' '}
            <Link component={RouterLink} to="/signup" color="primary">
              S'inscrire
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
