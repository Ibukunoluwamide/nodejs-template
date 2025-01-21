
const User = require('../models/User');
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

    res.status(201).send({ message: 'Registration successful. Check your email for verification.' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  // Assuming we store the code temporarily (or mock it for now)
  if (code === '123456') {
    const user = await User.findOneAndUpdate({ email }, { status: true });
    if (!user) return res.status(400).send('Invalid email');
    res.status(200).send('Email verified successfully');
  } else {
    res.status(400).send('Invalid verification code');
  }
};

// Set transaction pin
const setTransactionPin = async (req, res) => {
  const { email, pin } = req.body;

  const hashedPin = await bcrypt.hash(pin, 10);
  const user = await User.findOneAndUpdate({ email }, { transaction_pin: hashedPin });
  if (!user) return res.status(400).send('User not found');
  res.status(200).send('Transaction PIN set successfully');
};

// Login
const loginUser = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send('Invalid email or password');
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).send('Invalid email or password');
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).send({ token });
    } catch (err) {
      res.status(500).send('Server error');
    }
  };
  
// Fetch user details
const fetchUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password -transaction_pin'); // Exclude sensitive fields
      if (!user) return res.status(404).send('User not found');
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send('Server error');
    }
  };
  
  module.exports = { registerUser, verifyEmail, setTransactionPin, loginUser, fetchUserDetails };
    