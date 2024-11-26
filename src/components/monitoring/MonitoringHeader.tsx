import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `url('/images/pokemon-pattern.png')`,
    backgroundSize: '100px',
    opacity: 0.05,
    zIndex: 0,
  },
}));

const PokemonAvatar = styled(Avatar)(({ theme }) => ({
  width: 45,
  height: 45,
  marginRight: theme.spacing(2),
  border: '2px solid #FFD700',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-5px)',
    },
    '100%': {
      transform: 'translateY(0px)',
    },
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  marginLeft: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

interface MonitoringHeaderProps {
  onRefresh: () => void;
  onPeriodChange: (period: string) => void;
  onSettingsChange: (setting: string) => void;
}

const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({
  onRefresh,
  onPeriodChange,
  onSettingsChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [periodAnchorEl, setPeriodAnchorEl] = React.useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePeriodClick = (event: React.MouseEvent<HTMLElement>) => {
    setPeriodAnchorEl(event.currentTarget);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPeriodAnchorEl(null);
    setSettingsAnchorEl(null);
  };

  return (
    <HeaderBox>
      <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
        <PokemonAvatar src="/images/pokeball.png" alt="Pokéball" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A237E' }}>
            Tableau de Bord Pokémon TCG
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Monitoring en temps réel • Dernière mise à jour il y a 2 minutes
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
        <Tooltip title="Période">
          <ActionButton onClick={handlePeriodClick} size="large">
            <DateRangeIcon />
          </ActionButton>
        </Tooltip>
        <Menu
          anchorEl={periodAnchorEl}
          open={Boolean(periodAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { onPeriodChange('24h'); handleClose(); }}>24 heures</MenuItem>
          <MenuItem onClick={() => { onPeriodChange('7d'); handleClose(); }}>7 jours</MenuItem>
          <MenuItem onClick={() => { onPeriodChange('30d'); handleClose(); }}>30 jours</MenuItem>
          <MenuItem onClick={() => { onPeriodChange('custom'); handleClose(); }}>Personnalisé</MenuItem>
        </Menu>

        <Tooltip title="Notifications">
          <ActionButton onClick={handleNotificationClick} size="large">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </ActionButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Alerte Performance: Temps de chargement élevé</MenuItem>
          <MenuItem onClick={handleClose}>Nouvelle transaction importante</MenuItem>
          <MenuItem onClick={handleClose}>Mise à jour système disponible</MenuItem>
        </Menu>

        <Tooltip title="Paramètres">
          <ActionButton onClick={handleSettingsClick} size="large">
            <SettingsIcon />
          </ActionButton>
        </Tooltip>
        <Menu
          anchorEl={settingsAnchorEl}
          open={Boolean(settingsAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { onSettingsChange('thresholds'); handleClose(); }}>Seuils d'alerte</MenuItem>
          <MenuItem onClick={() => { onSettingsChange('notifications'); handleClose(); }}>Notifications</MenuItem>
          <MenuItem onClick={() => { onSettingsChange('display'); handleClose(); }}>Affichage</MenuItem>
        </Menu>

        <Tooltip title="Rafraîchir">
          <ActionButton onClick={onRefresh} size="large">
            <RefreshIcon />
          </ActionButton>
        </Tooltip>
      </Box>
    </HeaderBox>
  );
};

export default MonitoringHeader;
