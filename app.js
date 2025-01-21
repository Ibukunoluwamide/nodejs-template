const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('./src/config/passport');
const setupSwaggerDocs = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Setup Swagger
setupSwaggerDocs(app);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to Remitex API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
