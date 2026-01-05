$testData = @{
    name = "Final Test User"
    email = "final.test@example.com" 
    phone = "+251911234567"
    subject = "Final Contact Form Test"
    message = "This is the final test to verify the contact form is working correctly with all fixes applied."
    inquiryType = "general"
} | ConvertTo-Json

Write-Host "🔍 FINAL CONTACT FORM TEST" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host ""
Write-Host "📤 Test Data:" -ForegroundColor Cyan
Write-Host $testData -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Testing Backend Direct: http://localhost:5000/api/contact" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ BACKEND TEST SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ BACKEND TEST FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Details: $errorBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            Write-Host "Could not read error details" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "🔗 Testing Frontend Proxy: http://localhost:3002 -> /api/contact" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ FRONTEND PROXY SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ FRONTEND PROXY FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Details: $errorBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            Write-Host "Could not read error details" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Check backend logs for detailed validation info" -ForegroundColor White
Write-Host "2. Open http://localhost:3002 and test the contact form" -ForegroundColor White
Write-Host "3. Check browser console for frontend logs" -ForegroundColor White