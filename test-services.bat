@echo off
echo Testing individual services...
echo.

echo Starting AI Service...
cd packages\ai-service
start "AI Service" .venv\Scripts\python.exe app.py
timeout /t 3 >nul
cd ..\..

echo Starting Forensic Engine...
cd packages\forensic-engine
start "Forensic Engine" npm run dev
timeout /t 2 >nul
cd ..\..

echo Starting Backend...
cd packages\backend
start "Backend" npm run dev
timeout /t 2 >nul
cd ..\..

echo Starting Frontend...
cd packages\frontend
start "Frontend" npm run dev
timeout /t 2 >nul
cd ..\..

echo.
echo All services started in separate windows!
echo.
echo Service URLs:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:3001
echo - AI Service: http://localhost:5000
echo - Forensic Engine: http://localhost:5001
echo.
echo Press any key to test health endpoints...
pause >nul

echo.
echo Testing health endpoints...
echo.

echo Backend Health:
curl -s http://localhost:3001/health
echo.
echo.

echo AI Service Health:
curl -s http://localhost:5000/health
echo.
echo.

echo Forensic Engine Health:
curl -s http://localhost:5001/health
echo.
echo.

echo All services tested!
pause