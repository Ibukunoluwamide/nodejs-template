const swaggerUi = require('swagger-ui-express');
const swaggerDocumentation = require('../docs/swaggerDocs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Remitex API',
      version: '1.0.0',
      description: 'API documentation for the Remitex financial project',
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


const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));
  console.log('Swagger docs available at http://localhost:5000/api-docs');
};

module.exports = setupSwaggerDocs;

