#!/bin/bash

# Build Electron App Script
# This script builds the Call Center Analytics Dashboard as a desktop application

echo "🚀 Building Call Center Analytics Dashboard for Desktop..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Electron dependencies
echo "⚡ Installing Electron dependencies..."
npm run electron:postinstall

# Build the Next.js app
echo "🔨 Building Next.js application..."
npm run build

# Copy necessary files to electron-app directory
echo "📋 Copying files to electron-app directory..."
cp -r src electron-app/
cp -r public electron-app/
cp -r prisma electron-app/
cp package.json electron-app/
cp next.config.ts electron-app/
cp tailwind.config.ts electron-app/
cp tsconfig.json electron-app/
cp components.json electron-app/
cp postcss.config.mjs electron-app/
cp eslint.config.mjs electron-app/
cp server.ts electron-app/

# Copy the full package.json to electron-app
cp electron-app/package-full.json electron-app/package.json

# Change to electron-app directory
cd electron-app

# Install dependencies in electron-app
echo "📦 Installing dependencies in electron-app..."
npm install

# Build the Electron app
echo "🎯 Building Electron application..."
npm run build

# Go back to root directory
cd ..

echo "✅ Build completed successfully!"
echo "📁 The executable files are located in: electron-app/dist/"
echo ""
echo "🖥️  Available executables:"
echo "   - Windows: .exe files in electron-app/dist/win-unpacked/"
echo "   - macOS: .app in electron-app/dist/mac/"
echo "   - Linux: .AppImage in electron-app/dist/linux-unpacked/"
echo ""
echo "📦 Installers are also available in the electron-app/dist/ directory"