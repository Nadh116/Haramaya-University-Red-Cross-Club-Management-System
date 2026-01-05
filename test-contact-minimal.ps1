# Test with minimal required fields only
$testData = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "This is a test message with enough characters."
    inquiryType = "general"
} | ConvertTo-Json

Write-Host "Testing Contact Form with Minimal Data (no phone)..." -ForegroundColor Yellow
Write-Host "Data: $testData" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    # Get detailed error
    $errorStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorStream)
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error Body: $errorBody" -ForegroundColor Red
    $reader.Close()
}