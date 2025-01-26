import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Chip, Button, ButtonGroup, TextField, Pagination } from '@mui/material';
import API from '../api';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(25); // Number of contacts per page
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order: descending
  const navigate = useNavigate();

  useEffect(() => {
    API.fetchContacts()
      .then((res) => {
        setContacts(res.data);
        setSortedContacts(res.data); // Initialize sortedContacts
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter contacts by search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
    setSortedContacts(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Sort contacts by last updated time
  const handleSort = (order) => {
    const sorted = [...sortedContacts].sort((a, b) => {
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setSortedContacts(sorted);
    setSortOrder(order);
  };

  // Get current page contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(indexOfFirstContact, indexOfLastContact);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container>
      <div style={{ marginBottom: '1rem' }}>

        {/* Search Bar */}
        <TextField
          label="Search Contacts"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        {/* Sorting Buttons */}
        <ButtonGroup variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
          <Button onClick={() => handleSort('asc')} disabled={sortOrder === 'asc'}>
            Sort Ascending
          </Button>
          <Button onClick={() => handleSort('desc')} disabled={sortOrder === 'desc'}>
            Sort Descending
          </Button>
        </ButtonGroup>
      </div>

      {/* Contact List */}
      <List>
        {currentContacts.map((contact) => (
          <ListItem key={contact._id} button onClick={() => navigate(`/contacts/${contact._id}`)}>
            {/* Contact Details */}
            <ListItemText
              primary={contact.name}
              secondary={
                <>
                  {contact.phone}
                  <br />
                  {contact.companyName}
                </>
              }
            />
            {/* Chips Section */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Do Not Call Chip */}
              {contact.doNotCall && (
                <Chip label="Do Not Call" color="error" />
              )}

              {/* Last Updated Chip */}
              {contact.lastUpdated && (
                <Chip
                  label={`Last Updated: ${new Date(contact.lastUpdated).toLocaleString()} by ${contact.lastUpdatedBy}`}
                  color="primary"
                />
              )}
            </div>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(sortedContacts.length / contactsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export default ContactList;