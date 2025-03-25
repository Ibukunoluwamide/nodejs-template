
const express = require('express');
const { fetchUserProfile, updateUserProfile } = require('../controllers/userController');
const { validateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to fetch user details (protected)
router.get('/me', validateToken, fetchUserProfile);
router.put('/update-profile', validateToken,  updateUserProfile);

module.exports = router;
