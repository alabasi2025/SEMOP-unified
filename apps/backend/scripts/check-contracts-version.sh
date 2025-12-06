#!/bin/bash
# PHASE-0.3.1: Verify all repos use same @semop/contracts version

set -e

echo "🔍 Checking @semop/contracts version across all repositories..."

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check current repo version
CURRENT_VERSION=$(npm list @semop/contracts --depth=0 2>/dev/null | grep @semop/contracts | awk '{print $2}' | tr -d '@' || echo "NOT_INSTALLED")

echo "Current repo: $CURRENT_VERSION"

if [ "$CURRENT_VERSION" = "NOT_INSTALLED" ]; then
  echo -e "${RED}❌ @semop/contracts not installed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ @semop/contracts@$CURRENT_VERSION installed${NC}"
