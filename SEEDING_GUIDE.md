# Database Seeding Guide

This guide explains how to seed the Tags API database with tag data.

## Available Seeding Scripts

### 1. Basic Seed (`npm run seed`)
- **Tags**: ~1,000 tags
- **Time**: ~5 seconds
- **Use case**: Quick testing and development
- **File**: `src/database/seeds/seed.js`

### 2. Large Seed (`npm run seed:large`)
- **Tags**: ~100,000 tags
- **Time**: ~2-5 minutes
- **Use case**: Performance testing, realistic dataset
- **File**: `src/database/seeds/seed-large.js`

### 3. Massive Seed (`npm run seed:10m`)
- **Tags**: 10,000,000 tags (10 million)
- **Time**: ~30-60 minutes (depends on hardware)
- **Use case**: Production-scale testing, stress testing
- **File**: `src/database/seeds/seed-10m.js`
- **Requirements**: 
  - At least 8GB RAM
  - 10GB+ free disk space
  - MongoDB with sufficient storage

## Quick Start

### Using Docker

```bash
# Start services
docker compose -f docker-compose.simple.yml up -d

# Wait for services to be ready
sleep 10

# Run basic seed
docker compose -f docker-compose.simple.yml exec api npm run seed

# OR run large seed (100K tags)
docker compose -f docker-compose.simple.yml exec api npm run seed:large

# OR run massive seed (10M tags) - WARNING: Takes 30-60 minutes!
docker compose -f docker-compose.simple.yml exec api npm run seed:10m
```

### Local Development

```bash
# Make sure MongoDB and Redis are running
# Then run one of:

npm run seed          # 1K tags
npm run seed:large    # 100K tags
npm run seed:10m      # 10M tags
```

## What Gets Seeded

### Categories (8 total)
1. **Geography & Timing** - Location, venue, timeframe, schedule, timezone, season
2. **People & Roles** - Audience, stakeholder, team, expertise, profession, language
3. **Skills & Tools** - Tech stack, languages, frameworks, databases, cloud platforms
4. **Domain & Category** - Industry, topic, solutions, products, services
5. **Content & Format** - Media types, file formats, styles, accessibility
6. **Intent & Objectives** - Actions, budget, timeline, resources
7. **Constraints & Compliance** - Regulatory, security, delivery, risk, ethics
8. **Status & Meta** - Status, visibility, version, review, metrics

### Tag Types

#### 10 Million Seed Includes:

**1. Location Tags** (~3,600 tags)
- City + Country combinations
- Examples: "New York, USA", "London, UK", "Tokyo, Japan"

**2. Technology Stack Tags** (~50,000 tags)
- Language + Framework + Database combinations
- Examples: "JavaScript + React + MongoDB", "Python + Django + PostgreSQL"

**3. Industry-Topic Tags** (~250,000 tags)
- Adjective + Topic + Industry combinations
- Examples: "Scalable Machine Learning for Healthcare", "Secure Cloud Computing for Finance"

**4. Action-Based Tags** (~100,000 tags)
- Action + Technology + Suffix combinations
- Examples: "Build Python Application", "Deploy React Platform", "Optimize Node.js Service"

**5. Comprehensive Solution Tags** (~5,000,000 tags)
- Prefix + Topic + Suffix + Industry combinations
- Examples: "Enterprise Machine Learning Solution for Healthcare"
- Examples: "Startup-friendly Web Development Platform for E-commerce"

**6. Numbered Identifiers** (~4,600,000 tags)
- Sequential tags to reach 10 million
- Examples: "Tag-1", "Resource-1000", "Component-50000"

## Tag Structure

Each tag includes:
```json
{
  "name": "JavaScript + React + MongoDB",
  "slug": "javascript-react-mongodb",
  "category": "skills-tools",
  "subcategory": "tech-stack",
  "type": "combination",
  "description": "JavaScript + React + MongoDB technology stack",
  "usageCount": 1234,
  "aliases": [],
  "metadata": {},
  "isActive": true,
  "createdAt": "2025-11-30T...",
  "updatedAt": "2025-11-30T..."
}
```

## Performance Considerations

### 10 Million Tags Seeding

**Expected Performance:**
- **Insertion Rate**: ~3,000-5,000 tags/second
- **Total Time**: 30-60 minutes
- **Memory Usage**: ~2-4GB during seeding
- **Disk Space**: ~5-10GB for database storage

**Optimization Tips:**
1. Ensure MongoDB has enough RAM allocated
2. Use SSD storage for better I/O performance
3. Disable MongoDB journaling temporarily (development only)
4. Increase batch size if you have more RAM
5. Run on a dedicated database server for best performance

### MongoDB Configuration for Large Datasets

```javascript
// In docker-compose.simple.yml or MongoDB config
mongo:
  command: mongod --wiredTigerCacheSizeGB 4 --nojournal
```

## Monitoring Progress

The seeding script provides real-time progress updates:

```
[INFO]: Starting to generate 10,000,000 tags...
[INFO]: Generating location tags...
[INFO]: Generating technology stack tags...
[INFO]: Batch 1: Inserted 5,000/10,000,000 tags (0.05%) - 4,500 tags/sec
[INFO]: Batch 2: Inserted 10,000/10,000,000 tags (0.10%) - 4,800 tags/sec
...
[INFO]: ✅ Successfully seeded database in 1,234.56s
[INFO]: 📊 Total tags: 10,000,000
[INFO]: ⚡ Average rate: 8,100 tags/second
```

## Verification

After seeding, verify the data:

```bash
# Check total tag count
curl http://localhost:3000/api/v1/tags?limit=1

# Search for specific tags
curl http://localhost:3000/api/v1/tags/search?q=javascript

# Get tags by category
curl http://localhost:3000/api/v1/tags?category=skills-tools&limit=10

# View popular tags
curl http://localhost:3000/api/v1/tags/popular?limit=20
```

## Troubleshooting

### Out of Memory Error

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=8192" npm run seed:10m
```

### MongoDB Connection Timeout

```bash
# Increase connection timeout in .env
MONGODB_CONNECT_TIMEOUT=60000
```

### Slow Insertion Speed

1. Check MongoDB indexes are created
2. Ensure sufficient RAM for MongoDB
3. Use SSD storage
4. Reduce batch size if memory constrained

### Database Full

```bash
# Check disk space
df -h

# Clear old data
docker compose -f docker-compose.simple.yml exec mongo mongosh
> use tags-api
> db.tags.deleteMany({})
```

## Re-seeding

To clear and re-seed:

```bash
# The seed scripts automatically clear existing data
# Just run the seed command again
npm run seed:10m
```

## API Performance with 10M Tags

With proper indexing, the API maintains excellent performance:

- **Search queries**: <100ms
- **Filtered queries**: <50ms
- **Popular tags**: <20ms (cached)
- **Single tag lookup**: <10ms

## Production Recommendations

1. **Start with seed:large** (100K tags) for initial launch
2. **Monitor performance** and user behavior
3. **Scale to 10M** only if needed for your use case
4. **Use Redis caching** to handle high traffic
5. **Implement pagination** for all list endpoints
6. **Add database replicas** for read scaling

---

**Note**: The 10 million seed is designed for stress testing and demonstrating scalability. Most production applications will work perfectly with 100K-1M tags.
