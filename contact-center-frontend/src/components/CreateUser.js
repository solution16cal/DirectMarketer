import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const CreateUser = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users for password reset dropdown
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleCreateUser = async () => {
    setError('');
    setSuccess('');

    if (!fullName || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password,
      });

      setSuccess('User created successfully!');
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!selectedUserId || !newPassword) {
      setError('Please select a user and enter a new password');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        userId: selectedUserId,
        newPassword,
      });

      setSuccess('Password reset successfully!');
      setSelectedUserId('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Create New User */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New User
              </Typography>
              {error && (
                <Typography variant="body2" color="error" style={{ marginBottom: '1rem' }}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography
                  variant="body2"
                  style={{ marginBottom: '1rem', color: 'green' }}
                >
                  {success}
                </Typography>
              )}
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handleCreateUser}
              >
                Create User
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Reset Password */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reset Password
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <MenuItem value="">Select a User</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: '1rem' }}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateUser;