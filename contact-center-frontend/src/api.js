import axios from 'axios';


const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Function to login a user
export const login = (data) => API.post('/auth/login', data);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Function to fetch all contacts
export const fetchContacts = () => API.get('/contacts');

// Function to fetch a single contact by ID
export const fetchContact = (id) => API.get(`/contacts/${id}`);

// Function to create a new contact
export const createContact = (data) => API.post('/contacts', data);

// Function to add a note to a contact
export const addNote = (id, { text, contacted }) => {
    return API.post(`/contacts/${id}/notes`, { text, contacted });
  };

export default {
  fetchContacts,
  fetchContact, // Added this export
  createContact,
  addNote,
  login,

};