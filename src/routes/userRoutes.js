
const express = require('express');
const { fetchUserDetails } = require('../controllers/userController');
const { validateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to fetch user details (protected)
router.get('/me', validateToken, fetchUserDetails);

module.exports = router;
