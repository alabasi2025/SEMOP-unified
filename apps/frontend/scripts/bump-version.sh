#!/bin/bash

# Script to bump patch version automatically
# Usage: ./scripts/bump-version.sh

# Read current version from package.json
CURRENT_VERSION=$(grep '"version":' package.json | sed 's/.*"version": "\(.*\)".*/\1/')

# Split version into parts
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "Bumping version from $CURRENT_VERSION to $NEW_VERSION"

# Update package.json
sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# Update environment.ts
sed -i "s/version: '$CURRENT_VERSION'/version: '$NEW_VERSION'/" apps/platform-shell-ui/src/environments/environment.ts

echo "✓ Version bumped to $NEW_VERSION"
echo "✓ Updated package.json"
echo "✓ Updated environment.ts"
