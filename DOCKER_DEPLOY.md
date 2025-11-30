# Docker Deployment Guide

## Quick Start with Docker

This guide shows you how to deploy the Tags API using Docker.

### Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

### Method 1: Using Docker Compose (Recommended)

This will start MongoDB, Redis, and the API all together.

```bash
# Navigate to project directory
cd tags-api

# Start all services
docker compose -f docker-compose.simple.yml up -d

# Check if services are running
docker compose -f docker-compose.simple.yml ps

# View logs
docker compose -f docker-compose.simple.yml logs -f api

# Seed the database
docker compose -f docker-compose.simple.yml exec api npm run seed
```

The API will be available at: **http://localhost:3000**

Swagger documentation at: **http://localhost:3000/api/v1/docs**

### Method 2: Build and Run Manually

```bash
# Build the Docker image
docker build -t tags-api:latest .

# Run MongoDB
docker run -d --name tags-mongo -p 27017:27017 mongo:7

# Run Redis
docker run -d --name tags-redis -p 6379:6379 redis:7-alpine

# Run the API
docker run -d --name tags-api -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/tags-api \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  -e NODE_ENV=production \
  -e ENABLE_SWAGGER=true \
  tags-api:latest
```

### Verify Deployment

```bash
# Check health
curl http://localhost:3000/health

# View Swagger docs
open http://localhost:3000/api/v1/docs

# Test API
curl http://localhost:3000/api/v1/tags
```

### Stop Services

```bash
# Using Docker Compose
docker compose -f docker-compose.simple.yml down

# Or stop individual containers
docker stop tags-api tags-mongo tags-redis
docker rm tags-api tags-mongo tags-redis
```

### Environment Variables

You can customize the deployment by setting environment variables in `docker-compose.simple.yml`:

- `NODE_ENV` - Environment (development/production)
- `PORT` - API port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `JWT_SECRET` - JWT secret key
- `ENABLE_SWAGGER` - Enable Swagger docs (true/false)

### Troubleshooting

**API not starting:**
```bash
docker compose -f docker-compose.simple.yml logs api
```

**Database connection issues:**
```bash
docker compose -f docker-compose.simple.yml logs mongo
```

**Redis connection issues:**
```bash
docker compose -f docker-compose.simple.yml logs redis
```

### Production Deployment

For production, update the following in `docker-compose.simple.yml`:

1. Change `JWT_SECRET` to a strong random value
2. Add MongoDB authentication
3. Add Redis password
4. Use environment-specific configuration
5. Set up proper logging and monitoring
6. Configure backup strategies

### Swagger Documentation

Once deployed, access the interactive API documentation at:

**http://localhost:3000/api/v1/docs**

Features:
- Interactive API testing
- Complete endpoint documentation
- Request/response schemas
- Authentication examples
- Try out API calls directly from the browser

### API Endpoints

- `GET /health` - Health check
- `GET /api/v1/docs` - Swagger documentation
- `GET /api/v1/tags` - Get all tags
- `GET /api/v1/tags/search` - Search tags
- `GET /api/v1/tags/popular` - Get popular tags
- `GET /api/v1/categories` - Get all categories

For complete API documentation, see the Swagger UI or `docs/API_GUIDE.md`.
