const Otp = require('../models/Otp');
const User = require('../models/User');
const { sendOtp } = require('../services/emailService');
const bcrypt = require('bcryptjs');

const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Generate a new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Save OTP to the database
    const otp = new Otp({ email, code: otpCode, expiresAt: otpExpiry });
    await otp.save();

    // Send OTP to user's email
    await sendOtp(email, otpCode, 'otpVerification');

    res.status(200).send({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
};



const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  try {
    // Validate the OTP
    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the user's password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Delete the used OTP
    res.status(200).send({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Server error',err });
  }
};

module.exports = { sendForgotPasswordOtp, resetPassword };
