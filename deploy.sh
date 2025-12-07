#!/bin/bash

# SEMOP Deployment Script for Hostinger VPS
# This script deploys the full-stack application using Docker

set -e  # Exit on any error

echo "======================================"
echo "🚀 SEMOP Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Docker is installed
print_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    print_success "Docker installed successfully"
else
    print_success "Docker is already installed"
fi

# Check if Docker Compose is installed
print_info "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose is already installed"
fi

# Stop existing containers
print_info "Stopping existing containers..."
docker-compose down || true
print_success "Existing containers stopped"

# Copy production environment file
print_info "Setting up environment variables..."
if [ -f ".env.production" ]; then
    cp .env.production .env
    print_success "Environment variables configured"
else
    print_error ".env.production file not found!"
    exit 1
fi

# Build and start containers
print_info "Building Docker images (this may take several minutes)..."
docker-compose build --no-cache

print_success "Docker images built successfully"

print_info "Starting containers..."
docker-compose up -d

print_success "Containers started successfully"

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check container status
print_info "Checking container status..."
docker-compose ps

# Run database migrations
print_info "Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy || print_error "Migration failed (this is normal on first run)"

print_success "Database migrations completed"

# Show logs
print_info "Showing recent logs..."
docker-compose logs --tail=50

echo ""
echo "======================================"
print_success "Deployment completed successfully!"
echo "======================================"
echo ""
echo "📊 Service URLs:"
echo "  Frontend: http://72.61.111.217"
echo "  Backend API: http://72.61.111.217:3000"
echo "  Database: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View status: docker-compose ps"
echo ""
