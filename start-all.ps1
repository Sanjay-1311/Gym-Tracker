Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting SculptTrack Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Chatbot (Python Flask)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\.venv\Scripts\Activate.ps1; cd src\backend\chatbot; python app.py" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Backend (Node.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\src\backend'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\src\frontend-main'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Chatbot:    http://localhost:5000" -ForegroundColor White
Write-Host "Backend:    http://localhost:3000" -ForegroundColor White
Write-Host "Frontend:   http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (services will continue running)" -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
