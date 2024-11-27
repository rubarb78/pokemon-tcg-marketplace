import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Tooltip,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Sort as SortIcon, Search as SearchIcon } from '@mui/icons-material';
import { pokemonTCGService, PokemonCard } from '../services/PokemonTCGService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/globals.css';

type SortOrder = 'asc' | 'desc';

const Marketplace = () => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    searchCards();
  }, [page]);

  const searchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, totalCount } = await pokemonTCGService.searchCards(searchQuery || '*', page);
      const sortedCards = sortCardsByPrice(data, sortOrder);
      setCards(sortedCards);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error('Erreur lors de la recherche des cartes:', error);
      setError('Impossible de charger les cartes. Veuillez réessayer plus tard.');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const sortCardsByPrice = (cardsToSort: PokemonCard[], order: SortOrder) => {
    return [...cardsToSort].sort((a, b) => {
      const priceA = a.cardmarket?.prices?.averageSellPrice || 0;
      const priceB = b.cardmarket?.prices?.averageSellPrice || 0;
      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setCards(sortCardsByPrice(cards, newOrder));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    searchCards();
  };

  const handleCardClick = (card: PokemonCard) => {
    navigate(`/card/${card.id}`);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `${price.toFixed(2)} €`;
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <div className="marketplace-header">
        <Typography variant="h1" component="h1">
          Marketplace
        </Typography>
        <Typography variant="subtitle1">
          Découvrez notre collection de cartes Pokémon et trouvez les meilleures offres
        </Typography>
      </div>

      <Paper className="search-bar" elevation={0}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                placeholder="Rechercher une carte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '2rem',
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: '2rem',
                  height: '56px',
                  background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
                }}
              >
                Rechercher
              </Button>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Tooltip title={sortOrder === 'asc' ? 'Prix croissant' : 'Prix décroissant'}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleSortChange}
                  startIcon={<SortIcon />}
                  size="large"
                  className="sort-button"
                  sx={{
                    borderRadius: '2rem',
                    height: '56px',
                  }}
                >
                  {sortOrder === 'asc' ? 'Prix ↑' : 'Prix ↓'}
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Box className="card-grid" mt={4}>
          <Grid container spacing={3}>
            {cards.map((card, index) => (
              <Grid 
                item 
                key={card.id} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                className="card-animation"
                sx={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card 
                  className="pokemon-card"
                  onClick={() => handleCardClick(card)}
                >
                  <CardMedia
                    component="img"
                    image={card.images.small}
                    alt={card.name}
                    sx={{ 
                      objectFit: 'contain', 
                      pt: 2,
                      transform: 'scale(1.1)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <CardContent>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2" 
                      noWrap
                      sx={{ 
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {card.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'var(--text-secondary)',
                        mb: 1
                      }}
                    >
                      Set: {card.set.name}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      className="card-price"
                    >
                      {formatPrice(card.cardmarket?.prices?.averageSellPrice)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {cards.length > 0 && (
            <Box className="pagination" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Marketplace;
