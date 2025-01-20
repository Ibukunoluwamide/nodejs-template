// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize dotenv for environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to Remitex API!');
});

// Port from environment variables or default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

