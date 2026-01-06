#!/bin/bash
# Bash script to force push to GitHub

echo "🚀 Deploying Haramaya Red Cross System to GitHub..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Show current status
echo ""
echo "📋 Current Git Status:"
git status --short

# Add all changes
echo ""
echo "📦 Adding all changes..."
git add .

# Show what will be committed
echo ""
echo "📝 Files to be committed:"
git diff --cached --name-only

# Commit changes
COMMIT_MESSAGE="Fix Vercel deployment configuration and clean up project files"
echo ""
echo "💾 Committing changes with message: '$COMMIT_MESSAGE'"
git commit -m "$COMMIT_MESSAGE"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo "✅ Commit successful!"
else
    echo "⚠️ Nothing to commit or commit failed"
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo ""
echo "🌿 Current branch: $CURRENT_BRANCH"

# Force push to GitHub
echo ""
echo "🚀 Force pushing to GitHub..."
echo "⚠️ WARNING: This will overwrite the remote repository!"

read -p "Do you want to continue? (y/N): " confirmation
if [[ $confirmation == [yY] ]]; then
    git push --force-with-lease origin $CURRENT_BRANCH
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Successfully pushed to GitHub!"
        echo "📱 Your changes are now live on GitHub"
        echo "🔗 You can now deploy to Vercel from the updated repository"
    else
        echo ""
        echo "❌ Push failed!"
        echo "Please check your internet connection and GitHub credentials"
    fi
else
    echo ""
    echo "❌ Push cancelled by user"
fi

echo ""
echo "✨ Script completed!"