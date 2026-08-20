#!/bin/bash

# Build script for the OLD React SPA in source_code/ (kept for comparison only).
# WARNING: the repo root is now the real static site (index.html, contact.html,
# website-cost-estimator.html, css/, js/, assets/) — running this will DELETE it
# and overwrite it with a React rebuild. Do not run this unless that's what you want.

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
