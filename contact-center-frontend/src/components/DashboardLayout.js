import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  Button,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import API from '../api'; // Ensure you have access to fetch the contact details

const drawerWidth = 240;

const DashboardLayout = () => {
  const location = useLocation();
  const { id } = useParams(); // For dynamic Contact Details pages
  const [contact, setContact] = useState(null);
  const navigate = useNavigate();

  // Map static routes to page titles
  const pageTitles = {
    '/': 'Contact List',
    '/create': 'Contact Management',
    '/register': 'User Management',
    '/reporting': 'Reporting',
    '/email-templates': 'Email Templates',
  };


  const handleLogout = () => {
    // Clear the token or any stored user data
    localStorage.removeItem('token');

    // Redirect to login
    navigate('/login');
  };

  // Fetch contact details if on Contact Details page
  useEffect(() => {
    if (location.pathname.startsWith('/contacts/') && id) {
      API.fetchContact(id)
        .then((response) => setContact(response.data))
        .catch((error) => console.error('Error fetching contact:', error));
    }
  }, [location.pathname, id]);

  // Determine the current page title
  let pageTitle = pageTitles[location.pathname] || 'Contact Center';
  if (location.pathname.startsWith('/contacts/') && contact) {
    pageTitle = contact.name; // Dynamically set to contact's name
  }

  const menuItems = [
    { text: 'Contact List', path: '/' },
    { text: 'Contact Management', path: '/create' },
    { text: 'Reporting', path: '/reporting' },
    { text: 'User Management', path: '/register' },
    { text: 'Email Templates', path: '/email-templates' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top Navigation (Full-Width AppBar) */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            CC CRM
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              position: 'absolute',
              left: '300px', // Adjust to your desired position
            }}
          >
            {pageTitle}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            style={{ marginLeft: 'auto' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Left-Hand Menu */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginTop: '64px' },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => (window.location.href = item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginLeft: '-200px',
          marginTop: '0px', // Matches AppBar height
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;