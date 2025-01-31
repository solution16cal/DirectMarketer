import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../api';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [editTemplateId, setEditTemplateId] = useState(null); // ID of the template being edited
  const [editFields, setEditFields] = useState({ title: '', subject: '', content: '' }); // Editable fields

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
    if (!title || !subject || !content) {
      setError('Title, subject, and content are required');
      return;
    }

    try {
      await API.createEmailTemplate({ title, subject, content });
      setTitle('');
      setSubject('');
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

  const handleEditTemplate = (template) => {
    setEditTemplateId(template._id);
    setEditFields({
      title: template.title,
      subject: template.subject,
      content: template.content,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await API.updateEmailTemplate(id, editFields);
      setEditTemplateId(null); // Exit edit mode
      fetchTemplates(); // Refresh templates
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTemplateId(null); // Exit edit mode without saving
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
        label="Subject"
        fullWidth
        margin="normal"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
        Content
      </Typography>
      <ReactQuill value={content} onChange={setContent} theme="snow" style={{ marginBottom: '1rem' }} />

      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleCreateTemplate} style={{ marginTop: '1rem' }}>
        Add Template
      </Button>

      <Typography variant="h6" style={{ marginTop: '2rem' }}>
        Existing Templates
      </Typography>
      <List>
        {templates.map((template) => (
          <ListItem
            key={template._id}
            style={{ flexDirection: 'column', alignItems: 'start', paddingBottom: '1rem' }}
          >
            {editTemplateId === template._id ? (
              <Box style={{ width: '100%' }}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editFields.title}
                  onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                />
                <TextField
                  label="Subject"
                  fullWidth
                  margin="normal"
                  value={editFields.subject}
                  onChange={(e) => setEditFields({ ...editFields, subject: e.target.value })}
                />
                <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
                  Content
                </Typography>
                <ReactQuill
                  value={editFields.content}
                  onChange={(value) => setEditFields({ ...editFields, content: value })}
                  theme="snow"
                  style={{ marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => handleSaveEdit(template._id)}
                  >
                    Save
                  </Button>
                  <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </Box>
            ) : (
              <>
                <ListItemText primary={template.title} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <IconButton onClick={() => handleEditTemplate(template)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteTemplate(template._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EmailTemplates;