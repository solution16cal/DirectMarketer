import axios from 'axios';


const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Function to login a user
export const login = (data) => API.post('/auth/login', data);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
    console.log('Token sent with request:', token); // Debugging
  } else {
    console.log('No token found in localStorage'); // Debugging
  }
  return config;
});

// Function to fetch all contacts
export const fetchContacts = () => API.get('/contacts');

// Function to fetch a single contact by ID
export const fetchContact = (id) => API.get(`/contacts/${id}`);

// Function to create a new contact
export const createContact = (data) => API.post('/contacts', data);

// Editing Contacts
export const updateContact = (id, contactData) => API.put(`/contacts/${id}`, contactData);

export const importContacts = (contacts) => API.post('/contacts/import', contacts);

// Function to add a note to a contact
export const addNote = (id, { text, contacted }) => {
  console.log('Adding note with:', { text, contacted, id }); // Debugging
  return API.post(`/contacts/${id}/notes`, { text, contacted });
};
export const fetchEmailTemplates = () => API.get('/email-templates');
export const createEmailTemplate = (data) => API.post('/email-templates', data);
export const deleteEmailTemplate = (id) => API.delete(`/email-templates/${id}`);

export default {
  fetchContacts,
  fetchContact, // Added this export
  createContact,
  addNote,
  login,
  importContacts,
  updateContact,
  fetchEmailTemplates,
  createEmailTemplate,
  deleteEmailTemplate,

};