#!/bin/bash

# Skyzer Cloud - First Time Setup Script

set -e

echo "🚀 Skyzer Cloud - First Time Setup"
echo "===================================="

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Create .env file
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration before continuing"
    exit 1
fi

echo "✅ .env file exists"

# Start services
echo ""
echo "Starting Docker services..."
docker-compose up -d postgres redis api worker web nginx

echo "Waiting for services to be ready..."
sleep 10

# Run migrations
echo ""
echo "Running database migrations..."
docker-compose exec -T api pnpm db:migrate:deploy

echo ""
echo "✅ Setup complete!"
echo ""
echo "Services running:"
echo "  - Frontend:  http://localhost:3000"
echo "  - API:       http://localhost:3001"
echo "  - API Docs:  http://localhost:3001/api/docs"
echo "  - Panel:     http://localhost/panel (Pterodactyl via proxy)"
echo ""
echo "Next steps:"
echo "  1. Create admin user: docker-compose exec api npx ts-node scripts/create-admin.ts"
echo "  2. Create sample products: docker-compose exec api npx ts-node scripts/seed-products.ts"
echo "  3. Visit http://localhost:3000 to test"
