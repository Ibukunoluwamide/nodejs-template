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
        url: 'https://remitex-server.onrender.com',
        // description: 'Development Server',
      },
      {
        url: 'http://localhost:5000',
        // description: 'Development Server',
      }
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
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone_number: { type: 'string', example: '+1234567890' },
                    nationality: { type: 'string' },
                    password: { type: 'string', format: 'password' },
                  },
                  required: ['first_name', 'last_name', 'email', 'phone_number', 'password'],
                  example: {
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'johndoe@example.com',
                    phone_number: '+2348015678920',
                    nationality: 'Nigeria',
                    password: 'Password123!',
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully. Verification email sent.',
            },
            400: {
              description: 'Validation error or email already exists.',
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Auth'],
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
      '/auth/verify-otp': {
        post: {
          summary: 'Email and OTP verification',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    code: { type: 'string' },
                    type: { type: 'string', example:"otp or email" },
                  },
                  example: {
                    email: 'user@example.com',
                    code: '123456',
                    type: 'email',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Email verified successfully',
            },
            401: {
              description: 'Invalid credentials',
            },
          },
        },
      },       
      '/auth/set-transaction-pin': {
        post: {
          summary: 'Set Transaction PIN',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    pin: { type: 'string' },
                  },
                  example: {
                    email: 'user@example.com',
                    pin: '1234',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Transaction PIN set successfully',
            },
            401: {
              description: 'User not found',
            },
          },
        },
      },     
        '/auth/google': {
          get: {
            summary: 'Sign in with Google',
            tags: ['Auth'],
            description: 'Redirect to Google OAuth for user authentication.',
            responses: {
              200: {
                description: 'Redirects to Google Sign-In page.',
              },
            },
          },
        },
        '/auth/google/callback': {
          get: {
            summary: 'Google Sign-In callback',
            tags: ['Auth'],
            description: 'Callback URL for Google authentication.',
            responses: {
              200: {
                description: 'User signed in successfully with Google.',
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
              400: {
                description: 'Google authentication failed.',
              },
            },
          },
        },
        '/auth/forgot-password': {
          post: {
            summary: 'Forgot password',
            tags: ['Auth'],
            description: 'Send a password reset link to the user’s email.',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', format: 'email' },
                    },
                    required: ['email'],
                    example: {
                      email: 'johndoe@example.com',
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Password reset link sent to the email.',
              },
              404: {
                description: 'User with the given email not found.',
              },
            },
          },
        },
        '/auth/reset-password': {
          post: {
            summary: 'Reset password',
            tags: ['Auth'],
            description: 'Reset the user’s password using a valid token.',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', description: 'user email' },
                      new_password: { type: 'string', format: 'password' },
                    },
                    required: ['token', 'new_password'],
                    example: {
                      email: 'example@gmail.com',
                      new_password: 'NewPassword123!',
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Password reset successfully.',
              },
              400: {
                description: 'Invalid token or password format.',
              },
            },
          },
      },
      
    },
  };
  
  module.exports = swaggerDocumentation;
  