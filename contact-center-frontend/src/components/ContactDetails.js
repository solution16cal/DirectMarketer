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
        setUpdatedContact({
          name: response.data.name,
          companyName: response.data.companyName,
          phone: response.data.phone,
          email: response.data.email,
          doNotCall: response.data.doNotCall,
        });
      })
      .catch((error) => console.error('Error fetching contact:', error));
  }, [id]);

  // Fetch email templates
  useEffect(() => {
    API.fetchEmailTemplates()
      .then((response) => setTemplates(response.data))
      .catch((error) => console.error('Error fetching templates:', error));
  }, []);

  // Handle "Do Not Call" toggle
  const handleToggleDoNotCall = () => {
    const updatedDoNotCall = !updatedContact.doNotCall;
    setUpdatedContact((prev) => ({ ...prev, doNotCall: updatedDoNotCall }));

    API.updateContact(id, { doNotCall: updatedDoNotCall })
      .then(() => {
        setContact((prev) => ({ ...prev, doNotCall: updatedDoNotCall }));
      })
      .catch((error) => console.error('Error updating Do Not Call:', error));
  };

  // Handle saving edited contact fields
  const handleSaveContact = () => {
    API.updateContact(id, {
      name: updatedContact.name,
      companyName: updatedContact.companyName,
      phone: updatedContact.phone,
      email: updatedContact.email,
    })
      .then((response) => {
        setContact(response.data);
        setIsEditing(false);
      })
      .catch((error) => console.error('Error saving contact:', error));
  };

  // Handle adding a note
  const handleAddNote = () => {
    if (!note.trim()) return;
    API.addNote(id, { text: note, contacted })
      .then((response) => {
        setContact((prev) => ({
          ...prev,
          notes: response.data.notes,
        }));
        setNote('');
        setContacted(false);
      })
      .catch((error) => console.error('Error adding note:', error));
  };

  // Handle selecting an email template and dynamically render placeholders
  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t._id === templateId);
    setSelectedTemplate(templateId);
    if (template && contact) {
      const rendered = Mustache.render(template.content, { contact });
      setEmailContent(rendered);
    }
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Contact Details
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6} style={{ position: 'sticky', top: '16px', zIndex: 1 }}>
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
                  <IconButton onClick={() => setIsEditing(true)}>
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
                  <Typography variant="subtitle2">{contact.email}</Typography>
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
                InputProps={{ style: { resize: 'vertical' } }}
                style={{ marginTop: '1rem' }}
              />
              <FormControlLabel
                control={<Checkbox checked={contacted} onChange={(e) => setContacted(e.target.checked)} />}
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

              {/* Email Section */}
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
                InputProps={{ style: { resize: 'vertical' } }}
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
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <List>
                {contact.notes
                  ?.slice()
                  .reverse()
                  .map((note, index) => (
                    <ListItem key={index} style={{ backgroundColor: note.contacted ? 'lightgreen' : 'inherit' }}>
                      <ListItemText
                        primary={`${note.text} ${note.contacted ? '(Customer Contacted)' : ''}`}
                        secondary={`Added by ${note.createdBy} on ${new Date(note.date).toLocaleString()}`}
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