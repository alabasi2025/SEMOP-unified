#!/bin/bash
# PHASE-0.3.3: Verify layer architecture is correct

set -e

echo "🔍 Checking layer architecture..."

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

BACKEND_DIR="../../unified-backend-monorepo/libs"

REQUIRED_LAYERS=(
  "1-core-services"
  "2-operational-platform"
  "3-vertical-applications"
  "4-sector-libraries"
)

MISSING_LAYERS=()

for layer in "${REQUIRED_LAYERS[@]}"; do
  if [ ! -d "$BACKEND_DIR/$layer" ]; then
    MISSING_LAYERS+=("$layer")
  fi
done

if [ ${#MISSING_LAYERS[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All required layers exist${NC}"
else
  echo -e "${RED}❌ Missing layers:${NC}"
  for layer in "${MISSING_LAYERS[@]}"; do
    echo "  - $layer"
  done
  exit 1
fi
