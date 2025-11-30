const express = require('express');
const tagRoutes = require('./tagRoutes');
const categoryRoutes = require('./categoryRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../config/swagger');
const config = require('../../config/config');

const router = express.Router();

// API Documentation
if (config.features.enableSwagger) {
  router.use('/docs', swaggerUi.serve);
  router.get('/docs', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Tags API Documentation'
  }));
  
  // Swagger JSON endpoint
  router.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// API Routes
router.use('/tags', tagRoutes);
router.use('/categories', categoryRoutes);

// API Info
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Tags API v1',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    endpoints: {
      tags: '/api/v1/tags',
      categories: '/api/v1/categories'
    }
  });
});

module.exports = router;
