# Tags API - File Manifest

This document provides a comprehensive overview of all files in the project and their purposes.

## Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Node.js project configuration, dependencies, and scripts |
| `.env` | Environment variables for local development |
| `.env.example` | Template for environment variables |
| `.gitignore` | Git ignore patterns |
| `.dockerignore` | Docker ignore patterns |
| `Dockerfile` | Docker container configuration |
| `docker-compose.yml` | Multi-container Docker application setup |
| `ecosystem.config.js` | PM2 process manager configuration |
| `nginx.conf` | Nginx reverse proxy configuration |
| `.eslintrc.js` | ESLint code linting rules |
| `.prettierrc` | Prettier code formatting rules |
| `jest.config.js` | Jest testing framework configuration |
| `LICENSE` | MIT License file |

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation and overview |
| `QUICK_START.md` | Quick start guide for getting up and running |
| `PROJECT_SUMMARY.md` | Comprehensive project summary |
| `PROJECT_STRUCTURE.txt` | Directory tree structure |
| `FILE_MANIFEST.md` | This file - complete file listing |
| `CONTRIBUTING.md` | Contribution guidelines |
| `CODE_OF_CONDUCT.md` | Community code of conduct |
| `docs/ARCHITECTURE.md` | System architecture documentation |
| `docs/API_GUIDE.md` | Detailed API usage guide |
| `docs/DEPLOYMENT.md` | Production deployment guide |

## Source Code - Core Application

| File | Purpose |
|------|---------|
| `src/server.js` | Application entry point and server initialization |
| `src/app.js` | Express application configuration and middleware setup |

## Source Code - Configuration

| File | Purpose |
|------|---------|
| `src/config/config.js` | Centralized application configuration |
| `src/config/database.js` | MongoDB connection configuration |
| `src/config/redis.js` | Redis connection configuration |
| `src/config/swagger.js` | Swagger/OpenAPI documentation configuration |

## Source Code - Models

| File | Purpose |
|------|---------|
| `src/models/Tag.js` | Tag model schema and methods |
| `src/models/Category.js` | Category model schema and methods |
| `src/models/User.js` | User model with API key management |

## Source Code - Controllers

| File | Purpose |
|------|---------|
| `src/controllers/tagController.js` | Tag CRUD operations and business logic |
| `src/controllers/categoryController.js` | Category CRUD operations and business logic |

## Source Code - Routes

| File | Purpose |
|------|---------|
| `src/routes/v1/index.js` | API v1 main router |
| `src/routes/v1/tagRoutes.js` | Tag endpoints routing |
| `src/routes/v1/categoryRoutes.js` | Category endpoints routing |

## Source Code - Middlewares

| File | Purpose |
|------|---------|
| `src/middlewares/auth.js` | Authentication and authorization middleware |
| `src/middlewares/cache.js` | Response caching middleware |
| `src/middlewares/rateLimiter.js` | Rate limiting middleware |
| `src/middlewares/errorHandler.js` | Global error handling middleware |
| `src/middlewares/notFound.js` | 404 not found handler |
| `src/middlewares/requestLogger.js` | Request/response logging middleware |

## Source Code - Validators

| File | Purpose |
|------|---------|
| `src/validators/tagValidator.js` | Tag input validation rules |
| `src/validators/categoryValidator.js` | Category input validation rules |

## Source Code - Utilities

| File | Purpose |
|------|---------|
| `src/utils/logger.js` | Winston logger configuration |
| `src/utils/catchAsync.js` | Async error handling wrapper |
| `src/utils/appError.js` | Custom error class |

## Source Code - Database

| File | Purpose |
|------|---------|
| `src/database/seeds/seed.js` | Database seeding script |

## Test Files

| File | Purpose |
|------|---------|
| `tests/unit/models/tag.test.js` | Unit tests for Tag model |

## CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | GitHub Actions CI/CD pipeline |

## Directory Structure

```
tags-api/
├── .github/              # GitHub configuration
│   └── workflows/        # CI/CD workflows
├── docs/                 # Documentation
├── logs/                 # Application logs (generated)
├── scripts/              # Utility scripts
├── src/                  # Source code
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── database/        # Database scripts
│   │   ├── migrations/  # Database migrations
│   │   └── seeds/       # Database seeders
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   │   └── v1/         # Version 1 routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── validators/      # Input validators
└── tests/               # Test files
    ├── e2e/            # End-to-end tests
    ├── integration/    # Integration tests
    └── unit/           # Unit tests

Total Files: 49
Total Lines of Code: ~2,800
```

## File Categories Summary

- **Configuration**: 13 files
- **Documentation**: 10 files
- **Source Code**: 24 files
- **Tests**: 1 file (template)
- **CI/CD**: 1 file

## Key Features by File

### Scalability
- `src/config/redis.js` - Distributed caching
- `ecosystem.config.js` - Cluster mode configuration
- `src/middlewares/rateLimiter.js` - Distributed rate limiting

### Security
- `src/middlewares/auth.js` - JWT and API key authentication
- `src/models/User.js` - User and API key management
- `src/app.js` - Security middleware (Helmet, CORS, XSS protection)

### Performance
- `src/middlewares/cache.js` - Response caching
- `src/models/Tag.js` - Optimized database indexes
- `nginx.conf` - Load balancing and reverse proxy

### Developer Experience
- `src/config/swagger.js` - Interactive API documentation
- `QUICK_START.md` - Easy onboarding
- `docs/API_GUIDE.md` - Comprehensive usage guide

### Production Ready
- `Dockerfile` - Containerization
- `docker-compose.yml` - Complete stack orchestration
- `docs/DEPLOYMENT.md` - Deployment procedures
- `.github/workflows/ci.yml` - Automated testing and deployment

---

Last Updated: 2024
