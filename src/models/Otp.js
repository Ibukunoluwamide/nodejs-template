const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatically delete expired OTPs

module.exports = mongoose.model('Otp', otpSchema);

