import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import API from '../api';

const ContactDetails = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [note, setNote] = useState('');
  const [contacted, setContacted] = useState(false);

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
    <Container>
      <Typography variant="h4">{contact.name}</Typography>
      <Typography variant="subtitle1">{contact.phone}</Typography>
      <Typography variant="subtitle2">{contact.email}</Typography>

      <Typography variant="h5" style={{ marginTop: '1rem' }}>
        Notes
      </Typography>
      <List>
        {contact.notes
          .slice()
          .reverse() // Show newest notes first
          .map((note, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${note.text} ${note.contacted ? '(Customer Contacted)' : ''}`}
                secondary={`Added by ${note.createdBy} on ${new Date(note.date).toLocaleString()}`}
              />
            </ListItem>
          ))}
      </List>

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
      >
        Add Note
      </Button>
    </Container>
  );
};

export default ContactDetails;