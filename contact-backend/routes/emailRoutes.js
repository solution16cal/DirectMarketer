const express = require('express');
const sendEmail = require('../services/emailService');
const Contact = require('../models/Contact');
const authMiddleware = require('./authMiddleware');
const upload = require('./multerMiddleware');

const router = express.Router();

// Send email with an optional file attachment and record it as a note
router.post('/:id/send-email', authMiddleware, upload.single('attachment'), async (req, res) => {
  const { subject, content } = req.body;
  const contactId = req.params.id;
  const attachmentPath = req.file ? req.file.path : null;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Send email
    await sendEmail(contact.email, subject, content, attachmentPath);

    // Record email as a note
    contact.notes.push({
      text: `Email sent: ${subject}`,
      contacted: true,
      createdBy: req.user.fullName,
      date: new Date(),
    });

    await contact.save();

    res.status(200).json({ message: 'Email sent and recorded as a note' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
});

module.exports = router;