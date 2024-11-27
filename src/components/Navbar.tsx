import { AppBar, Toolbar, Button, Typography, Box, IconButton, Badge, Menu, MenuItem, Avatar } from '@mui/material'
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
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #2a75bb 30%, #3c5aa6 90%)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RouterLink 
            to="/" 
            className="title-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            Pokemon TCG
          </RouterLink>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/marketplace"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Marketplace
          </Button>
          {user && (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/collection"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Ma Collection
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
