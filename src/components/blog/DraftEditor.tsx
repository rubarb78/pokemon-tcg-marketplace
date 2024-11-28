import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Publish, Delete, Add } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BlogPost } from '../../types/blog';
import { BlogModerationService } from '../../services/BlogModerationService';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  postId?: string;
  onSave?: (postId: string) => void;
}

export const DraftEditor: React.FC<Props> = ({ postId, onSave }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    category: 'strategy',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [tagDialog, setTagDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (postId) {
      loadDraft();
    }
  }, [postId]);

  const loadDraft = async () => {
    try {
      const drafts = await BlogModerationService.getDrafts(user!.uid);
      const draft = drafts.find(d => d.id === postId);
      if (draft) {
        setPost(draft);
      }
    } catch (error) {
      showNotification('Error loading draft', 'error');
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      showNotification('You must be logged in to save drafts', 'error');
      return;
    }

    setSaving(true);
    try {
      const savedPostId = await BlogModerationService.saveDraft({
        ...post,
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
      });
      showNotification('Draft saved successfully', 'success');
      if (onSave) {
        onSave(savedPostId);
      }
    } catch (error) {
      showNotification('Error saving draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!postId) {
      showNotification('Please save the draft first', 'error');
      return;
    }

    try {
      await BlogModerationService.publishDraft(postId);
      showNotification('Post submitted for moderation', 'success');
    } catch (error) {
      showNotification('Error publishing draft', 'error');
    }
  };

  const handleAddTag = () => {
    if (newTag && !post.tags?.includes(newTag)) {
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      setNewTag('');
    }
    setTagDialog(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {postId ? 'Edit Draft' : 'New Draft'}
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Title"
          value={post.title}
          onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={post.category}
            label="Category"
            onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
          >
            <MenuItem value="strategy">Strategy</MenuItem>
            <MenuItem value="collection">Collection</MenuItem>
            <MenuItem value="trading">Trading</MenuItem>
            <MenuItem value="news">News</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {post.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
              />
            ))}
            <IconButton
              color="primary"
              onClick={() => setTagDialog(true)}
              size="small"
            >
              <Add />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mt: 2, mb: 2 }}>
          <ReactQuill
            theme="snow"
            value={post.content}
            onChange={(content) => setPost(prev => ({ ...prev, content }))}
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSaveDraft}
            disabled={saving}
          >
            Save Draft
          </Button>
          {postId && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Publish />}
              onClick={handlePublish}
            >
              Publish
            </Button>
          )}
        </Box>
      </Box>

      <Dialog open={tagDialog} onClose={() => setTagDialog(false)}>
        <DialogTitle>Add Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag"
            fullWidth
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTag} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
