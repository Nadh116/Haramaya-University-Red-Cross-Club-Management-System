$testData = @{
    name = "Test User"
    email = "test@example.com"
    phone = "+251911234567"
    subject = "Test Contact Form"
    message = "This is a test message to verify the contact form functionality."
    inquiryType = "general"
} | ConvertTo-Json

Write-Host "Testing Contact Form Endpoint..." -ForegroundColor Yellow
Write-Host "Sending test data..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR DETECTED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}