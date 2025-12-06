#!/bin/bash
# PHASE-0.3.1: Verify all repos use same @semop/contracts version

set -e

echo "🔍 Checking @semop/contracts version across all repositories..."

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

BACKEND_DIR="../../unified-backend-monorepo"
FRONTEND_DIR="../../unified-frontend-monorepo"

if [ ! -d "$BACKEND_DIR" ]; then
  echo -e "${RED}❌ Backend repository not found${NC}"
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo -e "${RED}❌ Frontend repository not found${NC}"
  exit 1
fi

BACKEND_VERSION=$(cd "$BACKEND_DIR" && npm list @semop/contracts --depth=0 2>/dev/null | grep @semop/contracts | awk '{print $2}' | tr -d '@' || echo "NOT_INSTALLED")
FRONTEND_VERSION=$(cd "$FRONTEND_DIR" && npm list @semop/contracts --depth=0 2>/dev/null | grep @semop/contracts | awk '{print $2}' | tr -d '@' || echo "NOT_INSTALLED")

echo "Backend:  $BACKEND_VERSION"
echo "Frontend: $FRONTEND_VERSION"

if [ "$BACKEND_VERSION" = "NOT_INSTALLED" ]; then
  echo -e "${RED}❌ @semop/contracts not installed in backend${NC}"
  exit 1
fi

if [ "$FRONTEND_VERSION" = "NOT_INSTALLED" ]; then
  echo -e "${RED}❌ @semop/contracts not installed in frontend${NC}"
  exit 1
fi

if [ "$BACKEND_VERSION" != "$FRONTEND_VERSION" ]; then
  echo -e "${RED}❌ Version mismatch!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All repos use version: $BACKEND_VERSION${NC}"
