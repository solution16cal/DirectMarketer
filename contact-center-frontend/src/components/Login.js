import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.login({ email, password });
      localStorage.setItem('token', response.data.token); // Save JWT to localStorage
      navigate('/'); // Redirect to the dashboard
    } catch (err) {
      console.error('Error during login:', err.response?.data || err);
      setError('Invalid email or password');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirect to the registration page
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Email"
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
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleRegisterRedirect}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;