import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Tab,
  Tabs,
  Drawer,
  IconButton,
} from '@mui/material';
import { Add, Edit, BarChart } from '@mui/icons-material';
import { BlogPost } from '../types/blog';
import { BlogModerationService } from '../services/BlogModerationService';
import { BlogRecommendationService } from '../services/BlogRecommendationService';
import { BlogAnalyticsService } from '../services/BlogAnalyticsService';
import { ModerationDashboard } from '../components/blog/ModerationDashboard';
import { BlogStats } from '../components/blog/BlogStats';
import { DraftEditor } from '../components/blog/DraftEditor';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';

export const Blog: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [selectedTab, setSelectedTab] = useState(0);
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [statsDrawerOpen, setStatsDrawerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadDrafts();
    }
  }, [user]);

  const loadDrafts = async () => {
    if (!user) return;
    
    try {
      const userDrafts = await BlogModerationService.getDrafts(user.uid);
      setDrafts(userDrafts);
    } catch (error) {
      showNotification('Error loading drafts', 'error');
    }
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setEditorOpen(true);
  };

  const handleEditDraft = (postId: string) => {
    setSelectedPost(postId);
    setEditorOpen(true);
  };

  const handleSaveDraft = async (postId: string) => {
    await loadDrafts();
    setEditorOpen(false);
    showNotification('Draft saved successfully', 'success');
  };

  const handleViewStats = (postId: string) => {
    setSelectedPost(postId);
    setStatsDrawerOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" gutterBottom>
              Blog Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleNewPost}
            >
              New Post
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="My Drafts" />
              <Tab label="Published Posts" />
              {user?.role === 'moderator' && <Tab label="Moderation" />}
            </Tabs>

            {/* Drafts Tab */}
            <Box hidden={selectedTab !== 0} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {drafts.map((draft) => (
                  <Grid item xs={12} key={draft.id}>
                    <Paper sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{draft.title}</Typography>
                        <Box>
                          <IconButton onClick={() => handleEditDraft(draft.id)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleViewStats(draft.id)}>
                            <BarChart />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography color="textSecondary" variant="body2">
                        Last modified: {new Date(draft.lastModifiedAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Published Posts Tab */}
            <Box hidden={selectedTab !== 1} sx={{ p: 3 }}>
              {/* Published posts content */}
            </Box>

            {/* Moderation Tab */}
            {user?.role === 'moderator' && (
              <Box hidden={selectedTab !== 2} sx={{ p: 3 }}>
                <ModerationDashboard />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Draft Editor Drawer */}
      <Drawer
        anchor="right"
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        PaperProps={{ sx: { width: '80%' } }}
      >
        <DraftEditor
          postId={selectedPost || undefined}
          onSave={handleSaveDraft}
        />
      </Drawer>

      {/* Stats Drawer */}
      <Drawer
        anchor="right"
        open={statsDrawerOpen}
        onClose={() => setStatsDrawerOpen(false)}
        PaperProps={{ sx: { width: '60%' } }}
      >
        {selectedPost && <BlogStats postId={selectedPost} />}
      </Drawer>
    </Container>
  );
};

export default Blog;
