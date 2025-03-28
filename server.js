const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/docs/swagger-output.json");
const connectDB = require('./src/config/db');
const routes = require('./src/routes'); // Import the centralized routes

dotenv.config();

const app = express();
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use all routes from `routes/index.js`
app.use('/', routes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
