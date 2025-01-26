const express = require('express');
const EmailTemplate = require('../models/EmailTemplate');
const authMiddleware = require('./authMiddleware');
const router = express.Router();

// Get all email templates
router.get('/', authMiddleware, async (req, res) => {
  try {
    const templates = await EmailTemplate.find({ createdBy: req.user.id });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error });
  }
});

// Create a new email template
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newTemplate = new EmailTemplate({
      title,
      content,
      createdBy: req.user.id,
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error });
  }
});

// Delete a template
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (template.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await template.remove();
    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error });
  }
});

module.exports = router;