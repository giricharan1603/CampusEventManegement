Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Campus Event Management System (CEMS) - Quick Start" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n[1/3] Starting Backend Server on http://localhost:5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[2/3] Starting Frontend Client on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[3/3] Opening Browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host "`nAll services launched! Keep the opened windows running." -ForegroundColor Cyan
