#!/bin/bash

# SEMOP Simple Deployment Script
# This script uses Docker Compose with database only, and runs apps directly with PM2

set -e

echo "======================================"
echo "🚀 SEMOP Simple Deployment"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Install Node.js if not installed
print_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    print_success "Node.js installed"
else
    print_success "Node.js already installed: $(node --version)"
fi

# Install PM2 if not installed
print_info "Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
    print_info "Installing PM2..."
    npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Install Docker if not installed
print_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_info "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# Install Docker Compose if not installed
print_info "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    print_info "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Setup environment
print_info "Setting up environment..."
cp .env.production .env
print_success "Environment configured"

# Start database with Docker
print_info "Starting PostgreSQL database..."
cat > docker-compose.db.yml <<EOF
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: semop-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: semop
      POSTGRES_USER: semop_user
      POSTGRES_PASSWORD: Sholh@781166666_DB_Secure
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U semop_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
EOF

docker-compose -f docker-compose.db.yml up -d
print_success "Database started"

# Wait for database
print_info "Waiting for database to be ready..."
sleep 10

# Setup Backend
print_info "Setting up Backend..."
cd apps/backend

# Install dependencies
print_info "Installing backend dependencies..."
npm install --legacy-peer-deps --ignore-scripts
print_success "Backend dependencies installed"

# Generate Prisma Client
print_info "Generating Prisma Client..."
npx prisma generate
print_success "Prisma Client generated"

# Run migrations
print_info "Running database migrations..."
export DATABASE_URL="postgresql://semop_user:Sholh@781166666_DB_Secure@localhost:5432/semop"
npx prisma migrate deploy || print_info "Migrations skipped (may already be applied)"
print_success "Migrations completed"

# Start Backend with PM2
print_info "Starting Backend with PM2..."
pm2 delete semop-backend 2>/dev/null || true
pm2 start apps/api-gateway/src/main.js --name semop-backend --node-args="--require ./node_modules/tsconfig-paths/register" || \
pm2 start npm --name semop-backend -- run start:prod
print_success "Backend started"

cd ../..

# Setup Frontend
print_info "Setting up Frontend..."
cd apps/frontend

# Check if dist exists
if [ ! -d "dist" ]; then
    print_info "Building Frontend..."
    npm install --legacy-peer-deps
    npm run build || npx nx build platform-shell-ui --configuration=production
    print_success "Frontend built"
fi

# Install Nginx if not installed
print_info "Checking Nginx installation..."
if ! command -v nginx &> /dev/null; then
    print_info "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
    systemctl enable nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Configure Nginx
print_info "Configuring Nginx..."
cat > /etc/nginx/sites-available/semop <<EOF
server {
    listen 80;
    server_name _;
    root /root/SEMOP-unified/apps/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/semop /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
print_success "Nginx configured and started"

cd ../..

# Show status
echo ""
echo "======================================"
print_success "Deployment completed!"
echo "======================================"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.db.yml ps
echo ""
pm2 list
echo ""
systemctl status nginx --no-pager | head -5
echo ""
echo "📝 Service URLs:"
echo "  Frontend: http://72.61.111.217"
echo "  Backend API: http://72.61.111.217:3000"
echo "  Database: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "  PM2 logs: pm2 logs semop-backend"
echo "  PM2 restart: pm2 restart semop-backend"
echo "  Database logs: docker-compose -f docker-compose.db.yml logs -f"
echo "  Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
