
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

const sendVerificationEmail = async (email, code) => {
      // Save the OTP to the database with an expiry time of 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  const otp = new Otp({
    email,
    code,
    expiresAt: otpExpiry,
  });

  await otp.save();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Set in .env
      pass: process.env.EMAIL_PASS, // Set in .env
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
