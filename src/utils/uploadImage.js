const cloudinary = require('cloudinary').v2; // If using Cloudinary for image storage
require('dotenv').config();

// Cloudinary setup (you should replace with your actual credentials)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

// Function to handle image upload (to Cloudinary in this example)
const uploadImage = async (file) => {
  try {
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'template', // You can specify a folder here
    });
    return uploadResponse.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    throw new Error('Error uploading image: ' + error.message);
  }
};

module.exports = uploadImage;