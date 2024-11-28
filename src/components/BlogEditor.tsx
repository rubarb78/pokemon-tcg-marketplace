import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BlogPost } from '../types/blog';

interface BlogEditorProps {
  onSubmit: (post: Omit<BlogPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  initialValues?: Partial<BlogPost>;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onSubmit, initialValues }) => {
  const [content, setContent] = React.useState(initialValues?.content || '');
  const [title, setTitle] = React.useState(initialValues?.title || '');
  const [category, setCategory] = React.useState<BlogPost['category']>(initialValues?.category || 'strategy');
  const [tags, setTags] = React.useState<string[]>(initialValues?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
      tags,
      author: 'Current User', // This should be replaced with actual user data
      authorId: 'user123', // This should be replaced with actual user ID
    });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
        >
          <MenuItem value="strategy">Strategy</MenuItem>
          <MenuItem value="collection">Collection</MenuItem>
          <MenuItem value="trading">Trading</MenuItem>
          <MenuItem value="news">News</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Tags (comma-separated)"
        value={tags.join(', ')}
        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
        margin="normal"
        helperText="Enter tags separated by commas"
      />

      <Box sx={{ my: 2 }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          style={{ height: '300px', marginBottom: '50px' }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        fullWidth
      >
        {initialValues ? 'Update Post' : 'Create Post'}
      </Button>
    </Box>
  );
};

export default BlogEditor;
