# Quick Start Guide

Get the Tags API up and running in minutes with this step-by-step guide.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/)) - Recommended
- **Git** ([Download](https://git-scm.com/))

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-repo/tags-api.git
cd tags-api
```

### Step 2: Choose Your Setup Method

#### Option A: Docker (Recommended - Easiest)

This method sets up everything automatically including MongoDB and Redis.

```bash
# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f api
```

The API will be available at **http://localhost:3000**

#### Option B: Local Development

If you prefer to run without Docker, you'll need MongoDB and Redis installed locally.

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start MongoDB (in a separate terminal)
mongod

# Start Redis (in a separate terminal)
redis-server

# Start the API
npm run dev
```

## Verify Installation

Once the API is running, verify it's working:

```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "success",
#   "message": "API is running",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "uptime": 123.456,
#   "environment": "development"
# }
```

## Seed the Database

Populate the database with initial categories and tags:

```bash
# If using Docker
docker-compose exec api npm run seed

# If running locally
npm run seed
```

This will create:
- 8 main categories
- Multiple subcategories
- Sample tags based on the provided taxonomy

## Access the API Documentation

Open your browser and navigate to:

**http://localhost:3000/api/v1/docs**

You'll see an interactive Swagger UI where you can:
- Explore all available endpoints
- Test API calls directly from the browser
- View request/response schemas
- See example requests and responses

## Try Your First API Call

### Get All Tags

```bash
curl http://localhost:3000/api/v1/tags
```

### Search for Tags

```bash
curl "http://localhost:3000/api/v1/tags/search?q=python"
```

### Get Tags by Category

```bash
curl http://localhost:3000/api/v1/tags/category/skills-tools
```

### Get Popular Tags

```bash
curl http://localhost:3000/api/v1/tags/popular?limit=10
```

### Get All Categories

```bash
curl http://localhost:3000/api/v1/categories
```

## Using with JavaScript

Here's a quick example using JavaScript:

```javascript
// Using fetch
const response = await fetch('http://localhost:3000/api/v1/tags?limit=10');
const data = await response.json();
console.log(data);

// Using axios
const axios = require('axios');
const { data } = await axios.get('http://localhost:3000/api/v1/tags', {
  params: {
    category: 'skills-tools',
    limit: 20,
    sort: '-usageCount'
  }
});
console.log(data);
```

## Using with Python

```python
import requests

# Get tags
response = requests.get('http://localhost:3000/api/v1/tags', params={
    'category': 'skills-tools',
    'limit': 20
})
data = response.json()
print(data)

# Search tags
response = requests.get('http://localhost:3000/api/v1/tags/search', params={
    'q': 'python',
    'limit': 5
})
results = response.json()
print(results)
```

## Common Commands

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart API
docker-compose restart api

# Execute commands in container
docker-compose exec api npm run seed
```

### Development Commands

```bash
# Start in development mode (with auto-reload)
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Seed database
npm run seed
```

### PM2 Commands (Production)

```bash
# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Monitor
pm2 monit

# Restart
pm2 restart tags-api

# Stop
pm2 stop tags-api
```

## Environment Variables

The `.env` file contains all configuration. Key variables:

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/tags-api

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret (change in production!)
JWT_SECRET=your-secret-key
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:

```bash
PORT=3001
```

### MongoDB Connection Error

Ensure MongoDB is running:

```bash
# Check if MongoDB is running
docker-compose ps mongo

# Or if running locally
ps aux | grep mongod
```

### Redis Connection Error

Ensure Redis is running:

```bash
# Check if Redis is running
docker-compose ps redis

# Or if running locally
redis-cli ping
# Should return: PONG
```

### Permission Denied (Docker)

On Linux, you may need to run Docker commands with sudo or add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# Then log out and back in
```

## Next Steps

Now that you have the API running:

1. **Explore the Documentation**: Visit http://localhost:3000/api/v1/docs
2. **Read the API Guide**: Check `docs/API_GUIDE.md` for detailed usage
3. **Review Architecture**: See `docs/ARCHITECTURE.md` for system design
4. **Plan Deployment**: Read `docs/DEPLOYMENT.md` for production setup
5. **Contribute**: Check `CONTRIBUTING.md` if you want to contribute

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Issues**: Report bugs on GitHub Issues
- **Email**: support@tagsapi.com

## Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/docs` | GET | API documentation |
| `/api/v1/tags` | GET | Get all tags |
| `/api/v1/tags/search` | GET | Search tags |
| `/api/v1/tags/popular` | GET | Get popular tags |
| `/api/v1/tags/:slug` | GET | Get tag by slug |
| `/api/v1/categories` | GET | Get all categories |
| `/api/v1/categories/:slug` | GET | Get category by slug |

## Default Credentials

The API uses API keys for authentication. To create an admin user and generate API keys, you'll need to implement the authentication endpoints or use the User model directly.

For development, most GET endpoints are public and don't require authentication.

---

**Congratulations!** 🎉 You now have a fully functional Tags API running locally. Happy coding!
