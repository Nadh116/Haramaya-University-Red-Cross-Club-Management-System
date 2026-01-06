# PowerShell script to deploy FRONTEND to Vercel
Write-Host "🚀 STEP 2: Deploying FRONTEND to Vercel..." -ForegroundColor Green

# Check if backend URL is provided
$backendUrl = Read-Host "Enter your BACKEND URL (from previous deployment)"

if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    Write-Host "❌ Backend URL is required! Please deploy backend first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing Vercel CLI (if needed)..." -ForegroundColor Yellow
npm install -g vercel

Write-Host "🔑 Login to Vercel (if needed)..." -ForegroundColor Yellow
Write-Host "Run: vercel login" -ForegroundColor Cyan

Write-Host "🚀 Deploying frontend..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Frontend deployment initiated!" -ForegroundColor Green
Write-Host "📋 IMPORTANT: Set environment variables in Vercel dashboard:" -ForegroundColor Magenta
Write-Host "   Variable: REACT_APP_API_URL" -ForegroundColor Cyan
Write-Host "   Value: $backendUrl/api" -ForegroundColor Cyan

Write-Host "📋 Final steps:" -ForegroundColor Magenta
Write-Host "1. Go to Vercel dashboard" -ForegroundColor White
Write-Host "2. Open your frontend project settings" -ForegroundColor White
Write-Host "3. Add environment variable:" -ForegroundColor White
Write-Host "   REACT_APP_API_URL = $backendUrl/api" -ForegroundColor Cyan
Write-Host "4. Redeploy frontend to apply env vars" -ForegroundColor White
Write-Host "5. Test the complete application" -ForegroundColor White