
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String },
  password: { type: String },
  profile_image: { type: String, default: null },
  status: { type: Boolean, default: false }, // Email verification status
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  transaction_pin: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
