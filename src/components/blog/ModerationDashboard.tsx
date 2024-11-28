import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from '@mui/material';
import { Check, Close, Flag } from '@mui/icons-material';
import { BlogModerationService } from '../../services/BlogModerationService';
import { BlogPost, Comment } from '../../types/blog';
import { useNotification } from '../../contexts/NotificationContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`moderation-tabpanel-${index}`}
      aria-labelledby={`moderation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ModerationDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [reportedComments, setReportedComments] = useState<{ post: BlogPost; comment: Comment }[]>([]);
  const [moderationDialog, setModerationDialog] = useState<{
    open: boolean;
    type: 'post' | 'comment';
    item: BlogPost | Comment | null;
    postId?: string;
  }>({
    open: false,
    type: 'post',
    item: null,
  });
  const [moderationComment, setModerationComment] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    loadModerationData();
  }, []);

  const loadModerationData = async () => {
    try {
      const posts = await BlogModerationService.getPendingPosts();
      const comments = await BlogModerationService.getReportedComments();
      setPendingPosts(posts);
      setReportedComments(comments);
    } catch (error) {
      showNotification('Error loading moderation data', 'error');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleModerationAction = async (decision: 'approve' | 'reject') => {
    try {
      if (moderationDialog.type === 'post' && moderationDialog.item) {
        await BlogModerationService.moderatePost(
          (moderationDialog.item as BlogPost).id,
          decision,
          moderationComment
        );
      } else if (moderationDialog.type === 'comment' && moderationDialog.item && moderationDialog.postId) {
        await BlogModerationService.moderateComment(
          moderationDialog.postId,
          (moderationDialog.item as Comment).id,
          decision
        );
      }

      showNotification(
        `Successfully ${decision}ed ${moderationDialog.type}`,
        'success'
      );
      setModerationDialog({ open: false, type: 'post', item: null });
      setModerationComment('');
      loadModerationData();
    } catch (error) {
      showNotification(`Error ${decision}ing ${moderationDialog.type}`, 'error');
    }
  };

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Moderation Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Pending Posts (${pendingPosts.length})`} />
          <Tab label={`Reported Comments (${reportedComments.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <List>
          {pendingPosts.map((post) => (
            <ListItem
              key={post.id}
              secondaryAction={
                <Box>
                  <IconButton
                    color="success"
                    onClick={() =>
                      setModerationDialog({
                        open: true,
                        type: 'post',
                        item: post,
                      })
                    }
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      setModerationDialog({
                        open: true,
                        type: 'post',
                        item: post,
                      })
                    }
                  >
                    <Close />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={post.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      By {post.author} • {new Date(post.timestamp).toLocaleDateString()}
                    </Typography>
                    <br />
                    <Chip size="small" label={post.category} />
                    {post.tags.map((tag) => (
                      <Chip key={tag} size="small" label={tag} sx={{ ml: 1 }} />
                    ))}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <List>
          {reportedComments.map(({ post, comment }) => (
            <ListItem
              key={comment.id}
              secondaryAction={
                <Box>
                  <IconButton
                    color="success"
                    onClick={() =>
                      setModerationDialog({
                        open: true,
                        type: 'comment',
                        item: comment,
                        postId: post.id,
                      })
                    }
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      setModerationDialog({
                        open: true,
                        type: 'comment',
                        item: comment,
                        postId: post.id,
                      })
                    }
                  >
                    <Close />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <>
                    <Flag color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {comment.content}
                  </>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      By {comment.author} • {new Date(comment.timestamp).toLocaleDateString()}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="error">
                      Reported for: {comment.reportReason}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      On post: {post.title}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <Dialog open={moderationDialog.open} onClose={() => setModerationDialog({ open: false, type: 'post', item: null })}>
        <DialogTitle>
          {moderationDialog.type === 'post' ? 'Moderate Post' : 'Moderate Comment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Moderation Comment"
            fullWidth
            multiline
            rows={4}
            value={moderationComment}
            onChange={(e) => setModerationComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModerationAction('reject')} color="error">
            Reject
          </Button>
          <Button onClick={() => handleModerationAction('approve')} color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
