#!/bin/bash

# ALvVERSE Vercel Deployment Script
# This script builds LevelMap and prepares for Vercel deployment

echo "🚀 Preparing ALvVERSE for Vercel deployment..."

# Navigate to project root
cd "$(dirname "$0")"

# Build LevelMap
echo "📦 Building LevelMap..."
cd LevelMap
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ LevelMap build failed!"
    exit 1
fi

echo "✅ LevelMap built successfully!"

# Go back to root
cd ..

# Check if dist folder exists
if [ ! -f "LevelMap/dist/index.html" ]; then
    echo "❌ LevelMap/dist/index.html not found!"
    exit 1
fi

echo "✅ LevelMap/dist/index.html exists"

# Check git status
if command -v git &> /dev/null; then
    echo ""
    echo "📋 Git Status:"
    git status --short LevelMap/dist/ 2>/dev/null || echo "   (Not a git repo or dist not tracked)"
    echo ""
    echo "💡 To deploy to Vercel:"
    echo "   1. git add LevelMap/dist"
    echo "   2. git commit -m 'Build LevelMap for Vercel'"
    echo "   3. git push"
    echo ""
    echo "   OR configure Vercel to build automatically (see VERCEL_DEPLOYMENT_FIX.md)"
else
    echo ""
    echo "💡 Git not found. Build complete!"
    echo "   Upload LevelMap/dist folder to Vercel manually"
fi

echo ""
echo "✅ Ready for deployment!"
echo "   Next: Commit and push to trigger Vercel deployment"

