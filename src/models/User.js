const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, unique: true },
  password: { type: String, required: true },
  profile_image: { type: String, default: null },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  nationality: { type: String },
  email_verified: { type: Boolean, default: false },
  account_status: { 
    type: String, 
    enum: ['Active', 'Suspended', 'Pending', 'Deactivated'], 
    default: 'Active' 
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
