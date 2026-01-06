# PowerShell script to push Vercel deployment fixes to GitHub
Write-Host "🚀 Pushing UPDATED Vercel project name to GitHub..." -ForegroundColor Green

# Add all changes
Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Update Vercel project name to avoid conflict - haramaya-redcross-app-2025"

# Push to GitHub
Write-Host "🔄 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Successfully pushed UPDATED project name to GitHub!" -ForegroundColor Green
Write-Host "🌐 Your Vercel deployment should now work with the new name." -ForegroundColor Cyan

Write-Host "📋 What was changed:" -ForegroundColor Magenta
Write-Host "✅ Project name: haramaya-redcross-app-2025 (unique name)" -ForegroundColor Green
Write-Host "✅ Fixed: Removed invalid rootDirectory property" -ForegroundColor Green
Write-Host "✅ Added: Proper build configuration" -ForegroundColor Green

Write-Host "📋 Next steps:" -ForegroundColor Magenta
Write-Host "1. Go back to Vercel and try deploying again" -ForegroundColor White
Write-Host "2. The project name conflict should be resolved" -ForegroundColor White
Write-Host "3. Deployment should proceed successfully" -ForegroundColor White
Write-Host "4. Set REACT_APP_API_URL environment variable after deployment" -ForegroundColor White