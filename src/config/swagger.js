const swaggerAutogen = require("swagger-autogen")();


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Base URL for local development
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Indicating JWT format
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply the bearerAuth globally
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Location of route files for documentation
};


const outputFile = "./swagger-output.json"; // Generated file
const routes = ["../routes/*.js"]; // Your main entry point

swaggerAutogen(outputFile, routes, options).then(() => {
    require("../../server"); // Start your server after generating docs
});

