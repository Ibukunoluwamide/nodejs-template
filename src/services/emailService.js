const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
require("dotenv").config();

const sendOtp = async (email, code, type) => {
  // Save the OTP to the database with an expiry time of 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  const otp = new Otp({
    email,
    code,
    expiresAt: otpExpiry,
  });

  await otp.save();

  // Define dynamic subject and body based on the type
  let subject;
  let body;

  if (type === 'emailVerification') {
    subject = 'Verify Your Email Address';
    body = `Thank you for registering! Please use the following code to verify your email address: ${code}`;
  } else if (type === 'otpVerification' || type === 'passwordReset') {
    subject = 'OTP Verification';
    body = `Use the following OTP code to complete your verification process: ${code}`;
  } else {
    throw new Error('Invalid email type specified');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: body,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtp };
