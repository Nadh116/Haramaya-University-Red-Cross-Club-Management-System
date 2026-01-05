# Test with proper validation according to backend requirements
$testData = @{
    name = "Test User Name"  # Must be 2-100 characters
    email = "test@example.com"  # Must be valid email
    phone = "+251911234567"  # Optional but must be valid mobile if provided
    subject = "Test Contact Form Subject"  # Must be 5-200 characters
    message = "This is a test message to verify the contact form functionality. It needs to be at least 10 characters long to pass validation."  # Must be 10-2000 characters
    inquiryType = "general"  # Must be one of: general, volunteer, emergency, donation, training, partnership, complaint, suggestion
} | ConvertTo-Json

Write-Host "Testing Contact Form with Proper Validation..." -ForegroundColor Yellow
Write-Host "Data being sent:" -ForegroundColor Cyan
Write-Host $testData -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR DETECTED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        
        # Try to get the response body for validation errors
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Response Body: $errorBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
    }
}