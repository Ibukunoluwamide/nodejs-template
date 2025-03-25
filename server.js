const express = require('express');
const dotenv = require('dotenv');
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

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Setup Swagger
setupSwaggerDocs(app);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
