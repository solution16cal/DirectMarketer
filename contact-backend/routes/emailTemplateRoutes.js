const express = require('express');
const EmailTemplate = require('../models/EmailTemplate');
const authMiddleware = require('./authMiddleware');
const router = express.Router();

// Get all email templates
router.get('/', async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error });
  }
});

// Create a new email template
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, subject } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newTemplate = new EmailTemplate({
      title,
      content,
      subject,
      createdBy: req.user.id,
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error });
  }
});


// Update an email template
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, subject, content } = req.body;
  
      // Check if all required fields are present
      if (!title || !subject || !content) {
        return res.status(400).json({ message: 'Title, subject, and content are required.' });
      }
  
      // Find the template by ID and update
      const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
        id,
        { title, subject, content },
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedTemplate) {
        return res.status(404).json({ message: 'Template not found' });
      }
  
      res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error('Error updating email template:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

// Delete a template
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      console.log('Deleting template with ID:', req.params.id);
  
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid template ID' });
      }
  
      const template = await EmailTemplate.findById(req.params.id);
  
      if (!template) {
        console.log('Template not found');
        return res.status(404).json({ message: 'Template not found' });
      }
  
      if (template.createdBy.toString() !== req.user.id) {
        console.log('Unauthorized deletion attempt by user:', req.user.id);
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await template.deleteOne(); // Fixed line: replacing deprecated remove()
      console.log('Template successfully deleted');
      res.status(200).json({ message: 'Template deleted' });
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({ message: 'Error deleting template', error: error.message });
    }
  });

module.exports = router;