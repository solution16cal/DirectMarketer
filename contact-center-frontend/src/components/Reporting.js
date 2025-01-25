import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from '@mui/material';
import axios from 'axios';

const Reporting = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState(null);
  
    const handleGenerateReport = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/reports/notes', {
          startDate,
          endDate,
        });
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Notes Reporting
      </Typography>
      <Box component="form" noValidate autoComplete="off" style={{ marginBottom: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              style={{ marginTop: '1rem' }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Box>

      {report && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Report Results
          </Typography>
          <Typography>Total Notes: {report.totalNotes}</Typography>
          <Typography>
            Customer Contacted Notes: {report.contactedNotes}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Reporting;