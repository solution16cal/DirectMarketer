const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path to your User model

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'fullName _id'); // Fetch only fullName and _id
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;