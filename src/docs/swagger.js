const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; 
const routes = ["../../src/routes/index.js"]; // Ensure the correct path

const options = {
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API documentation",
  },
  servers: [
    {
      url: "http://localhost:5001", // Base URL for local development
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  
};

swaggerAutogen(outputFile, routes, options);
