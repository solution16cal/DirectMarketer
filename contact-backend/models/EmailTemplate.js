const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);