import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  ButtonGroup,
  TextField,
  Pagination,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import API from '../api';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [users, setUsers] = useState([]); // List of users for assignment filtering
  const [filterAssignedTo, setFilterAssignedTo] = useState(''); // State for filtering by assigned user
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(25); // Number of contacts per page
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order: descending
  const navigate = useNavigate();

  // Fetch contacts and users
  useEffect(() => {
    API.fetchContacts()
      .then((res) => {
        setContacts(res.data);
        setSortedContacts(res.data); // Initialize sortedContacts
      })
      .catch((err) => console.error(err));

    API.fetchUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  // Filter and search contacts
  useEffect(() => {
    const filtered = contacts
      .filter(
        (contact) =>
          !filterAssignedTo || contact.assignedTo?._id === filterAssignedTo
      )
      .filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Sort filtered contacts by last updated
    const sorted = filtered.sort((a, b) => {
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setSortedContacts(sorted);
    setCurrentPage(1); // Reset to first page on filter or search
  }, [contacts, filterAssignedTo, searchQuery, sortOrder]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Get current page contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  return (
    <Container>
      <div style={{ marginBottom: '1rem' }}>
        {/* Search Bar */}
        <TextField
          label="Search Contacts"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />

        {/* Assigned User Filter */}
        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
          <Select
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
          >
            <MenuItem value="">All Users</MenuItem>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sorting Buttons */}
        <ButtonGroup variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
          <Button onClick={() => setSortOrder('asc')} disabled={sortOrder === 'asc'}>
            Sort Ascending
          </Button>
          <Button onClick={() => setSortOrder('desc')} disabled={sortOrder === 'desc'}>
            Sort Descending
          </Button>
        </ButtonGroup>
      </div>

      {/* Contact List */}
      <List>
        {currentContacts.map((contact) => (
          <ListItem key={contact._id} button onClick={() => navigate(`/contacts/${contact._id}`)}>
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Assigned User Chip */}
              {contact.assignedTo && (
                <Chip
                  label={`Assigned to: ${contact.assignedTo.fullName}`}
                  style={{ marginLeft: '10px' }}
                />
              )}

              {/* Do Not Call Chip */}
              {contact.doNotCall && <Chip label="Do Not Call" color="error" />}

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