import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Snackbar, Alert } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CardPage from './pages/CardPage';
import Collection from './pages/Collection';
import { useAuth } from './hooks/useAuth';
import { CollectionProvider } from './contexts/CollectionContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

const App: React.FC = () => {
  const { user, error } = useAuth();

  useEffect(() => {
    console.log('App mounted');
    console.log('User state:', user ? 'Logged in' : 'Not logged in');
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CollectionProvider>
        <FavoritesProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1, padding: '20px 0' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/card/:id" element={<CardPage />} />
                  <Route 
                    path="/profile" 
                    element={user ? <Profile /> : <Navigate to="/login" replace />} 
                  />
                  <Route 
                    path="/collection" 
                    element={user ? <Collection /> : <Navigate to="/login" replace />} 
                  />
                  <Route 
                    path="/login" 
                    element={!user ? <Login /> : <Navigate to="/profile" replace />} 
                  />
                  <Route 
                    path="/signup" 
                    element={!user ? <SignUp /> : <Navigate to="/profile" replace />} 
                  />
                </Routes>
              </main>
            </div>
          </Router>

          {error && (
            <Snackbar 
              open={!!error} 
              autoHideDuration={6000}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            </Snackbar>
          )}
        </FavoritesProvider>
      </CollectionProvider>
    </ThemeProvider>
  );
};

export default App;
