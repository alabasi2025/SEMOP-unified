# دليل النشر على الخادم السحابي

**الإصدار:** 1.0  
**تاريخ الإنشاء:** 3 ديسمبر 2025  
**الحالة:** جاهز للتنفيذ

---

## 📋 نظرة عامة

هذا الدليل الشامل لنشر منصة SEMOP على خادم سحابي، مع التركيز على:
- ✅ النشر الآمن والموثوق
- ✅ القابلية للتوسع (Scalability)
- ✅ الأداء العالي (High Performance)
- ✅ الاستمرارية (High Availability)

---

## 🎯 متطلبات الخادم

### **الحد الأدنى (للتطوير/التجريب):**

| المورد | المواصفات |
|--------|-----------|
| **CPU** | 4 Cores |
| **RAM** | 8 GB |
| **Storage** | 100 GB SSD |
| **Bandwidth** | 100 Mbps |
| **OS** | Ubuntu 22.04 LTS |

### **الموصى به (للإنتاج):**

| المورد | المواصفات |
|--------|-----------|
| **CPU** | 8+ Cores |
| **RAM** | 16+ GB |
| **Storage** | 500+ GB NVMe SSD |
| **Bandwidth** | 1 Gbps |
| **OS** | Ubuntu 22.04 LTS |
| **Backup** | Daily automated backups |

### **للشركات الكبيرة (Enterprise):**

| المورد | المواصفات |
|--------|-----------|
| **Architecture** | Kubernetes Cluster |
| **Nodes** | 3+ worker nodes |
| **CPU per node** | 16+ Cores |
| **RAM per node** | 32+ GB |
| **Storage** | 1+ TB NVMe SSD + S3 |
| **Database** | Managed PostgreSQL (RDS/CloudSQL) |
| **Load Balancer** | Cloud Load Balancer |
| **CDN** | CloudFlare/CloudFront |

---

## 🔧 المرحلة 1: إعداد الخادم

### **الخطوة 1.1: الاتصال بالخادم**

```bash
# الاتصال عبر SSH
ssh root@your-server-ip

# أو باستخدام مفتاح SSH
ssh -i ~/.ssh/semop-key.pem ubuntu@your-server-ip
```

### **الخطوة 1.2: تحديث النظام**

```bash
# تحديث قوائم الحزم
sudo apt update

# ترقية الحزم المثبتة
sudo apt upgrade -y

# تثبيت الأدوات الأساسية
sudo apt install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  ufw \
  fail2ban \
  certbot \
  python3-certbot-nginx
```

### **الخطوة 1.3: إعداد الجدار الناري**

```bash
# السماح بـ SSH
sudo ufw allow OpenSSH

# السماح بـ HTTP و HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# السماح بـ PostgreSQL (فقط من localhost)
sudo ufw allow from 127.0.0.1 to any port 5432

# تفعيل الجدار الناري
sudo ufw enable

# التحقق من الحالة
sudo ufw status
```

### **الخطوة 1.4: إنشاء مستخدم للنشر**

```bash
# إنشاء مستخدم semop
sudo adduser semop

# إضافة إلى مجموعة sudo
sudo usermod -aG sudo semop

# إضافة إلى مجموعة docker (سنثبته لاحقاً)
sudo usermod -aG docker semop

# التبديل إلى المستخدم الجديد
su - semop
```

---

## 🐳 المرحلة 2: تثبيت Docker و Docker Compose

### **الخطوة 2.1: تثبيت Docker**

```bash
# إزالة الإصدارات القديمة
sudo apt remove docker docker-engine docker.io containerd runc

# تثبيت المتطلبات
sudo apt install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# إضافة مفتاح GPG الرسمي
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# إضافة المستودع
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# تحديث وتثبيت Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# التحقق من التثبيت
docker --version
docker compose version

# تشغيل Docker عند بدء التشغيل
sudo systemctl enable docker
sudo systemctl start docker
```

### **الخطوة 2.2: اختبار Docker**

```bash
# تشغيل حاوية اختبار
docker run hello-world

# إذا نجح، ستظهر رسالة "Hello from Docker!"
```

---

## 🗄️ المرحلة 3: إعداد قاعدة البيانات

### **الخيار 1: PostgreSQL في Docker (للتطوير)**

```bash
# إنشاء مجلد للبيانات
mkdir -p ~/semop/postgres-data

# تشغيل PostgreSQL
docker run -d \
  --name semop-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=semop \
  -e POSTGRES_USER=semop \
  -e POSTGRES_PASSWORD=your-strong-password \
  -v ~/semop/postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# التحقق من التشغيل
docker ps | grep semop-postgres
```

### **الخيار 2: PostgreSQL مثبت مباشرة (للإنتاج)**

```bash
# تثبيت PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# بدء الخدمة
sudo systemctl start postgresql
sudo systemctl enable postgresql

# إنشاء قاعدة البيانات والمستخدم
sudo -u postgres psql << EOF
CREATE DATABASE semop;
CREATE USER semop WITH ENCRYPTED PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE semop TO semop;
ALTER DATABASE semop OWNER TO semop;
\q
EOF

# التحقق
sudo -u postgres psql -c "\l" | grep semop
```

### **الخيار 3: Managed Database (للإنتاج - موصى به)**

```bash
# استخدام خدمة قاعدة بيانات مدارة:
# - AWS RDS
# - Google Cloud SQL
# - Azure Database for PostgreSQL
# - DigitalOcean Managed Databases

# مثال على connection string:
# postgresql://semop:password@your-db-host:5432/semop?sslmode=require
```

---

## 📦 المرحلة 4: استنساخ المستودعات

### **الخطوة 4.1: إعداد SSH للـ GitHub**

```bash
# إنشاء مفتاح SSH
ssh-keygen -t ed25519 -C "deploy@semop.com" -f ~/.ssh/github_semop

# عرض المفتاح العام
cat ~/.ssh/github_semop.pub

# إضافة المفتاح إلى GitHub:
# 1. انسخ المفتاح العام
# 2. اذهب إلى GitHub → Settings → SSH and GPG keys
# 3. أضف المفتاح الجديد

# إضافة المفتاح إلى SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github_semop

# اختبار الاتصال
ssh -T git@github.com
```

### **الخطوة 4.2: استنساخ المستودعات**

```bash
# إنشاء مجلد المشروع
mkdir -p ~/semop
cd ~/semop

# استنساخ المستودعات الأربعة
git clone git@github.com:alabasi2025/SEMOP.git
git clone git@github.com:alabasi2025/shared-contracts-repo.git
git clone git@github.com:alabasi2025/unified-backend-monorepo.git
git clone git@github.com:alabasi2025/unified-frontend-monorepo.git

# التحقق
ls -la
# يجب أن ترى المجلدات الأربعة
```

---

## 🏗️ المرحلة 5: بناء ونشر التطبيق

### **الخطوة 5.1: إنشاء ملفات Docker**

#### **Dockerfile للخلفية:**

```dockerfile
# ~/semop/unified-backend-monorepo/Dockerfile
# PHASE-5.1.1: Production-ready backend container

FROM node:22-alpine AS builder

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./
COPY package-lock.json ./

# تثبيت التبعيات
RUN npm ci --only=production

# نسخ الكود
COPY . .

# بناء التطبيق
RUN npx nx build api-gateway --prod

# المرحلة النهائية
FROM node:22-alpine

WORKDIR /app

# نسخ من المرحلة السابقة
COPY --from=builder /app/dist/apps/api-gateway ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# إنشاء مستخدم غير root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "main.js"]
```

#### **Dockerfile للواجهة:**

```dockerfile
# ~/semop/unified-frontend-monorepo/Dockerfile
# PHASE-5.1.2: Production-ready frontend container

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build platform-shell-ui --prod --output-path=dist

# المرحلة النهائية
FROM nginx:alpine

# نسخ ملف nginx المخصص
COPY nginx.conf /etc/nginx/nginx.conf

# نسخ الملفات المبنية
COPY --from=builder /app/dist /usr/share/nginx/html

# إنشاء مستخدم nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### **nginx.conf للواجهة:**

```nginx
# ~/semop/unified-frontend-monorepo/nginx.conf

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:3000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Angular routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### **الخطوة 5.2: إنشاء docker-compose.yml**

```yaml
# ~/semop/docker-compose.yml
# PHASE-5.1.3: Complete stack orchestration

version: '3.8'

services:
  # قاعدة البيانات
  postgres:
    image: postgres:15-alpine
    container_name: semop-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME:-semop}
      POSTGRES_USER: ${DB_USER:-semop}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --lc-collate=C --lc-ctype=C"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-semop}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - semop-network

  # الخلفية
  backend:
    build:
      context: ./unified-backend-monorepo
      dockerfile: Dockerfile
    container_name: semop-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${DB_USER:-semop}:${DB_PASSWORD}@postgres:5432/${DB_NAME:-semop}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION:-7d}
      CORS_ORIGIN: ${CORS_ORIGIN:-*}
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "127.0.0.1:3000:3000"
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - semop-network
    volumes:
      - backend-logs:/app/logs
      - backend-uploads:/app/uploads

  # الواجهة الأمامية
  frontend:
    build:
      context: ./unified-frontend-monorepo
      dockerfile: Dockerfile
    container_name: semop-frontend
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - semop-network
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - frontend-logs:/var/log/nginx

  # Redis للـ Caching (اختياري)
  redis:
    image: redis:7-alpine
    container_name: semop-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - semop-network

networks:
  semop-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local
  backend-logs:
    driver: local
  backend-uploads:
    driver: local
  frontend-logs:
    driver: local
```

### **الخطوة 5.3: إنشاء ملف .env**

```bash
# ~/semop/.env
# PHASE-5.1.3: Environment variables

# Database
DB_NAME=semop
DB_USER=semop
DB_PASSWORD=your-very-strong-password-here

# Backend
JWT_SECRET=your-jwt-secret-key-min-32-chars
JWT_EXPIRATION=7d
CORS_ORIGIN=https://your-domain.com

# Redis
REDIS_PASSWORD=your-redis-password

# Application
NODE_ENV=production
PORT=3000
```

**⚠️ تحذير أمني:**
```bash
# تأمين ملف .env
chmod 600 .env

# عدم رفعه إلى Git
echo ".env" >> .gitignore
```

### **الخطوة 5.4: بناء ونشر التطبيق**

```bash
cd ~/semop

# بناء الصور
docker compose build

# تشغيل التطبيق
docker compose up -d

# مشاهدة السجلات
docker compose logs -f

# التحقق من الحالة
docker compose ps
```

---

## 🔒 المرحلة 6: إعداد SSL/TLS

### **الخطوة 6.1: الحصول على شهادة Let's Encrypt**

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# إيقاف nginx مؤقتاً
docker compose stop frontend

# الحصول على الشهادة
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# نسخ الشهادات
sudo mkdir -p ~/semop/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ~/semop/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ~/semop/ssl/
sudo chown -R semop:semop ~/semop/ssl

# إعادة تشغيل frontend
docker compose up -d frontend
```

### **الخطوة 6.2: تحديث nginx.conf للـ SSL**

```nginx
# إضافة إلى nginx.conf

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # باقي الإعدادات...
}

# إعادة توجيه HTTP إلى HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### **الخطوة 6.3: تجديد تلقائي للشهادة**

```bash
# إضافة cron job للتجديد
sudo crontab -e

# إضافة هذا السطر:
0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/your-domain.com/*.pem ~/semop/ssl/ && docker compose restart frontend
```

---

## 📊 المرحلة 7: المراقبة والسجلات

### **الخطوة 7.1: إعداد Monitoring**

```yaml
# إضافة إلى docker-compose.yml

  # Prometheus للمراقبة
  prometheus:
    image: prom/prometheus:latest
    container_name: semop-prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "127.0.0.1:9090:9090"
    networks:
      - semop-network

  # Grafana للتصور
  grafana:
    image: grafana/grafana:latest
    container_name: semop-grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "127.0.0.1:3001:3000"
    networks:
      - semop-network
```

### **الخطوة 7.2: إعداد Logging**

```bash
# عرض السجلات
docker compose logs -f backend
docker compose logs -f frontend

# حفظ السجلات
docker compose logs backend > backend-logs.txt
docker compose logs frontend > frontend-logs.txt

# تنظيف السجلات القديمة (cron job)
0 0 * * 0 docker system prune -af --volumes
```

---

## 🔄 المرحلة 8: النسخ الاحتياطي والاستعادة

### **الخطوة 8.1: نسخ احتياطي لقاعدة البيانات**

```bash
#!/bin/bash
# ~/semop/scripts/backup-db.sh

BACKUP_DIR=~/semop/backups
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/semop_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

docker exec semop-postgres pg_dump -U semop semop > $BACKUP_FILE

# ضغط النسخة الاحتياطية
gzip $BACKUP_FILE

# حذف النسخ الأقدم من 30 يوم
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x ~/semop/scripts/backup-db.sh

# إضافة cron job للنسخ الاحتياطي اليومي
crontab -e
# إضافة:
0 2 * * * ~/semop/scripts/backup-db.sh
```

### **الخطوة 8.2: استعادة من نسخة احتياطية**

```bash
#!/bin/bash
# ~/semop/scripts/restore-db.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-db.sh <backup-file.sql.gz>"
  exit 1
fi

# فك الضغط
gunzip -c $BACKUP_FILE > /tmp/restore.sql

# الاستعادة
docker exec -i semop-postgres psql -U semop semop < /tmp/restore.sql

# تنظيف
rm /tmp/restore.sql

echo "Restore completed from: $BACKUP_FILE"
```

---

## 🚀 المرحلة 9: التحديثات والنشر المستمر

### **الخطوة 9.1: سكريبت النشر**

```bash
#!/bin/bash
# ~/semop/scripts/deploy.sh
# PHASE-6.3.1: Automated deployment script

set -e

echo "🚀 Starting SEMOP deployment..."

# الألوان
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# الانتقال إلى مجلد المشروع
cd ~/semop

# 1. سحب آخر التحديثات
echo -e "${BLUE}[1/7] Pulling latest changes...${NC}"
cd SEMOP && git pull origin main && cd ..
cd shared-contracts-repo && git pull origin main && cd ..
cd unified-backend-monorepo && git pull origin main && cd ..
cd unified-frontend-monorepo && git pull origin main && cd ..

# 2. فحص التكامل
echo -e "${BLUE}[2/7] Verifying integration...${NC}"
cd SEMOP
./scripts/verify-integration.sh

# 3. نسخ احتياطي لقاعدة البيانات
echo -e "${BLUE}[3/7] Backing up database...${NC}"
./scripts/backup-db.sh

# 4. إيقاف التطبيق
echo -e "${BLUE}[4/7] Stopping application...${NC}"
cd ~/semop
docker compose down

# 5. بناء الصور الجديدة
echo -e "${BLUE}[5/7] Building new images...${NC}"
docker compose build --no-cache

# 6. تشغيل التطبيق
echo -e "${BLUE}[6/7] Starting application...${NC}"
docker compose up -d

# 7. التحقق من الصحة
echo -e "${BLUE}[7/7] Health check...${NC}"
sleep 10
if curl -f http://localhost/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Deployment successful!${NC}"
else
  echo -e "${RED}❌ Deployment failed!${NC}"
  exit 1
fi
```

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x ~/semop/scripts/deploy.sh
```

### **الخطوة 9.2: GitHub Actions للنشر التلقائي**

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/semop
            ./scripts/deploy.sh
```

---

## 📈 المرحلة 10: التحسين والأداء

### **الخطوة 10.1: تحسين PostgreSQL**

```bash
# تعديل إعدادات PostgreSQL للإنتاج
docker exec -it semop-postgres psql -U semop -c "
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '20MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';
"

# إعادة تشغيل PostgreSQL
docker compose restart postgres
```

### **الخطوة 10.2: تفعيل Caching**

```typescript
// في backend - تفعيل Redis caching
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
      password: process.env.REDIS_PASSWORD,
      ttl: 600, // 10 minutes
    }),
  ],
})
export class AppModule {}
```

---

## ✅ قائمة التحقق النهائية

### **قبل النشر:**

- [ ] جميع المستودعات محدثة
- [ ] فحص التكامل يمر
- [ ] جميع الاختبارات تمر
- [ ] البناء ينجح
- [ ] ملف .env محدث وآمن
- [ ] النسخ الاحتياطي جاهز

### **بعد النشر:**

- [ ] التطبيق يعمل
- [ ] قاعدة البيانات متصلة
- [ ] SSL مفعل
- [ ] Health checks تمر
- [ ] السجلات تعمل
- [ ] المراقبة تعمل
- [ ] النسخ الاحتياطي التلقائي مفعل

---

**آخر تحديث:** 3 ديسمبر 2025  
**الإصدار:** 1.0  
**الحالة:** جاهز للإنتاج
