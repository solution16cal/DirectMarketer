import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const Reporting = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userName, setUserName] = useState(''); // Add this state
    const [users, setUsers] = useState([]);
    const [report, setReport] = useState(null);

  useEffect(() => {
    // Fetch users for the dropdown
    axios.get('http://localhost:5000/api/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/reports/notes', {
        startDate,
        endDate,
        userName, // Pass the user's full name
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Notes Reporting
      </Typography>
      <TextField
        label="Start Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="End Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
      <InputLabel>User</InputLabel>
  <Select
    value={userName}
    onChange={(e) => setUserName(e.target.value)} // Use userName instead of userId
  >
    <MenuItem value="">All Users</MenuItem>
    {users.map((user) => (
      <MenuItem key={user._id} value={user.fullName}> {/* Use fullName here */}
        {user.fullName}
      </MenuItem>
    ))}
  </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateReport}
        style={{ marginTop: '1rem' }}
      >
        Generate Report
      </Button>

      {report && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h5">Report Results:</Typography>
          <Typography>Total Notes: {report.totalNotes}</Typography>
          <Typography>Customer Contacted Notes: {report.contactedNotes}</Typography>
        </div>
      )}
    </Container>
  );
};

export default Reporting;