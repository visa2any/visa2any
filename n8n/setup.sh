#!/bin/bash

# Visa2Any N8N Automation Setup Script
echo "🚀 Setting up Visa2Any N8N Automation Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p workflows
mkdir -p data/postgres
mkdir -p data/n8n

# Set permissions
chmod 755 workflows
chmod 755 data

# Copy environment file
if [ ! -f .env ]; then
    echo "📄 Creating environment file..."
    cp .env.example .env 2>/dev/null || echo "⚠️  Please create .env file manually using .env as template"
fi

# Start N8N and PostgreSQL
echo "🐳 Starting N8N and PostgreSQL containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ N8N and PostgreSQL are running!"
    echo ""
    echo "🌐 N8N is available at: http://localhost:5678"
    echo "👤 Username: admin"
    echo "🔑 Password: visa2any123!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Access N8N at http://localhost:5678"
    echo "2. Import the workflow files from ./workflows/"
    echo "3. Configure your API credentials in N8N"
    echo "4. Test the workflows with sample data"
    echo ""
    echo "🔧 Available workflows:"
    echo "  - Legal Changes Monitor"
    echo "  - Consular Slots Monitor" 
    echo "  - Zero Touch Client Journey"
    echo "  - Document Processing Automation"
    echo ""
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi

# Run database migrations
echo "🗄️ Running database migrations..."
cd .. && npm run prisma:migrate || echo "⚠️  Please run database migrations manually"

echo "🎉 N8N Automation Platform setup complete!"
echo "📖 Check README-N8N.md for detailed configuration instructions."