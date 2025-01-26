const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('./authMiddleware');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('Checking email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Email not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user);
    console.log('Plain Password:', password);
    console.log('Stored Hash:', user.password);

    const isMatch = await bcryptjs.compare(password, user.password);
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const newUser = new User({ fullName, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: 'User ID and new password are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User before updating password:', user);

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    console.log('New Hashed Password:', hashedPassword);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    console.log('User after updating password:', user);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;