import { AppBar, Toolbar, Button, Typography, Box, IconButton, Badge, Menu, MenuItem, Avatar } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ShoppingCart, Favorite, Search, Person } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import useCart from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'
import { useState } from 'react'

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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Pokemon TCG Marketplace
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" component={RouterLink} to="/search">
            <Search />
          </IconButton>
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
          <Button color="inherit" component={RouterLink} to="/marketplace">
            Marketplace
          </Button>
          <Button color="inherit" component={RouterLink} to="/blog">
            Blog
          </Button>
          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {user.photoURL ? (
                  <Avatar src={user.photoURL} alt={user.displayName || ''} />
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
                  Mon Profil
                </MenuItem>
                <MenuItem component={RouterLink} to="/collection" onClick={handleClose}>
                  Ma Collection
                </MenuItem>
                <MenuItem component={RouterLink} to="/orders" onClick={handleClose}>
                  Mes Commandes
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); signOut(); }}>
                  Déconnexion
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
