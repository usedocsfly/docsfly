#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_error "You must be on the main branch to create a release"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    print_error "Working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Check if version is provided
if [ -z "$1" ]; then
    print_error "Please provide a version number (e.g., ./scripts/release.sh 1.3.0)"
    exit 1
fi

VERSION=$1

# Validate version format (basic semver check)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Version must be in semver format (e.g., 1.3.0)"
    exit 1
fi

print_status "Creating release for version $VERSION"

# Update package versions
print_status "Updating package versions..."

# Update docsfly package
cd packages/docsfly
bun pm version $VERSION --no-git-tag-version
cd ../..

# Update create-docsfly-app package
cd packages/create-docsfly-app
bun pm version $VERSION --no-git-tag-version
cd ../..

# Build packages
print_status "Building packages..."
bun run build

# Run tests
print_status "Running tests..."
bun run test

# Commit version changes
print_status "Committing version changes..."
git add packages/*/package.json
git commit -m "chore: bump version to $VERSION"

# Create and push tag
print_status "Creating git tag..."
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin main
git push origin "v$VERSION"

print_status "Release $VERSION created successfully!"
print_warning "GitHub Actions will now publish the packages to npm."
print_warning "Check the Actions tab for publish status: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"