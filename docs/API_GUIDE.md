# Tags API Usage Guide

This comprehensive guide provides detailed information on how to use the Tags API effectively, including authentication, request examples, filtering options, and best practices.

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.tagsapi.com/v1
```

## Authentication

The Tags API supports two authentication methods:

### 1. JWT Bearer Token

Include the JWT token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. API Key

Include your API key in the request header:

```http
X-API-Key: YOUR_API_KEY
```

**Note**: Most read operations are public and do not require authentication. Write operations (POST, PATCH, DELETE) require authentication and appropriate permissions.

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Default Limit**: 1000 requests per 15 minutes per IP address
- **API Key Tiers**:
  - Free: 100 requests/hour, 1,000 requests/day
  - Basic: 1,000 requests/hour, 10,000 requests/day
  - Pro: 5,000 requests/hour, 100,000 requests/day
  - Enterprise: 50,000 requests/hour, 1,000,000 requests/day

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when the limit resets

## Endpoints

### Tags

#### Get All Tags

Retrieve a paginated list of tags with advanced filtering and sorting options.

**Endpoint**: `GET /tags`

**Query Parameters**:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (default: 1) | `page=2` |
| `limit` | integer | Items per page (default: 20, max: 100) | `limit=50` |
| `sort` | string | Sort field(s), prefix with `-` for descending | `sort=-usageCount` |
| `fields` | string | Comma-separated fields to include | `fields=name,slug,category` |
| `search` | string | Full-text search query | `search=New York` |
| `category` | string | Filter by category slug | `category=geography-timing` |
| `subcategory` | string | Filter by subcategory slug | `subcategory=location` |
| `type` | string | Filter by type (standard, custom, system) | `type=standard` |
| `isActive` | boolean | Filter by active status | `isActive=true` |
| `isPublic` | boolean | Filter by public visibility | `isPublic=true` |
| `isFeatured` | boolean | Filter by featured status | `isFeatured=true` |
| `minUsage` | integer | Minimum usage count | `minUsage=10` |
| `maxUsage` | integer | Maximum usage count | `maxUsage=1000` |

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/tags?category=geography-timing&sort=-usageCount&limit=10"
```

**Example Response**:

```json
{
  "status": "success",
  "results": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "data": {
    "tags": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "New York",
        "slug": "new-york",
        "description": "Geographic location in USA",
        "category": "geography-timing",
        "subcategory": "location",
        "type": "standard",
        "usageCount": 1250,
        "metadata": {
          "color": "#3B82F6",
          "priority": 80
        },
        "isActive": true,
        "isPublic": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T14:45:00.000Z"
      }
    ]
  }
}
```

#### Get Tag by Slug

Retrieve detailed information about a specific tag.

**Endpoint**: `GET /tags/{slug}`

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/tags/new-york"
```

#### Search Tags

Search for tags with autocomplete functionality.

**Endpoint**: `GET /tags/search`

**Query Parameters**:
- `q` (required): Search query
- `limit` (optional): Maximum results (default: 10)

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/tags/search?q=python&limit=5"
```

#### Get Popular Tags

Retrieve the most frequently used tags.

**Endpoint**: `GET /tags/popular`

**Query Parameters**:
- `limit` (optional): Number of tags to return (default: 10)

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/tags/popular?limit=20"
```

#### Get Tags by Category

Retrieve all tags within a specific category.

**Endpoint**: `GET /tags/category/{category}`

**Query Parameters**:
- `limit` (optional): Maximum results (default: 50)
- `sort` (optional): Sort order (default: -usageCount)

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/tags/category/skills-tools?limit=30"
```

#### Create Tag

Create a new tag (requires authentication and admin role).

**Endpoint**: `POST /tags`

**Request Body**:

```json
{
  "name": "React.js",
  "description": "JavaScript library for building user interfaces",
  "category": "skills-tools",
  "subcategory": "software-tools",
  "type": "standard",
  "metadata": {
    "color": "#61DAFB",
    "priority": 85
  },
  "aliases": ["React", "ReactJS"],
  "searchKeywords": ["react", "javascript", "frontend"],
  "isPublic": true,
  "isActive": true
}
```

**Example Request**:

```bash
curl -X POST "http://localhost:3000/api/v1/tags" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React.js",
    "category": "skills-tools",
    "subcategory": "software-tools"
  }'
```

#### Update Tag

Update an existing tag (requires authentication and admin role).

**Endpoint**: `PATCH /tags/{slug}`

**Example Request**:

```bash
curl -X PATCH "http://localhost:3000/api/v1/tags/react-js" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "metadata": {
      "priority": 90
    }
  }'
```

#### Delete Tag

Soft delete a tag (requires authentication and admin role).

**Endpoint**: `DELETE /tags/{slug}`

**Example Request**:

```bash
curl -X DELETE "http://localhost:3000/api/v1/tags/react-js" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Categories

#### Get All Categories

Retrieve all available categories.

**Endpoint**: `GET /categories`

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/categories"
```

#### Get Category by Slug

Retrieve detailed information about a specific category.

**Endpoint**: `GET /categories/{slug}`

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/categories/geography-timing"
```

#### Get Subcategories

Retrieve all subcategories within a category.

**Endpoint**: `GET /categories/{slug}/subcategories`

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/v1/categories/geography-timing/subcategories"
```

## Advanced Filtering Examples

### Multiple Filters

Combine multiple filters to narrow down results:

```bash
curl -X GET "http://localhost:3000/api/v1/tags?category=skills-tools&type=standard&minUsage=50&sort=-usageCount"
```

### Field Selection

Request only specific fields to reduce payload size:

```bash
curl -X GET "http://localhost:3000/api/v1/tags?fields=name,slug,usageCount&limit=100"
```

### Full-Text Search with Filters

Combine search with category filtering:

```bash
curl -X GET "http://localhost:3000/api/v1/tags?search=programming&category=skills-tools"
```

## Pagination Best Practices

When working with large datasets, use pagination effectively:

1. Start with a reasonable page size (20-50 items)
2. Use the `pagination` object in the response to navigate
3. Implement cursor-based pagination for real-time data

**Example Pagination Flow**:

```javascript
// First page
GET /tags?page=1&limit=20

// Next page
GET /tags?page=2&limit=20

// Check pagination.pages to know total pages
```

## Caching

The API implements intelligent caching to improve performance:

- Responses include an `X-Cache` header indicating cache status (HIT/MISS)
- Cache is automatically invalidated when data is modified
- Different cache TTLs for different resource types

## Error Handling

The API uses standard HTTP status codes and returns consistent error responses:

**Error Response Format**:

```json
{
  "status": "error",
  "message": "Detailed error message"
}
```

**Common Status Codes**:
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Best Practices

1. **Use Caching**: Leverage the built-in caching by making GET requests when possible
2. **Implement Pagination**: Always use pagination for large datasets
3. **Filter Wisely**: Use specific filters to reduce response size and improve performance
4. **Handle Rate Limits**: Implement exponential backoff when rate limits are hit
5. **Use Field Selection**: Request only the fields you need
6. **Monitor Usage**: Track your API usage to stay within rate limits
7. **Secure API Keys**: Never expose API keys in client-side code

## SDKs and Libraries

While we don't currently provide official SDKs, the API is compatible with standard HTTP clients:

- **JavaScript/Node.js**: axios, fetch, node-fetch
- **Python**: requests, httpx
- **PHP**: Guzzle, cURL
- **Ruby**: HTTParty, Faraday
- **Java**: OkHttp, Apache HttpClient

## Support

For questions, issues, or feature requests:
- Email: support@tagsapi.com
- Documentation: https://docs.tagsapi.com
- GitHub Issues: https://github.com/your-repo/tags-api/issues
