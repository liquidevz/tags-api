#!/bin/bash
set -e

echo "🚀 Starting Tags API Deployment..."

# Install MongoDB
echo "📦 Installing MongoDB..."
sudo apt-get update -qq
sudo apt-get install -y mongodb-org 2>/dev/null || sudo apt-get install -y mongodb

# Start MongoDB
echo "▶️  Starting MongoDB..."
sudo systemctl start mongodb 2>/dev/null || sudo mongod --fork --logpath /var/log/mongodb.log --dbpath /var/lib/mongodb

# Install Redis
echo "📦 Installing Redis..."
sudo apt-get install -y redis-server

# Start Redis
echo "▶️  Starting Redis..."
sudo systemctl start redis-server 2>/dev/null || redis-server --daemonize yes

# Install Node dependencies
echo "📦 Installing Node.js dependencies..."
npm install --production

# Seed database
echo "🌱 Seeding database..."
npm run seed

# Start API with PM2
echo "🚀 Starting API server..."
npm install -g pm2
pm2 start src/server.js --name tags-api

echo "✅ Deployment complete!"
echo "📍 API running at: http://localhost:3000"
echo "📚 Swagger docs at: http://localhost:3000/api/v1/docs"
