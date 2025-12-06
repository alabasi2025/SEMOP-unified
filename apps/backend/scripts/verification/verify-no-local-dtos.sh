#!/bin/bash
# PHASE-0.3.2: Verify no local DTOs exist

set -e

echo "🔍 Checking for local DTOs..."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKEND_DIR="../../unified-backend-monorepo"
FRONTEND_DIR="../../unified-frontend-monorepo"

FOUND_ISSUES=0

# Check backend
echo "Checking backend..."
if grep -r "export class.*Dto" "$BACKEND_DIR/libs" 2>/dev/null | grep -v node_modules | grep -v ".spec.ts"; then
  echo -e "${RED}❌ Found local DTOs in backend/libs${NC}"
  FOUND_ISSUES=1
fi

# Check frontend
echo "Checking frontend..."
if grep -r "export interface.*Dto\|export class.*Dto" "$FRONTEND_DIR/apps" 2>/dev/null | grep -v node_modules | grep -v ".spec.ts"; then
  echo -e "${RED}❌ Found local DTOs in frontend/apps${NC}"
  FOUND_ISSUES=1
fi

if [ $FOUND_ISSUES -eq 0 ]; then
  echo -e "${GREEN}✅ No local DTOs found${NC}"
else
  echo -e "${YELLOW}⚠️  Please use @semop/contracts instead${NC}"
  exit 1
fi
