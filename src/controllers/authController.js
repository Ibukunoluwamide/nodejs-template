const Otp = require('../models/Otp');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');
const { sendOtp } = require('../services/emailService');

// Registration
const registerUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { first_name, last_name, email, phone_number, password, nationality } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already exists');
    const existingUserPhone = await User.findOne({ phone_number });
    if (existingUserPhone) return res.status(400).send('Phone number already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name, 
      last_name,
      email,
      phone_number,
      nationality,
      password: hashedPassword,
    });

    await user.save();

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendOtp(email, verificationCode, 'emailVerification');

    res.status(201).send({ email, message: 'Registration successful. Check your email for verification.' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Verify email
const verifyOtp = async (req, res) => {
    const { email, code, type } = req.body;
  
    try {
      // Check if the OTP exists and is valid
      const otpRecord = await Otp.findOne({ email, code });
      if (!otpRecord) return res.status(400).send({ error: 'Invalid or expired verification code' });
  
      // Update user status to verified
      const user = await User.findOneAndUpdate({ email }, { status: true }, { new: true });
      if (!user) return res.status(400).send({ error: 'User not found' });
  
      // Delete the OTP after successful verification
      await Otp.deleteOne({ email, code });
  
      res.status(200).send({ message: `${type} verified successfully` });
    } catch (err) {
      res.status(500).send({ error: 'Server error' });
    }
  };

// Set transaction pin

const setTransactionPin = async (req, res) => {
  const { email, pin } = req.body;

  try {
    // Check if user exists and status is true
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'User not found' });
    if (!user.status) return res.status(400).send({ error: 'Email not verified' });

    // Hash the transaction pin and update user
    const hashedPin = await bcrypt.hash(pin, 10);
    user.transaction_pin = hashedPin;
    await user.save();
    res.status(200).send({ message: 'Transaction PIN set successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
};


// Login
const loginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
      // Find user including password for validation
      const user = await User.findOne({ email }).select('+password'); // Explicitly include password
      if (!user) return res.status(400).send({ message: 'Invalid email or password' });

      if (!user.status) return res.status(400).send({ error: 'Email not verified' });

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).send({ message: 'Invalid email or password' });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      // Exclude sensitive fields from the user object before sending the response
      const { password: _, transaction_pin, ...safeUser } = user.toObject();

      res.status(200).send({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).send({ error: 'Server error' });
  }
};



// Forgot Password
const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Generate a new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Save or update OTP in the database
    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, expiresAt: otpExpiry },
      { upsert: true, new: true }
    );

    // Send OTP to user's email
    await sendOtp(email, otpCode, 'passwordReset');

    res.status(200).send({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
};

// Verify OTP
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the OTP exists and is valid
    const otpRecord = await Otp.findOne({ email, code: otp, expiresAt: { $gte: Date.now() } });
    if (!otpRecord) return res.status(400).send({ error: 'Invalid or expired OTP' });

    // OTP is valid; delete it after successful verification
    await Otp.deleteOne({ email, code: otp });

    res.status(200).send({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
};


module.exports = {registerUser, verifyOtp, setTransactionPin, loginUser, sendForgotPasswordOtp, resetPassword };
