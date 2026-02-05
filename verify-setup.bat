@echo off
echo Verifying Deepfake Detection System Setup...
echo.

echo Checking Node.js packages...
echo ================================

echo [1/4] Checking shared package build...
cd packages\shared
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Shared package build failed
    exit /b 1
)
cd ..\..

echo [2/4] Checking backend build...
cd packages\backend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed
    exit /b 1
)
cd ..\..

echo [3/4] Checking forensic engine build...
cd packages\forensic-engine
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Forensic engine build failed
    exit /b 1
)
cd ..\..

echo [4/4] Checking frontend build...
cd packages\frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    exit /b 1
)
cd ..\..

echo.
echo Checking Python AI Service...
echo =============================
cd packages\ai-service
.venv\Scripts\python.exe -c "import flask, torch, transformers, cv2; print('All Python dependencies available')"
if %errorlevel% neq 0 (
    echo ERROR: Python dependencies missing
    exit /b 1
)
cd ..\..

echo.
echo ✅ ALL PACKAGES SUCCESSFULLY INSTALLED AND BUILT!
echo.
echo Next steps:
echo 1. Install and start MongoDB (local or use MongoDB Atlas)
echo 2. Install and start Redis (local or use Redis Cloud)  
echo 3. Run: npm run dev
echo.
echo Service URLs will be:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:3001
echo - AI Service: http://localhost:5000
echo - Forensic Engine: http://localhost:5001