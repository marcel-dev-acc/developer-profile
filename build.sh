#!/bin/bash

# Build script for GitHub Pages deployment
# This script builds the project and copies output to the repo root

set -e  # Exit on error

echo "🚀 Starting build process..."

# Step 1: Navigate to source_code directory
cd source_code

# Step 2: Build the project
echo "📦 Building project..."
yarn build

# Step 3: Navigate back to repo root
cd ..

# Step 4: Clean up old build files
echo "🧹 Cleaning up old build files..."
rm -f index.html
rm -rf assets/

# Step 5: Copy new build files to repo root
echo "📋 Copying build output to repo root..."
cp -r source_code/dist/* .

echo "✅ Build complete! Files ready for GitHub Pages deployment."
echo "📁 Updated files: index.html and assets/"
