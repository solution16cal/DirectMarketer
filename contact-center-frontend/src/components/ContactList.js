import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import API from '../api';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.fetchContacts()
      .then((res) => setContacts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Contact List</Typography>
      <Button variant="contained" onClick={() => navigate('/create')}>Add Contact</Button>
      <List>
        {contacts.map((contact) => (
          <ListItem key={contact._id} button onClick={() => navigate(`/contacts/${contact._id}`)}>
            <ListItemText primary={contact.name} secondary={contact.phone} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ContactList;