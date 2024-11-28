import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Timeline,
  DevicesOther,
  Public,
  TrendingUp,
  InfoOutlined,
} from '@mui/icons-material';
import { BlogAnalyticsService } from '../../services/BlogAnalyticsService';
import { BlogStats as BlogStatsType } from '../../types/blog';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

interface Props {
  postId: string;
}

export const BlogStats: React.FC<Props> = ({ postId }) => {
  const [stats, setStats] = useState<BlogStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [postId]);

  const loadStats = async () => {
    try {
      const postStats = await BlogAnalyticsService.getPostStats(postId);
      setStats(postStats);
    } catch (error) {
      console.error('Error loading blog stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!stats) {
    return (
      <Typography color="error">
        Error loading statistics
      </Typography>
    );
  }

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          stats.deviceStats.desktop,
          stats.deviceStats.mobile,
          stats.deviceStats.tablet,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  };

  const countryData = stats.demographicData?.countries
    ? {
        labels: Object.keys(stats.demographicData.countries),
        datasets: [
          {
            label: 'Views by Country',
            data: Object.values(stats.demographicData.countries),
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      }
    : null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Post Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Timeline sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Views</Typography>
                <Tooltip title="Total number of page views">
                  <IconButton size="small">
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h4">{stats.views}</Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.uniqueVisitors} unique visitors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Engagement</Typography>
              </Box>
              <Typography variant="h4">
                {(stats.engagementMetrics.commentRate * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Comment rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DevicesOther sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Avg. Time</Typography>
              </Box>
              <Typography variant="h4">
                {Math.round(stats.engagementMetrics.averageTimeOnPage)}s
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Time on page
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Public sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Bounce Rate</Typography>
              </Box>
              <Typography variant="h4">
                {(stats.engagementMetrics.bounceRate * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Single page sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Device Distribution
              </Typography>
              <Box height={300}>
                <Doughnut
                  data={deviceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Distribution */}
        {countryData && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Geographic Distribution
                </Typography>
                <Box height={300}>
                  <Line
                    data={countryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
