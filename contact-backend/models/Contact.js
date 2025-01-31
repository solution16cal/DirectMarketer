const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  contacted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['note', 'email'], // Allow only 'note' or 'email'
    default: 'note',
  },
  content: {
    type: String, // Optional field for storing email content
    default: '',
  },
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