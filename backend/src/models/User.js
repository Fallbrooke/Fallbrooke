const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Add additional fields as needed (e.g., password for authentication)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);