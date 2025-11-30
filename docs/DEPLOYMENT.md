# Deployment Guide

This guide provides comprehensive instructions for deploying the Tags API to various production environments.

## Prerequisites

Before deploying, ensure you have:

- Node.js >= 18.0.0
- MongoDB database (local or cloud-hosted like MongoDB Atlas)
- Redis instance (local or cloud-hosted like Redis Cloud)
- Domain name (for production)
- SSL certificate (for HTTPS)

## Environment Configuration

Create a `.env` file based on `.env.example` with production values:

```bash
NODE_ENV=production
PORT=3000

# Database - Use MongoDB Atlas or your own MongoDB server
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tags-api?retryWrites=true&w=majority

# Redis - Use Redis Cloud or your own Redis server
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT - Generate strong secrets
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_MAX=1000

# CORS - Specify allowed origins
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com

# Logging
LOG_LEVEL=info
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

Docker provides the easiest and most consistent deployment experience.

#### Step 1: Build the Docker Image

```bash
docker build -t tags-api:latest .
```

#### Step 2: Run with Docker Compose

```bash
docker-compose up -d
```

This will start:
- API service on port 3000
- MongoDB on port 27017
- Redis on port 6379
- Nginx on ports 80/443

#### Step 3: Verify Deployment

```bash
curl http://localhost:3000/health
```

### Option 2: PM2 Deployment

PM2 is a production process manager for Node.js applications.

#### Step 1: Install PM2 Globally

```bash
npm install -g pm2
```

#### Step 2: Install Dependencies

```bash
npm ci --only=production
```

#### Step 3: Start the Application

```bash
pm2 start ecosystem.config.js --env production
```

#### Step 4: Configure PM2 Startup

```bash
pm2 startup
pm2 save
```

#### PM2 Commands

```bash
# View logs
pm2 logs

# Monitor
pm2 monit

# Restart
pm2 restart tags-api

# Stop
pm2 stop tags-api

# Delete
pm2 delete tags-api
```

### Option 3: Manual Deployment

#### Step 1: Install Dependencies

```bash
npm ci --only=production
```

#### Step 2: Start the Server

```bash
NODE_ENV=production npm start
```

**Note**: For production, use a process manager like PM2 or systemd to keep the application running.

## Cloud Platform Deployments

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. Install the EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize EB:
   ```bash
   eb init -p node.js tags-api
   ```

3. Create environment:
   ```bash
   eb create tags-api-prod
   ```

4. Deploy:
   ```bash
   eb deploy
   ```

#### Using AWS ECS (Docker)

1. Push Docker image to ECR
2. Create ECS task definition
3. Create ECS service
4. Configure load balancer

### Google Cloud Platform

#### Using Google Cloud Run

1. Build and push Docker image:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/tags-api
   ```

2. Deploy:
   ```bash
   gcloud run deploy tags-api \
     --image gcr.io/PROJECT_ID/tags-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Heroku Deployment

1. Create Heroku app:
   ```bash
   heroku create tags-api-prod
   ```

2. Add MongoDB and Redis add-ons:
   ```bash
   heroku addons:create mongolab:sandbox
   heroku addons:create heroku-redis:hobby-dev
   ```

3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure environment variables
3. Set build and run commands:
   - Build: `npm ci`
   - Run: `npm start`
4. Deploy

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your application's IP addresses
3. Create a database user
4. Get the connection string
5. Update `MONGODB_URI` in your `.env` file

### Self-Hosted MongoDB

1. Install MongoDB on your server
2. Configure authentication
3. Set up regular backups
4. Update connection string

## Redis Setup

### Redis Cloud (Recommended)

1. Create a free database at [Redis Cloud](https://redis.com/try-free/)
2. Get connection details
3. Update Redis configuration in `.env`

### Self-Hosted Redis

1. Install Redis on your server
2. Configure persistence
3. Set up password authentication
4. Update connection details

## SSL/HTTPS Configuration

### Using Let's Encrypt with Nginx

1. Install Certbot:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Obtain certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. Auto-renewal is configured automatically

### Nginx Configuration

Create `/etc/nginx/sites-available/tags-api`:

```nginx
upstream tags_api {
    least_conn;
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://tags_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/tags-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**:
   ```bash
   pm2 monit
   ```

2. **Log Management**:
   - Logs are stored in `logs/` directory
   - Use log rotation to manage file sizes
   - Consider using a log aggregation service (Loggly, Papertrail)

3. **Health Checks**:
   - Monitor `/health` endpoint
   - Set up uptime monitoring (UptimeRobot, Pingdom)

### Performance Monitoring

Consider integrating:
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and application monitoring
- **Sentry**: Error tracking and monitoring

## Database Migrations

Run migrations after deployment:

```bash
npm run migrate
```

## Database Seeding

Seed initial data:

```bash
npm run seed
```

## Backup Strategy

### MongoDB Backups

1. **Automated Backups** (MongoDB Atlas):
   - Enabled by default
   - Configure retention period

2. **Manual Backups**:
   ```bash
   mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
   ```

### Redis Backups

Redis automatically creates snapshots. Configure in `redis.conf`:

```
save 900 1
save 300 10
save 60 10000
```

## Scaling

### Vertical Scaling

Increase server resources (CPU, RAM) as needed.

### Horizontal Scaling

1. **Load Balancing**: Use Nginx or cloud load balancers
2. **Multiple Instances**: Run multiple API instances
3. **Database Scaling**: Use MongoDB replica sets
4. **Cache Scaling**: Use Redis cluster

### PM2 Cluster Mode

Already configured in `ecosystem.config.js`:

```javascript
instances: 'max', // Uses all CPU cores
exec_mode: 'cluster'
```

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Set up regular backups
- [ ] Monitor for security vulnerabilities
- [ ] Implement API key rotation policy

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs` or `docker logs tags-api`
2. Verify environment variables
3. Check database connectivity
4. Verify Redis connectivity

### High Memory Usage

1. Check for memory leaks
2. Adjust PM2 `max_memory_restart` setting
3. Optimize database queries
4. Review caching strategy

### Slow Response Times

1. Check database indexes
2. Verify Redis is working
3. Review slow query logs
4. Consider adding more instances

## Rollback Procedure

If deployment fails:

1. **PM2**:
   ```bash
   pm2 restart tags-api
   ```

2. **Docker**:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. **Restore Database** (if needed):
   ```bash
   mongorestore --uri="mongodb+srv://..." /backup/backup-date
   ```

## Post-Deployment Checklist

- [ ] Verify health endpoint responds
- [ ] Test API endpoints
- [ ] Check logs for errors
- [ ] Monitor performance metrics
- [ ] Verify database connectivity
- [ ] Verify Redis connectivity
- [ ] Test rate limiting
- [ ] Verify SSL certificate
- [ ] Update DNS if needed
- [ ] Notify team of deployment

## Support

For deployment issues:
- Email: devops@tagsapi.com
- Documentation: https://docs.tagsapi.com/deployment
- GitHub Issues: https://github.com/your-repo/tags-api/issues
