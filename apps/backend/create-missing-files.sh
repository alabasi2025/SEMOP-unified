#!/bin/bash

# PHASE 10: Create all missing files

echo "🔧 Creating missing files..."

# 1. account_hierarchy files
cat > libs/3-vertical-applications/accounting/account-hierarchy/account_hierarchy.controller.ts << 'EOF'
// PHASE 10: Account Hierarchy Controller
import { Controller } from '@nestjs/common';
import { AccountHierarchyService } from './account_hierarchy.service';

@Controller('account-hierarchy')
export class AccountHierarchyController {
  constructor(private readonly service: AccountHierarchyService) {}
}
EOF

cat > libs/3-vertical-applications/accounting/account-hierarchy/account_hierarchy.service.ts << 'EOF'
// PHASE 10: Account Hierarchy Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../0-shared/prisma/prisma.service';

@Injectable()
export class AccountHierarchyService {
  constructor(private prisma: PrismaService) {}
}
EOF

# 2. customer_contacts files
cat > libs/3-vertical-applications/sales/customer-contacts/customer_contacts.controller.ts << 'EOF'
// PHASE 10: Customer Contacts Controller
import { Controller } from '@nestjs/common';
import { CustomerContactsService } from './customer_contacts.service';

@Controller('customer-contacts')
export class CustomerContactsController {
  constructor(private readonly service: CustomerContactsService) {}
}
EOF

cat > libs/3-vertical-applications/sales/customer-contacts/customer_contacts.service.ts << 'EOF'
// PHASE 10: Customer Contacts Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../0-shared/prisma/prisma.service';

@Injectable()
export class CustomerContactsService {
  constructor(private prisma: PrismaService) {}
}
EOF

# 3. latitude_points files
cat > libs/2-ocmp/latitude-points/latitude_points.controller.ts << 'EOF'
// PHASE 10: Latitude Points Controller
import { Controller } from '@nestjs/common';
import { LatitudePointsService } from './latitude_points.service';

@Controller('latitude-points')
export class LatitudePointsController {
  constructor(private readonly service: LatitudePointsService) {}
}
EOF

cat > libs/2-ocmp/latitude-points/latitude_points.service.ts << 'EOF'
// PHASE 10: Latitude Points Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../0-shared/prisma/prisma.service';

@Injectable()
export class LatitudePointsService {
  constructor(private prisma: PrismaService) {}
}
EOF

# 4. role_permissions files
cat > libs/1-core-services/role-permissions/role_permissions.controller.ts << 'EOF'
// PHASE 10: Role Permissions Controller
import { Controller } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly service: RolePermissionsService) {}
}
EOF

cat > libs/1-core-services/role-permissions/role_permissions.service.ts << 'EOF'
// PHASE 10: Role Permissions Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../0-shared/prisma/prisma.service';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
}
EOF

# 5. genes DTOs
mkdir -p libs/2-ocmp/genes/dto
cat > libs/2-ocmp/genes/dto/genes.dto.ts << 'EOF'
// PHASE 10: Genes DTOs - Import from @semop/contracts
export * from '@semop/contracts';
EOF

cat > libs/2-ocmp/genes/dto/link-gene-sector.dto.ts << 'EOF'
// PHASE 10: Link Gene Sector DTO - Import from @semop/contracts
export * from '@semop/contracts';
EOF

# 6. purchase-orders DTOs
mkdir -p libs/3-vertical-applications/purchasing/purchase-orders/dto
cat > libs/3-vertical-applications/purchasing/purchase-orders/dto/create-purchase-order.dto.ts << 'EOF'
// PHASE 10: Create Purchase Order DTO - Import from @semop/contracts
export * from '@semop/contracts';
EOF

cat > libs/3-vertical-applications/purchasing/purchase-orders/dto/update-purchase-order.dto.ts << 'EOF'
// PHASE 10: Update Purchase Order DTO - Import from @semop/contracts
export * from '@semop/contracts';
EOF

echo "✅ All missing files created!"
ls -la libs/3-vertical-applications/accounting/account-hierarchy/
ls -la libs/3-vertical-applications/sales/customer-contacts/
ls -la libs/2-ocmp/latitude-points/
ls -la libs/1-core-services/role-permissions/
