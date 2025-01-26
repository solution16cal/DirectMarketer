import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
  IconButton,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Mustache from 'mustache';
import API from '../api';

const ContactDetails = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [note, setNote] = useState('');
  const [contacted, setContacted] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContact, setUpdatedContact] = useState({});
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Fetch contact details
  useEffect(() => {
    API.fetchContact(id)
      .then((response) => {
        setContact(response.data);
        setUpdatedContact(response.data);
      })
      .catch((error) => console.error('Error fetching contact:', error));
  }, [id]);

  // Fetch email templates
  useEffect(() => {
    API.fetchEmailTemplates()
      .then((response) => setTemplates(response.data))
      .catch((error) => console.error('Error fetching templates:', error));
  }, []);

  // Handle adding a note
  const handleAddNote = () => {
    API.addNote(id, { text: note, contacted })
      .then((response) => {
        setContact(response.data);
        setNote('');
        setContacted(false);
      })
      .catch((error) => console.error('Error adding note:', error));
  };

  // Handle editing contact
  const handleEditContact = () => {
    setIsEditing(true);
  };

  // Handle saving edited contact
  const handleSaveContact = () => {
    API.updateContact(id, updatedContact)
      .then((response) => {
        setContact(response.data);
        setIsEditing(false);
      })
      .catch((error) => console.error('Error saving contact:', error));
  };

  // Handle "Do Not Call" toggle
  const handleToggleDoNotCall = () => {
    setUpdatedContact((prev) => ({ ...prev, doNotCall: !prev.doNotCall }));
  };

  // Handle selecting an email template and render dynamic fields
  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t._id === templateId);
    setSelectedTemplate(templateId);
    if (template && contact) {
      const rendered = Mustache.render(template.content, { contact });
      setEmailContent(rendered);
    }
  };

  const handleExpandTextArea = (e, setState) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setState(e.target.value);
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Contact Details
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column: Contact Details and Add Note */}
        <Grid
          item
          xs={12}
          md={6}
          style={{
            position: 'sticky',
            top: '16px',
            alignSelf: 'start',
            zIndex: 1,
          }}
        >
          <Card>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                  {isEditing ? 'Edit Contact' : contact.name}
                </Typography>
                <div>
                  {contact.doNotCall && (
                    <Chip
                      label="Do Not Call"
                      color="error"
                      style={{ marginRight: '8px' }}
                    />
                  )}
                  <IconButton onClick={handleEditContact}>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
              {isEditing ? (
                <>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={updatedContact.name || ''}
                    onChange={(e) =>
                      setUpdatedContact({ ...updatedContact, name: e.target.value })
                    }
                  />
                  <TextField
                    label="Company Name"
                    fullWidth
                    margin="normal"
                    value={updatedContact.companyName || ''}
                    onChange={(e) =>
                      setUpdatedContact({ ...updatedContact, companyName: e.target.value })
                    }
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    margin="normal"
                    value={updatedContact.phone || ''}
                    onChange={(e) =>
                      setUpdatedContact({ ...updatedContact, phone: e.target.value })
                    }
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={updatedContact.email || ''}
                    onChange={(e) =>
                      setUpdatedContact({ ...updatedContact, email: e.target.value })
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={updatedContact.doNotCall || false}
                        onChange={handleToggleDoNotCall}
                      />
                    }
                    label="Do Not Call"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '1rem' }}
                    onClick={handleSaveContact}
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{contact.companyName}</Typography>
                  <Typography variant="subtitle1">{contact.phone}</Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {contact.email}
                  </Typography>
                </>
              )}

              {/* Add Note Section */}
              <Typography variant="h6" style={{ marginTop: '2rem' }}>
                Add Note
              </Typography>
              <TextField
  label="Add Note"
  fullWidth
  multiline
  rows={3}
  value={note}
  onChange={(e) => setNote(e.target.value)}
  InputProps={{
    style: { resize: 'vertical' }, // Allow vertical resizing
  }}
  style={{ marginTop: '1rem' }}
/>


              <FormControlLabel
                control={
                  <Checkbox
                    checked={contacted}
                    onChange={(e) => setContacted(e.target.checked)}
                  />
                }
                label="Customer Contacted"
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem' }}
                onClick={handleAddNote}
                fullWidth
              >
                Add Note
              </Button>

              {/* Email Customer Section */}
              <div>
                <Typography variant="h6" style={{ marginTop: '2rem' }}>
                  Email Customer
                </Typography>
                <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                  >
                    <MenuItem value="">Select a Template</MenuItem>
                    {templates.map((template) => (
                      <MenuItem key={template._id} value={template._id}>
                        {template.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
  label="Email Content"
  fullWidth
  multiline
  rows={4}
  value={emailContent}
  onChange={(e) => setEmailContent(e.target.value)}
  InputProps={{
    style: { resize: 'vertical' }, // Allow vertical resizing
  }}
  style={{ marginTop: '1rem' }}
/>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: '1rem' }}
                  fullWidth
                  onClick={() => alert('Send email functionality to be implemented')}
                >
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Notes List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <List>
                {contact.notes
                  .slice()
                  .reverse()
                  .map((note, index) => (
                    <ListItem
                      key={index}
                      style={{
                        backgroundColor: note.contacted ? 'lightgreen' : 'inherit',
                        borderRadius: '4px',
                        marginBottom: '8px',
                      }}
                    >
                      <ListItemText
                        primary={`${note.text} ${
                          note.contacted ? '(Customer Contacted)' : ''
                        }`}
                        secondary={`Added by ${note.createdBy} on ${new Date(
                          note.date
                        ).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactDetails;