import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Pagination,
  Grid,
} from '@mui/material';
import API from '../api';

const ContactList = () => {
  const [contacts, setContacts] = useState([]); // All contacts from the backend
  const [filteredContacts, setFilteredContacts] = useState([]); // Contacts after search
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [contactsPerPage] = useState(10); // Number of contacts per page
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch contacts from the backend
    API.fetchContacts()
      .then((res) => {
        setContacts(res.data);
        setFilteredContacts(res.data); // Initially show all contacts
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter contacts based on the search query
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.includes(query) ||
        (contact.email && contact.email.toLowerCase().includes(query))
    );
    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Calculate the displayed contacts based on pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Contact List
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search Contacts"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name, phone, or email"
      />

      {/* Contact List */}
      <List>
        {currentContacts.map((contact) => (
          <ListItem
            key={contact._id}
            button
            onClick={() => navigate(`/contacts/${contact._id}`)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <ListItemText
              primary={contact.name}
              secondary={
                <>
                  {contact.companyName}
                  <br />
                  {contact.phone}
                </>
              }
            />
            {contact.doNotCall && (
              <Chip
                label="Do Not Call"
                color="error"
                style={{ marginLeft: '10px' }}
              />
            )}
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredContacts.length / contactsPerPage)} // Total number of pages
        page={currentPage}
        onChange={handlePageChange}
        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export default ContactList;