$testData = @{
    name = "Test User"
    email = "test@example.com"
    phone = "+251911234567"
    subject = "Test Contact Form"
    message = "This is a test message to verify the contact form functionality."
    inquiryType = "general"
} | ConvertTo-Json

Write-Host "🧪 Testing Contact Form Endpoint..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📤 Sending test contact form data..." -ForegroundColor Cyan
Write-Host "Data: $testData" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host ""
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR DETECTED!" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        Write-Host "Status Description: $statusDescription" -ForegroundColor Red
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Response Body: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
    }
}