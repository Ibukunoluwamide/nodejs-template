
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
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
