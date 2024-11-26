import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNotification } from '../hooks/useNotification'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile({
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      })
      addNotification({
        message: 'Profil mis à jour avec succès',
        type: 'success',
      })
    } catch (error) {
      addNotification({
        message: 'Erreur lors de la mise à jour du profil',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ py: 8 }}>
          Veuillez vous connecter pour accéder à votre profil
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Mon Profil
        </Typography>
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                src={formData.photoURL}
                alt={formData.displayName}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom d'affichage"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de la photo"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Mettre à jour'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Profile
