/**
 * Swagger Documentation for Remitex API
 */
const swaggerDocumentation = {
    openapi: '3.0.0',
    info: {
      title: 'Remitex API',
      version: '1.0.0',
      description: 'API documentation for the Remitex financial project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management and authentication',
      },
    ],
    paths: {
      '/users/me': {
        get: {
          summary: 'Fetch user details',
          tags: ['Users'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'User details retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      first_name: { type: 'string' },
                      last_name: { type: 'string' },
                      email: { type: 'string' },
                      profile_image: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized - No token provided',
            },
            404: {
              description: 'User not found',
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  example: {
                    email: 'user@example.com',
                    password: 'yourpassword123',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful, returns JWT token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          first_name: { type: 'string' },
                          last_name: { type: 'string' },
                          email: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Invalid credentials',
            },
          },
        },
      },
    },
  };
  
  module.exports = swaggerDocumentation;
  