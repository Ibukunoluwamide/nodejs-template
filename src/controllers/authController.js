const Otp = require('../models/Otp');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');
const { sendOtp } = require('../services/emailService');

// Registration
const registerUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { first_name, last_name, email, phone_number, password, nationality } = req.body;

  try {
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already exists' });
    if (await User.findOne({ phone_number })) return res.status(400).json({ error: 'Phone number already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ first_name, last_name, email, phone_number, nationality, password: hashedPassword });

    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    await Otp.findOneAndUpdate(
      { email },
      { code: emailVerificationCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { new: true, upsert: true }
    );

    await sendOtp(email, emailVerificationCode, 'emailVerification');
    await user.save();

    res.status(201).json({ email, message: 'Registration successful. Check your email for verification.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', err });
  }
};



// Resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newOtp = Math.floor(100000 + Math.random() * 900000);
    await Otp.findOneAndUpdate(
      { email },
      { code: newOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { new: true, upsert: true }
    );

    await sendOtp(email, newOtp, 'emailVerification');
    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, code, expiresAt: { $gte: Date.now() } });
    if (!otpRecord) return res.status(400).json({ error: 'Invalid or expired verification code' });

    const user = await User.findOneAndUpdate({ email }, { email_verified: true }, { new: true });
    if (!user) return res.status(400).json({ error: 'User not found' });

    await Otp.deleteOne({ email, code });
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login
const loginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!user.email_verified) return res.status(400).json({ error: 'Email not verified' });
    if (['Pending', 'Suspended', 'Deactivated'].includes(user.account_status)) {
      return res.status(403).json({ error: `Your account is ${user.account_status.toLowerCase()}.` });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const { password: _,  ...safeUser } = user.toObject();

    res.status(200).json({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Forgot Password
const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.email_verified) return res.status(400).json({ error: 'Email not verified' });
    if (['Pending', 'Suspended', 'Deactivated'].includes(user.account_status)) {
      return res.status(403).json({ error: `Your account is ${user.account_status.toLowerCase()}.` });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { new: true, upsert: true }
    );

    await sendOtp(email, otpCode, 'passwordReset');
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Reset Password
const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
};
module.exports = { registerUser, resendOtp, verifyOtp, loginUser, sendForgotPasswordOtp, resetPassword };
