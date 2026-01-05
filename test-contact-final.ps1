$testData = @{
    name = "Final Test User"
    email = "final.test@example.com" 
    phone = "+251911234567"
    subject = "Final Contact Form Test"
    message = "This is the final test to verify the contact form is working correctly."
    inquiryType = "general"
} | ConvertTo-Json

Write-Host "FINAL CONTACT FORM TEST" -ForegroundColor Yellow
Write-Host "Test Data:" -ForegroundColor Cyan
Write-Host $testData -ForegroundColor Gray

Write-Host "Testing Backend Direct..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contact" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "BACKEND SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    
} catch {
    Write-Host "BACKEND FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error: $errorBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            Write-Host "Could not read error" -ForegroundColor Red
        }
    }
}