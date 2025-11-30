const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tags API',
      version: '1.0.0',
      description: 'Production-ready Tags API with advanced filtering and scalability',
      contact: {
        name: 'API Support',
        email: 'support@tagsapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server'
      },
      {
        url: 'https://api.tagsapi.com/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      },
      schemas: {
        Tag: {
          type: 'object',
          required: ['name', 'category', 'subcategory'],
          properties: {
            name: {
              type: 'string',
              description: 'Tag name',
              example: 'New York'
            },
            slug: {
              type: 'string',
              description: 'URL-friendly slug',
              example: 'new-york'
            },
            description: {
              type: 'string',
              description: 'Tag description',
              example: 'Geographic location in USA'
            },
            category: {
              type: 'string',
              enum: [
                'geography-timing',
                'people-roles',
                'domain-category',
                'skills-tools',
                'content-format',
                'intent-objectives',
                'constraints-compliance',
                'status-meta'
              ],
              description: 'Tag category'
            },
            subcategory: {
              type: 'string',
              description: 'Tag subcategory',
              example: 'Location'
            },
            type: {
              type: 'string',
              enum: ['standard', 'custom', 'system'],
              default: 'standard'
            },
            metadata: {
              type: 'object',
              properties: {
                color: {
                  type: 'string',
                  example: '#3B82F6'
                },
                icon: {
                  type: 'string'
                },
                priority: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100
                },
                weight: {
                  type: 'number',
                  minimum: 0
                }
              }
            },
            aliases: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            usageCount: {
              type: 'number',
              description: 'Number of times this tag has been used'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            isPublic: {
              type: 'boolean',
              default: true
            },
            isFeatured: {
              type: 'boolean',
              default: false
            }
          }
        },
        Category: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: {
              type: 'string',
              description: 'Category name'
            },
            slug: {
              type: 'string',
              description: 'URL-friendly slug'
            },
            description: {
              type: 'string',
              description: 'Category description'
            },
            subcategories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  slug: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  examples: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                }
              }
            },
            order: {
              type: 'number'
            },
            color: {
              type: 'string'
            },
            isActive: {
              type: 'boolean'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      },
      {
        apiKey: []
      }
    ]
  },
  apis: ['./src/routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
