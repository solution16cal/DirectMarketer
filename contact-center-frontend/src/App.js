import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ContactDetails from './components/ContactDetails';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Reporting from './components/Reporting';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ContactList />} />
          <Route path="/create" element={<ContactForm />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/reporting" element={<Reporting />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;