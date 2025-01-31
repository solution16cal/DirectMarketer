const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const authMiddleware = require('../routes/authMiddleware');
const router = express.Router();

// Get All Contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().populate('assignedTo', 'fullName');

    // Map contacts to include last note details
    const contactsWithLastNote = contacts.map((contact) => {
      const lastNote = contact.notes[contact.notes.length - 1]; // Get the most recent note
      return {
        ...contact._doc, // Spread original contact fields
        lastUpdated: lastNote ? lastNote.date : null,
        lastUpdatedBy: lastNote ? lastNote.createdBy : null,
      };
    });

    res.status(200).json(contactsWithLastNote);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('assignedTo', 'fullName');
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
// Bulk import contacts from CSV
router.post('/import', async (req, res) => {
  const contacts = req.body;

  try {
    if (!Array.isArray(contacts)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Save all contacts in bulk
    await Contact.insertMany(contacts);
    res.status(201).json({ message: 'Contacts imported successfully' });
  } catch (error) {
    console.error('Error importing contacts:', error);
    res.status(500).json({ message: 'Error importing contacts' });
  }
});

//Edit Contacts
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Error updating contact' });
  }
});

router.put('/:id/assign', authMiddleware, async (req, res) => {
  const { userId } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true } // Return the updated contact
    ).populate('assignedTo', 'fullName');

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error assigning user:', error);
    res.status(500).json({ message: 'Error assigning contact' });
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