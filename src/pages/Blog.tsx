import { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Avatar } from '@mui/material';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

interface BlogPost {
  id: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: any;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content: newPost,
        author: user.displayName || user.email,
        authorId: user.uid,
        timestamp: new Date()
      });
      setNewPost('');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Blog de la communauté
      </Typography>
      
      {user && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Partagez vos pensées..."
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 1 }}>
              Publier
            </Button>
          </form>
        </Paper>
      )}

      {posts.map((post) => (
        <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>{post.author[0]}</Avatar>
            <Typography variant="subtitle1">{post.author}</Typography>
          </Box>
          <Typography variant="body1">{post.content}</Typography>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
            {post.timestamp?.toDate().toLocaleDateString()}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default Blog;
