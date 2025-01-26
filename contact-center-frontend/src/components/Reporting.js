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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

const Reporting = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Fetch users for the dropdown
    axios
      .get('http://localhost:5000/api/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/reports/notes', {
        startDate,
        endDate,
        userName,
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleGenerateReport = () => {
    fetchReport();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchReport();
    }, 10000);

    return () => clearInterval(interval); // Clear interval when component unmounts
  };

  return (
    <Container style={{ marginTop: '2rem' }}>


      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
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
                  onChange={(e) => setUserName(e.target.value)}
                >
                  <MenuItem value="">All Users</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user.fullName}>
                      {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                fullWidth
                style={{ marginTop: '1rem' }}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              {report ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">Total Notes</Typography>
                        <Typography variant="h4">{report.totalNotes}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">Customer Contacted</Typography>
                        <Typography variant="h4">{report.contactedNotes}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Typography>No results yet. Generate a report to see data.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reporting;