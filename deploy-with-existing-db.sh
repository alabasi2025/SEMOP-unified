#!/bin/bash

# SEMOP Deployment with Existing PostgreSQL

set -e

echo "======================================"
echo "🚀 SEMOP Deployment"
echo "======================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Install PM2 if needed
print_info "Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 ready"
fi

# Setup database
print_info "Setting up database..."
sudo -u postgres psql <<EOF
-- Drop database if exists
DROP DATABASE IF EXISTS semop;
DROP USER IF EXISTS semop_user;

-- Create user and database
CREATE USER semop_user WITH PASSWORD 'Sholh@781166666_DB_Secure';
CREATE DATABASE semop OWNER semop_user;
GRANT ALL PRIVILEGES ON DATABASE semop TO semop_user;
EOF
print_success "Database created"

# Setup Backend
print_info "Setting up Backend..."
cd apps/backend

# Install dependencies
print_info "Installing backend dependencies (this may take a few minutes)..."
npm install --legacy-peer-deps --ignore-scripts 2>&1 | tail -20
print_success "Backend dependencies installed"

# Generate Prisma Client
print_info "Generating Prisma Client..."
npx prisma generate
print_success "Prisma Client generated"

# Run migrations
print_info "Running database migrations..."
export DATABASE_URL="postgresql://semop_user:Sholh@781166666_DB_Secure@localhost:5432/semop"
npx prisma migrate deploy 2>&1 | tail -20 || print_info "Migrations may already be applied"
print_success "Database ready"

# Start Backend with PM2
print_info "Starting Backend..."
pm2 delete semop-backend 2>/dev/null || true

# Try to start with the main file
if [ -f "apps/api-gateway/src/main.js" ]; then
    pm2 start apps/api-gateway/src/main.js --name semop-backend \
        --node-args="--require ./node_modules/tsconfig-paths/register" \
        --env production
elif [ -f "dist/main.js" ]; then
    pm2 start dist/main.js --name semop-backend --env production
else
    # Fallback to npm start
    pm2 start npm --name semop-backend -- run start:prod
fi

pm2 save
print_success "Backend started"

cd ../..

# Setup Frontend
print_info "Setting up Frontend..."

# Install Nginx if needed
if ! command -v nginx &> /dev/null; then
    print_info "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
    systemctl enable nginx
    print_success "Nginx installed"
fi

# Check if we need to build frontend
if [ ! -d "apps/frontend/dist" ] && [ ! -d "apps/frontend/dist/apps/platform-shell-ui" ]; then
    print_info "Frontend needs to be built. Building now..."
    cd apps/frontend
    npm install --legacy-peer-deps 2>&1 | tail -20
    npm run build 2>&1 | tail -20 || npx nx build platform-shell-ui --configuration=production 2>&1 | tail -20
    cd ../..
    print_success "Frontend built"
fi

# Find the dist directory
DIST_DIR=""
if [ -d "apps/frontend/dist/apps/platform-shell-ui" ]; then
    DIST_DIR="/root/SEMOP-unified/apps/frontend/dist/apps/platform-shell-ui"
elif [ -d "apps/frontend/dist" ]; then
    DIST_DIR="/root/SEMOP-unified/apps/frontend/dist"
else
    print_info "Warning: Could not find dist directory"
fi

# Configure Nginx
print_info "Configuring Nginx..."
cat > /etc/nginx/sites-available/semop <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    root $DIST_DIR;
    index index.html;

    # Frontend
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/semop /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
print_success "Nginx configured"

# Show status
echo ""
echo "======================================"
print_success "Deployment Completed!"
echo "======================================"
echo ""
echo "📊 Service Status:"
echo ""
echo "Backend (PM2):"
pm2 list
echo ""
echo "Nginx:"
systemctl status nginx --no-pager | head -3
echo ""
echo "PostgreSQL:"
systemctl status postgresql --no-pager | head -3
echo ""
echo "📝 Access URLs:"
echo "  🌐 Frontend: http://72.61.111.217"
echo "  🔌 Backend API: http://72.61.111.217:3000"
echo "  💾 Database: localhost:5432/semop"
echo ""
echo "📝 Useful Commands:"
echo "  PM2 logs: pm2 logs semop-backend"
echo "  PM2 restart: pm2 restart semop-backend"
echo "  PM2 stop: pm2 stop semop-backend"
echo "  Nginx logs: tail -f /var/log/nginx/error.log"
echo "  Nginx restart: systemctl restart nginx"
echo ""
