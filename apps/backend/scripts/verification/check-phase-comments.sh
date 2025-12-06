#!/bin/bash
# PHASE-0.3.4: Check for PHASE comments in modified files

set -e

echo "🔍 Checking for PHASE comments in modified files..."

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

MODIFIED_FILES=$(git diff --name-only HEAD)

if [ -z "$MODIFIED_FILES" ]; then
  echo -e "${GREEN}✅ No modified files${NC}"
  exit 0
fi

MISSING_PHASE=()

for file in $MODIFIED_FILES; do
  if [[ $file == *.ts ]] || [[ $file == *.js ]]; then
    if ! grep -q "PHASE-" "$file" 2>/dev/null; then
      MISSING_PHASE+=("$file")
    fi
  fi
done

if [ ${#MISSING_PHASE[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All modified files have PHASE comments${NC}"
else
  echo -e "${RED}❌ Missing PHASE comments in:${NC}"
  for file in "${MISSING_PHASE[@]}"; do
    echo "  - $file"
  done
  exit 1
fi
