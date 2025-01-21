const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateToken = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied: No Token Provided');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the user's data to the request object
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = { validateToken };

