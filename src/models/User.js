const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_image: { type: String, default: null },
  status: { type: Boolean, default: false }, // Email verification status
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  nationality: { type: String },
  transaction_pin: { type: String, default: null },
  wallet_balance: { type: Number, default: 0 }, // USD wallet balance
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
