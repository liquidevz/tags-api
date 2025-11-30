# Tags API Architecture

## Overview

The Tags API is a production-ready RESTful API built with a focus on scalability, performance, and maintainability. This document provides a comprehensive overview of the system architecture, design decisions, and technical implementation details.

## System Architecture

The Tags API follows a layered architecture pattern, separating concerns into distinct layers to ensure modularity, testability, and scalability.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  (Web Apps, Mobile Apps, Third-party Integrations)      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Load Balancer (Nginx)                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              API Gateway / Rate Limiter                  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Express Application                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Middleware  │  │   Routes     │  │ Controllers  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Validators  │  │   Services   │  │    Models    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────────┐        ┌──────────────────┐       │
│  │   MongoDB        │        │      Redis       │       │
│  │  (Primary DB)    │        │  (Cache Layer)   │       │
│  └──────────────────┘        └──────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Application Layer

**Entry Point**: `src/server.js`

The server initialization file handles the application startup, database connections, and graceful shutdown procedures. It implements error handling for uncaught exceptions and unhandled promise rejections.

**Application Configuration**: `src/app.js`

The main Express application configuration file that sets up middleware, security features, routing, and error handling.

### 2. Routing Layer

**Location**: `src/routes/`

The routing layer defines all API endpoints and maps them to their corresponding controller functions. Routes are organized by version (v1) and resource type (tags, categories).

**Key Features**:
- RESTful endpoint design using resource slugs
- Middleware integration for authentication, validation, and caching
- Clear separation of public and protected routes

### 3. Controller Layer

**Location**: `src/controllers/`

Controllers handle HTTP request/response logic, orchestrate business logic through services, and implement caching strategies for optimal performance.

**Responsibilities**:
- Request parsing and validation
- Cache management (Redis)
- Response formatting
- Error handling

### 4. Model Layer

**Location**: `src/models/`

Models define the data structure, validation rules, and database interactions using Mongoose ODM. Each model includes comprehensive schema definitions with indexes optimized for query performance.

**Key Models**:
- **Tag**: Core entity for tag management with full-text search support
- **Category**: Hierarchical category structure with subcategories
- **User**: User management with API key support for monetization

### 5. Middleware Layer

**Location**: `src/middlewares/`

Middleware functions handle cross-cutting concerns such as authentication, authorization, rate limiting, caching, and error handling.

**Key Middleware**:
- **Authentication**: JWT and API key validation
- **Rate Limiting**: Distributed rate limiting using Redis
- **Caching**: Response caching for GET requests
- **Error Handling**: Centralized error processing
- **Request Logging**: Structured logging of all requests

### 6. Validation Layer

**Location**: `src/validators/`

Input validation using express-validator to ensure data integrity and security before processing requests.

## Database Design

### MongoDB Schema

The database uses MongoDB with Mongoose for flexible, scalable data storage. The schema is designed with performance in mind, featuring strategic indexes and efficient query patterns.

**Tag Schema**:
```javascript
{
  name: String (indexed, text search),
  slug: String (unique, indexed),
  category: String (indexed),
  subcategory: String (indexed),
  usageCount: Number (indexed),
  metadata: {
    color: String,
    priority: Number,
    weight: Number
  },
  // ... additional fields
}
```

**Indexes**:
- Text index on name, description, and searchKeywords for full-text search
- Compound indexes on category + subcategory for efficient filtering
- Single field indexes on frequently queried fields (isActive, usageCount)

### Caching Strategy

**Redis Cache Layer**:

The API implements a multi-level caching strategy to minimize database load and improve response times:

1. **Query Result Caching**: Frequently accessed queries are cached with appropriate TTL values
2. **Distributed Rate Limiting**: Redis-based rate limiting for scalability across multiple instances
3. **Cache Invalidation**: Automatic cache invalidation on data mutations

**Cache TTL Configuration**:
- Tags: 30 minutes
- Categories: 1 hour
- Search results: 10 minutes

## Scalability Features

### Horizontal Scaling

The API is designed to scale horizontally using PM2 cluster mode or container orchestration:

- **Stateless Design**: No server-side session storage
- **Distributed Caching**: Redis for shared cache across instances
- **Database Connection Pooling**: Optimized connection management

### Performance Optimizations

1. **Database Query Optimization**:
   - Strategic indexing
   - Query result projection
   - Pagination for large datasets

2. **Caching Strategy**:
   - Redis-based response caching
   - Cache-aside pattern
   - Intelligent cache invalidation

3. **Rate Limiting**:
   - Distributed rate limiting using Redis
   - Per-user and per-IP limits
   - Configurable limits based on subscription tier

## Security Features

### Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication
- **API Key Management**: Support for API keys with usage tracking
- **Role-based Access Control**: User, Admin, and SuperAdmin roles

### Security Middleware

- **Helmet**: HTTP security headers
- **CORS**: Configurable cross-origin resource sharing
- **XSS Protection**: Input sanitization
- **NoSQL Injection Prevention**: MongoDB query sanitization
- **Parameter Pollution Prevention**: HPP middleware

## Monitoring & Logging

### Structured Logging

Winston-based logging system with multiple transports:
- Console output for development
- File-based logging for production
- Separate error logs
- Request/response logging

### Health Checks

- `/health` endpoint for monitoring
- Database connection status
- Redis connection status
- Uptime and environment information

## Deployment Architecture

### Docker Deployment

The application is fully containerized with Docker and Docker Compose, including:
- API service
- MongoDB database
- Redis cache
- Nginx load balancer

### Process Management

PM2 configuration for production deployment:
- Cluster mode for multi-core utilization
- Automatic restarts on failures
- Memory limit management
- Zero-downtime deployments

## API Versioning

The API uses URL-based versioning (`/api/v1/`) to ensure backward compatibility and smooth transitions between versions.

## Future Enhancements

1. **GraphQL Support**: Add GraphQL endpoint alongside REST API
2. **Real-time Updates**: WebSocket support for live tag updates
3. **Advanced Analytics**: Usage analytics and reporting dashboard
4. **Multi-tenancy**: Support for multiple organizations
5. **Machine Learning**: Tag recommendation and auto-categorization

## Conclusion

The Tags API architecture is designed with production readiness, scalability, and maintainability as core principles. The layered architecture, comprehensive caching strategy, and security features ensure that the API can handle millions of requests while maintaining high performance and reliability.
