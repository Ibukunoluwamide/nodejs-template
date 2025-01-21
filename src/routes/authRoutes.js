const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUser, verifyEmail, setTransactionPin, loginUser } = require('../controllers/userController');
const { sendForgotPasswordOtp, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/set-transaction-pin', setTransactionPin);
router.post('/login', loginUser);
router.post('/forgot-password', sendForgotPasswordOtp);
router.post('/reset-password', resetPassword);


// Google Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Generate JWT for the authenticated user
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and user details
    res.status(200).send({
      message: 'Google login successful',
      token,
      user: {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        profile_image: req.user.profile_image,
      },
    });
  }
);

module.exports = router;

