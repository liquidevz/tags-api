# Tags API

[![Build Status](https://github.com/your-repo/tags-api/actions/workflows/ci.yml/badge.svg)](https://github.com/your-repo/tags-api/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/your-repo/tags-api/badge.svg?branch=main)](https://coveralls.io/github/your-repo/tags-api?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready, scalable, and feature-rich RESTful API for managing tags and categories. Built with Node.js, Express, and MongoDB, this API is designed for high performance and heavy loads, featuring advanced filtering, full-text search, caching, rate limiting, and a monetization-ready architecture with API key management.

## Features

- **Comprehensive Tag Management**: Full CRUD operations for tags and categories.
- **Advanced Filtering & Sorting**: Filter tags by any field, including category, subcategory, usage count, and more. Sort results based on multiple criteria.
- **Full-Text Search**: Powerful and fast search across tag names, descriptions, and aliases.
- **Scalable Architecture**: Built with performance in mind, using clustering, caching, and optimized database queries to handle millions of requests.
- **Robust Caching**: Implements a Redis-based caching layer for frequently accessed data to reduce database load and improve response times.
- **Rate Limiting**: Distributed rate limiting to protect the API from abuse and ensure fair usage.
- **Monetization Ready**: Built-in support for API key management, user roles, and subscription tiers.
- **Detailed Documentation**: Automatically generated and interactive API documentation using Swagger/OpenAPI.
- **Production-Ready**: Includes Docker support, PM2 configuration for process management, structured logging, and a complete CI/CD pipeline setup.
- **Secure**: Implements security best practices including Helmet, CORS, data sanitization (XSS, NoSQL injection), and parameter pollution prevention.

## API Documentation

Once the server is running, you can access the interactive Swagger API documentation at:

`http://localhost:3000/api/v1/docs`

The OpenAPI 3.0 specification is also available in JSON format at:

`http://localhost:3000/api/v1/docs.json`

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Caching**: Redis (with ioredis)
- **Process Management**: PM2
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest, Supertest
- **Linting & Formatting**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose (recommended)
- MongoDB and Redis instances (if not using Docker)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/tags-api.git
    cd tags-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Copy the example environment file and update it with your configuration.

    ```bash
    cp .env.example .env
    ```

    Update `MONGODB_URI`, `REDIS_HOST`, `JWT_SECRET`, etc. in the `.env` file.

### Running the Application

#### Using Docker (Recommended)

This is the easiest way to get the entire stack (API, database, cache) up and running.

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`.

To stop the services:

```bash
docker-compose down
```

#### Using Node.js (Development)

Make sure you have MongoDB and Redis servers running.

```bash
npm run dev
```

This will start the server with `nodemon`, which automatically restarts on file changes.

#### Using PM2 (Production)

For production deployments, it is recommended to use PM2 for process management and clustering.

```bash
npm start
# or
pm2 start ecosystem.config.js
```

## API Endpoints

Here are some of the main endpoints. For a full list and details, please refer to the [Swagger documentation](#api-documentation).

### Tags

- `GET /api/v1/tags`: Get all tags with advanced filtering.
- `GET /api/v1/tags/popular`: Get a list of popular tags.
- `GET /api/v1/tags/search?q={query}`: Search for tags.
- `GET /api/v1/tags/{slug}`: Get a single tag by its slug.
- `POST /api/v1/tags`: Create a new tag (Admin only).
- `PATCH /api/v1/tags/{slug}`: Update a tag (Admin only).
- `DELETE /api/v1/tags/{slug}`: Delete a tag (Admin only).

### Categories

- `GET /api/v1/categories`: Get all categories.
- `GET /api/v1/categories/{slug}`: Get a single category by its slug.
- `POST /api/v1/categories`: Create a new category (Admin only).

## Testing

The project uses Jest for testing. Tests are organized into `unit`, `integration`, and `e2e`.

- **Run all tests:**

  ```bash
  npm test
  ```

- **Run unit tests:**

  ```bash
  npm run test:unit
  ```

- **Run integration tests:**

  ```bash
  npm run test:integration
  ```

## Database Seeding

To populate the database with initial data (categories and tags from the provided text file), run the seed script:

```bash
npm run seed
```

This script is safe to run multiple times. It will only add data that doesn't already exist.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
