const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, // Ensure full name is required
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified and isn't already hashed
  if (!this.isModified('password')) return next();

  // Check if the password is already hashed
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});
module.exports = mongoose.model('User', UserSchema);