import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Search as SearchIcon,
  BarChart,
} from '@mui/icons-material';
import { BlogPost } from '../../types/blog';
import { ShareButtons } from '../ShareButtons';
import { BlogAnalyticsService } from '../../services/BlogAnalyticsService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';

const POSTS_PER_PAGE = 5;

interface Props {
  onViewStats?: (postId: string) => void;
  onComment?: (post: BlogPost) => void;
}

export const BlogPostList: React.FC<Props> = ({ onViewStats, onComment }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page, category, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Implement post loading logic here
      // This should use the Firebase queries we had before
    } catch (error) {
      showNotification('Error loading posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      showNotification('Please sign in to like posts', 'info');
      return;
    }

    try {
      // Implement like logic here
      await loadPosts();
    } catch (error) {
      showNotification('Error updating like', 'error');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await BlogAnalyticsService.trackPageView(postId, user?.uid || null, {
        type: 'desktop', // You might want to detect this
      });
      showNotification('Post shared successfully', 'success');
    } catch (error) {
      showNotification('Error sharing post', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            ),
          }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value as string)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="strategy">Strategy</MenuItem>
            <MenuItem value="collection">Collection</MenuItem>
            <MenuItem value="trading">Trading</MenuItem>
            <MenuItem value="news">News</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.imageUrl}
                  alt={post.title}
                />
              )}
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {post.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    By {post.author} • {new Date(post.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <IconButton onClick={() => handleLike(post.id)}>
                      <ThumbUpIcon
                        color={user && post.likes.includes(user.uid) ? 'primary' : 'inherit'}
                      />
                    </IconButton>
                    <Typography variant="body2">{post.likes.length}</Typography>
                    <IconButton onClick={() => onComment?.(post)}>
                      <CommentIcon />
                    </IconButton>
                    <Typography variant="body2">{post.comments.length}</Typography>
                    {onViewStats && (
                      <IconButton onClick={() => onViewStats(post.id)}>
                        <BarChart />
                      </IconButton>
                    )}
                  </Box>
                  <ShareButtons
                    title={post.title}
                    url={window.location.href + '/' + post.id}
                    onShare={() => handleShare(post.id)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
