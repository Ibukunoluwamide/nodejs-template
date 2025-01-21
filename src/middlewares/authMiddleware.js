const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).send({ error: 'Access Denied' });
    
        // Remove Bearer prefix and extract the token
        const token = authHeader.replace('Bearer ', '');
    
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Add user info to the request object
        // console.log(verified);
        next();
      } catch (err) {
        res.status(400).send({ error: 'Invalid Token' });
      }
};

module.exports = { validateToken };

