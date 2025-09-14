@echo off
echo ========================================
echo Starting SculptTrack Services
echo ========================================
echo.

echo Starting Chatbot (Python Flask)...
start "Chatbot" cmd /k "cd /d %~dp0 && .venv\Scripts\activate.bat && cd src\backend\chatbot && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Backend (Node.js)...
start "Backend" cmd /k "cd /d %~dp0\src\backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd /d %~dp0\src\frontend-main && npm run dev"

echo.
echo ========================================
echo All services starting...
echo ========================================
echo.
echo Chatbot:    http://localhost:5000
echo Backend:    http://localhost:3000
echo Frontend:   http://localhost:5173
echo.
echo Press any key to exit this window (services will continue running)
pause >nul
