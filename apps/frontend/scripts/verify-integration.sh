#!/bin/bash
# PHASE-0.3.5: Run all verification checks

set -e

echo "🚀 Running all integration checks..."
echo ""

./check-contracts-version.sh
echo ""

./verify-no-local-dtos.sh
echo ""

./verify-layer-architecture.sh
echo ""

./check-phase-comments.sh
echo ""

echo "✅ All checks passed!"
