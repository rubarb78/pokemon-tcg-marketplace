import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  Collapse,
  Fade,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
  }
`;

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  themeColor: string;
  patternUrl: string;
  children?: React.ReactNode;
  onClick?: () => void;
  isExpanded?: boolean;
}

const StyledCard = styled(Card)<{ themecolor: string; pattern: string; clickable?: boolean }>(
  ({ theme, themecolor, pattern, clickable }) => ({
    background: `linear-gradient(135deg, ${themecolor}22 0%, ${themecolor}11 100%)`,
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: clickable ? 'pointer' : 'default',
    '&:hover': clickable ? {
      transform: 'translateY(-5px) scale(1.02)',
      boxShadow: `0 8px 25px ${themecolor}33`,
      '&::after': {
        opacity: 1,
      },
    } : {},
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: `url(${pattern})`,
      backgroundSize: '150px',
      opacity: 0.05,
      zIndex: 0,
      animation: `${floatAnimation} 10s ease-in-out infinite`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: `linear-gradient(135deg, ${themecolor}33 0%, transparent 100%)`,
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: 0,
    },
  }),
);

const ValueDisplay = styled(Typography)<{ animate?: boolean }>(({ animate }) => ({
  animation: animate ? `${pulseAnimation} 2s ease-in-out infinite` : 'none',
}));

const IconWrapper = styled(Box)<{ themecolor: string }>(({ themecolor }) => ({
  background: `linear-gradient(135deg, ${themecolor}44 0%, ${themecolor}22 100%)`,
  borderRadius: '50%',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${glowAnimation} 3s ease-in-out infinite`,
}));

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  progress,
  themeColor,
  patternUrl,
  children,
  onClick,
  isExpanded = false,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <StyledCard
      themecolor={themeColor}
      pattern={patternUrl}
      clickable={!!onClick}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Fade in timeout={500}>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {icon && (
                <IconWrapper themecolor={themeColor} sx={{ mr: 2 }}>
                  {icon}
                </IconWrapper>
              )}
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {title}
              </Typography>
            </Box>
            {description && (
              <Tooltip
                title={description}
                placement="top"
                arrow
                enterDelay={200}
                leaveDelay={0}
              >
                <IconButton size="small" sx={{ 
                  transition: 'transform 0.2s ease-in-out',
                  transform: isHovered ? 'rotate(15deg)' : 'none'
                }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <ValueDisplay
            variant="h4"
            component="div"
            animate={isHovered}
            sx={{
              fontWeight: 700,
              color: themeColor,
              mb: trend ? 1 : 2,
            }}
          >
            {value}
          </ValueDisplay>

          {trend && (
            <Fade in timeout={300}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: trend.isPositive ? '#4CAF50' : '#F44336',
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      width: 0,
                      height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderBottom: trend.isPositive ? '6px solid #4CAF50' : 'none',
                      borderTop: trend.isPositive ? 'none' : '6px solid #F44336',
                      marginRight: '4px',
                      transition: 'transform 0.2s ease-in-out',
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    },
                  }}
                >
                  {trend.value}% par rapport à la période précédente
                </Typography>
              </Box>
            </Fade>
          )}

          {progress !== undefined && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: `${themeColor}22`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: themeColor,
                    transition: 'transform 0.8s ease-in-out',
                  },
                }}
              />
            </Box>
          )}

          <Collapse in={isExpanded} timeout="auto">
            {children}
          </Collapse>
        </CardContent>
      </Fade>
    </StyledCard>
  );
};

export default MetricCard;
