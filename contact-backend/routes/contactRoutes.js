const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const authMiddleware = require('../routes/authMiddleware');
const router = express.Router();

// Get All Contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

// Create a New Contact
router.post('/', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error });
  }
});

// Add a Note to a Contact
router.post('/:id/notes', authMiddleware, async (req, res) => {
  const { text, contacted } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Note text is required' });
  }

  try {
    // Find the contact by ID
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Find the logged-in user
    const user = await User.findById(req.user.id); // `req.user` is populated by the auth middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new note with `createdBy` field
    const newNote = {
      text,
      contacted: !!contacted, // Ensure contacted is a boolean
      createdBy: user.fullName, // Include the user's full name
    };

    contact.notes.push(newNote); // Add the note to the contact's notes array
    await contact.save(); // Save the contact with the new note

    res.status(200).json(contact); // Return the updated contact
  } catch (error) {
    console.error('Error adding note:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

module.exports = router;