const User = require("../models/User");

  
  
// Fetch user details
const fetchUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password -transaction_pin'); // Exclude sensitive fields
      if (!user) return res.status(404).send({'error':'User not found'});
  
      res.status(200).json(user);
    } catch (err) {
        res.status(500).send({'error':'Server error'});
    }
  };
  
  module.exports = {  fetchUserDetails };
    