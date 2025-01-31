const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Ensure this is explicitly defined as a string
  contacted: { type: Boolean, default: false }, // Boolean for the checkbox
  createdBy: { type: String, required: true}, // User's full name
  date: { type: Date, default: Date.now }, // Timestamp for note creation
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String },
  doNotCall: { type: Boolean, default: false },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  notes: [NoteSchema],
});

module.exports = mongoose.model('Contact', ContactSchema);