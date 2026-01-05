$testData = @{
    name = "Proxy Test User"
    email = "proxy.test@example.com" 
    phone = "+251911234567"
    subject = "Proxy Test"
    message = "Testing frontend proxy configuration."
    inquiryType = "general"
} | ConvertTo-Json

Write-Host "Testing Frontend Proxy..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "PROXY SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host "PROXY FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}