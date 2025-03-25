const User = require("../models/User");
const uploadImage = require("../utils/uploadImage");
const { profileUpdateValidation } = require("../utils/validation");

  // Function to check if a string is a valid base64 image
function isBase64Image(base64String) {
  const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/;
  return base64Pattern.test(base64String);
}
  
// Fetch user Profile
const fetchUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude sensitive fields
      if (!user) return res.status(404).send({'error':'User not found'});
  
      res.status(200).json(user);
    } catch (err) {
        res.status(500).send({'error':'Server error'});
    }
  };

  const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Get user ID from authenticated session
      const { error } = profileUpdateValidation(req.body); // Validate input data
  
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      const { first_name, last_name, phone_number, profile_image, address, gender, nationality } = req.body;
  
   // Handle profile picture upload if included
  
  if (profile_image) {
      if (!isBase64Image(profile_image)) {
          return res.status(400).json({ error: "Invalid profile image format. Must be base64." });
      }
      profile_image = await uploadImage(req.profile_image); // Upload new image
  }
  
      // Update the user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          first_name,
          last_name,
          phone_number,
          address,
          gender,
          nationality,
          profile_image,
        },
        { new: true, select: '-password' } // Exclude sensitive fields
      );
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  
    } catch (error) {
      console.error('Profile Update Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = {  fetchUserProfile, updateUserProfile };
    