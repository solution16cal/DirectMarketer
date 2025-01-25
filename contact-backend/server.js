const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');


// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/contacts';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true, // Optional for Mongoose v6+
    useUnifiedTopology: true, // Optional for Mongoose v6+
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));