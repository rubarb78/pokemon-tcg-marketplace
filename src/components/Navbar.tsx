import { AppBar, Toolbar, Button, Typography, Box, IconButton, Badge, Menu, MenuItem, Avatar, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ShoppingCart, Favorite, Search, Person, Login, PersonAdd } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import useCart from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'
import { useState } from 'react'
import '../styles/Title3D.css'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { items } = useCart()
  const { favorites } = useFavorites()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 1100 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            Pokémon TCG
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/marketplace"
              color="inherit"
              sx={{ color: '#2c3e50' }}
            >
              Marketplace
            </Button>
            {user && (
              <Button
                component={RouterLink}
                to="/collection"
                color="inherit"
                sx={{ color: '#2c3e50' }}
              >
                Ma Collection
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/blog"
              color="inherit"
              sx={{ color: '#2c3e50' }}
            >
              Blog
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton color="inherit" component={RouterLink} to="/search">
                <Search />
              </IconButton>
              
              {user && (
                <>
                  <IconButton color="inherit" component={RouterLink} to="/cart">
                    <Badge badgeContent={items.length} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                  <IconButton color="inherit" component={RouterLink} to="/favorites">
                    <Badge badgeContent={favorites.length} color="error">
                      <Favorite />
                    </Badge>
                  </IconButton>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                  >
                    {user.photoURL ? (
                      <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
                    ) : (
                      <Person />
                    )}
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                      Profil
                    </MenuItem>
                    <MenuItem onClick={handleSignOut}>
                      Se déconnecter
                    </MenuItem>
                  </Menu>
                </>
              )}
              
              {!user && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    startIcon={<Login />}
                  >
                    Connexion
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/signup"
                    startIcon={<PersonAdd />}
                  >
                    Inscription
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
