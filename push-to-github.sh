#!/bin/bash

# GitHub Push Script for Call Center Dashboard
# This script helps push the project to GitHub

echo "=== GitHub Push Script ==="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Error: Git repository not found. Please run this from the project root."
    exit 1
fi

# Check if remote origin exists
if git remote get-url origin &>/dev/null; then
    echo "Remote 'origin' already exists:"
    git remote get-url origin
    echo ""
    read -p "Do you want to use this remote? (y/n): " use_existing
    if [[ $use_existing != "y" && $use_existing != "Y" ]]; then
        echo "Please remove the existing remote first:"
        echo "git remote remove origin"
        exit 1
    fi
else
    # Ask for GitHub repository URL
    echo "Please provide your GitHub repository URL:"
    echo "Example: https://github.com/username/call-center-dashboard.git"
    read -p "GitHub Repository URL: " repo_url
    
    # Add the remote
    git remote add origin "$repo_url"
    echo "Remote 'origin' added successfully."
fi

echo ""
echo "Current git status:"
git status

echo ""
echo "Pushing to GitHub..."
echo ""

# Push to GitHub
if git push -u origin master; then
    echo ""
    echo "✅ Success! Project pushed to GitHub."
    echo ""
    echo "Next steps:"
    echo "1. Go to your GitHub repository to verify the upload"
    echo "2. Clone the repository locally:"
    echo "   git clone $(git remote get-url origin)"
    echo "3. Set up the project locally:"
    echo "   cd call-center-dashboard"
    echo "   npm install"
    echo "   npm run db:push"
    echo "   npm run dev"
    echo "4. Open http://localhost:3000"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Your GitHub repository URL is correct"
    echo "2. You have proper authentication set up"
    echo "3. Your GitHub credentials are valid"
    echo ""
    echo "Troubleshooting:"
    echo "- Make sure you've created the repository on GitHub first"
    echo "- Check if you need to authenticate with GitHub"
    echo "- Verify the repository URL is correct"
fi