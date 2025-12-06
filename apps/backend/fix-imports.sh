#!/bin/bash

# PHASE 10: Fix all imports to use libs/0-shared/prisma/

echo "🔧 Fixing imports in libs/..."

# Fix PrismaService imports
find libs -name "*.ts" -type f -exec sed -i "s|from '../prisma/prisma.service'|from '../../../0-shared/prisma/prisma.service'|g" {} +
find libs -name "*.ts" -type f -exec sed -i "s|from '../../prisma/prisma.service'|from '../../../0-shared/prisma/prisma.service'|g" {} +
find libs -name "*.ts" -type f -exec sed -i "s|from '../../../prisma/prisma.service'|from '../../../0-shared/prisma/prisma.service'|g" {} +

# Fix PrismaModule imports
find libs -name "*.ts" -type f -exec sed -i "s|from '../prisma/prisma.module'|from '../../../0-shared/prisma/prisma.module'|g" {} +
find libs -name "*.ts" -type f -exec sed -i "s|from '../../prisma/prisma.module'|from '../../../0-shared/prisma/prisma.module'|g" {} +
find libs -name "*.ts" -type f -exec sed -i "s|from '../../../prisma/prisma.module'|from '../../../0-shared/prisma/prisma.module'|g" {} +

echo "✅ Imports fixed!"
echo "📊 Summary:"
grep -r "0-shared/prisma" libs --include="*.ts" | wc -l
echo "files updated"
