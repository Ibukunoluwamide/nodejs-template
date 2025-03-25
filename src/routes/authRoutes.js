const express = require('express');
const { registerUser, verifyOtp, loginUser, sendForgotPasswordOtp, resetPassword, resendOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp',resendOtp);
router.post('/login', loginUser);
router.post('/forgot-password', sendForgotPasswordOtp);
router.post('/reset-password', resetPassword);


module.exports = router;

