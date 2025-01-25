import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const [contact, setContact] = useState({ name: '', companyName: '', phone: '', email: '' });
  const navigate = useNavigate();

  const handleSubmit = () => {
    API.createContact(contact)
      .then(() => navigate('/'))
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <TextField
        label="Name"
        fullWidth
        value={contact.name}
        onChange={(e) => setContact({ ...contact, name: e.target.value })}
      />
            <TextField
        label="Company Name"
        fullWidth
        value={contact.companyName}
        onChange={(e) => setContact({ ...contact, companyName: e.target.value })}
      />
      <TextField
        label="Phone"
        fullWidth
        value={contact.phone}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        value={contact.email}
        onChange={(e) => setContact({ ...contact, email: e.target.value })}
      />
      <Button variant="contained" onClick={handleSubmit}>Save Contact</Button>
    </Container>
  );
};

export default ContactForm;