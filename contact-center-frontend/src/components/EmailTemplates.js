import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../api';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await API.fetchEmailTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      await API.createEmailTemplate({ title, content });
      setTitle('');
      setContent('');
      setError('');
      fetchTemplates(); // Refresh templates
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await API.deleteEmailTemplate(id);
      fetchTemplates(); // Refresh templates
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Email Templates
      </Typography>

      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Content"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleCreateTemplate} style={{ marginTop: '1rem' }}>
        Add Template
      </Button>

      <Typography variant="h6" style={{ marginTop: '2rem' }}>
        Existing Templates
      </Typography>
      <List>
        {templates.map((template) => (
          <ListItem key={template._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={template.title} secondary={template.content} />
            <IconButton edge="end" onClick={() => handleDeleteTemplate(template._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EmailTemplates;