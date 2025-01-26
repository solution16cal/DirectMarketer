import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Card, CardContent } from '@mui/material';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; // CSV parser library

const ContactForm = () => {
  const [contact, setContact] = useState({ name: '', companyName: '', phone: '', email: '' });
  const [csvData, setCsvData] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    API.createContact(contact)
      .then(() => navigate('/'))
      .catch((err) => console.error(err));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log('Parsed CSV Data:', results.data);
          setCsvData(results.data); // Parsed CSV data as an array of objects
        },
        error: function (error) {
          console.error('Error parsing CSV:', error);
        },
      });
    }
  };

  const handleImport = () => {
    if (csvData.length > 0) {
      API.importContacts(csvData)
        .then(() => {
          navigate('/'); // Redirect to contact list after import
        })
        .catch((err) => console.error('Error importing contacts:', err));
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  return (
    <Container style={{ marginTop: '2rem' }}>

      <Grid container spacing={4}>
        {/* Left Column: Add Contact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Contact
              </Typography>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
              />
              <TextField
                label="Company Name"
                fullWidth
                margin="normal"
                value={contact.companyName}
                onChange={(e) => setContact({ ...contact, companyName: e.target.value })}
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handleSubmit}
              >
                Save Contact
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Import Contacts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Import Contacts from CSV
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Upload a CSV file with columns: Name, Company Name, Phone, Email.
              </Typography>
              <input
                type="file"
                accept=".csv"
                style={{ marginTop: '1rem', marginBottom: '1rem' }}
                onChange={handleFileChange}
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handleImport}
              >
                Import Contacts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactForm;