const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();
app.use(cors())


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
