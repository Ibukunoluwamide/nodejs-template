
const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');
const { sendVerificationEmail } = require('../services/emailService');

// Registration
const registerUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { first_name, last_name, email, phone_number, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
    });

    await user.save();

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, verificationCode);

    res.status(201).send({ email, message: 'Registration successful. Check your email for verification.' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Verify email
const verifyEmail = async (req, res) => {
    const { email, code } = req.body;
  
    try {
      // Check if the OTP exists and is valid
      const otpRecord = await Otp.findOne({ email, code });
      if (!otpRecord) return res.status(400).send({ error: 'Invalid or expired verification code' });
  
      // Update user status to verified
      const user = await User.findOneAndUpdate({ email }, { status: true }, { new: true });
      if (!user) return res.status(400).send({ error: 'User not found' });
  
      // Delete the OTP after successful verification
      await Otp.deleteOne({ email, code });
  
      res.status(200).send({ message: 'Email verified successfully' });
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
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send({ message: 'Invalid email or password' });
  
      if (!user.status) return res.status(400).send({ error: 'Email not verified' });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).send({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).send({ token });
    } catch (err) {
      res.status(500).send({ error: 'Server error' });
    }
  };
  
  
// Fetch user details
const fetchUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password -transaction_pin'); // Exclude sensitive fields
      if (!user) return res.status(404).send({'error':'User not found'});
  
      res.status(200).json(user);
    } catch (err) {
        res.status(500).send({'error':'Server error'});
    }
  };
  
  module.exports = { registerUser, verifyEmail, setTransactionPin, loginUser, fetchUserDetails };
    