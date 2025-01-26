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
} from '@mui/material';
import API from '../api';

const ContactDetails = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [note, setNote] = useState('');
  const [contacted, setContacted] = useState(false);
  const [emailContent, setEmailContent] = useState(''); // State for email content

  useEffect(() => {
    API.fetchContact(id)
      .then((response) => setContact(response.data))
      .catch((error) => console.error('Error fetching contact:', error));
  }, [id]);

  const handleAddNote = () => {
    API.addNote(id, { text: note, contacted })
      .then((response) => {
        setContact(response.data); // Update contact with new notes
        setNote(''); // Clear note input
        setContacted(false); // Reset checkbox
      })
      .catch((error) => console.error('Error adding note:', error));
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
              <Typography variant="h5">{contact.name}</Typography>
              <Typography variant="subtitle1">{contact.phone}</Typography>
              <Typography variant="subtitle2" gutterBottom>
                {contact.email}
              </Typography>

              <Typography variant="h6" style={{ marginTop: '1rem' }}>
                Add Note
              </Typography>
              <TextField
                label="Add Note"
                fullWidth
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
              <Typography variant="h6" style={{ marginTop: '2rem' }}>
                Email Customer
              </Typography>
              <TextField
                label="Email Content"
                fullWidth
                multiline
                rows={4}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                style={{ marginTop: '1rem' }}
              />
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: '1rem' }}
                fullWidth
                onClick={() => alert('This is a placeholder for sending emails.')}
              >
                Send Email
              </Button>
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
                  .reverse() // Show newest notes first
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