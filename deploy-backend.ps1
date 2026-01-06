# PowerShell script to deploy BACKEND to Vercel
Write-Host "🚀 STEP 1: Deploying BACKEND to Vercel..." -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

Write-Host "📦 Installing Vercel CLI (if needed)..." -ForegroundColor Yellow
npm install -g vercel

Write-Host "🔑 Login to Vercel (if needed)..." -ForegroundColor Yellow
Write-Host "Run: vercel login" -ForegroundColor Cyan

Write-Host "🚀 Deploying backend..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Backend deployment initiated!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Magenta
Write-Host "1. Wait for backend deployment to complete" -ForegroundColor White
Write-Host "2. Copy the backend URL from Vercel dashboard" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel:" -ForegroundColor White
Write-Host "   - MONGODB_URI" -ForegroundColor Cyan
Write-Host "   - JWT_SECRET" -ForegroundColor Cyan
Write-Host "   - NODE_ENV=production" -ForegroundColor Cyan
Write-Host "4. Test backend API endpoints" -ForegroundColor White
Write-Host "5. Then run deploy-frontend.ps1" -ForegroundColor White

# Go back to root directory
Set-Location ..