@echo off
echo Setting up Deepfake Video Detection System development environment...

REM Create environment files if they don't exist
if not exist packages\backend\.env (
    copy packages\backend\.env.example packages\backend\.env
    echo Created backend .env file
)

if not exist packages\ai-service\.env (
    copy packages\ai-service\.env.example packages\ai-service\.env
    echo Created ai-service .env file
)

if not exist packages\forensic-engine\.env (
    copy packages\forensic-engine\.env.example packages\forensic-engine\.env
    echo Created forensic-engine .env file
)

REM Create models directory
if not exist models mkdir models
echo Created models directory

REM Create uploads directory
if not exist uploads mkdir uploads
echo Created uploads directory

echo Development environment setup complete!
echo.
echo Next steps:
echo 1. Run 'npm install' to install dependencies
echo 2. Run 'npm run dev' to start all services
echo 3. Open http://localhost:3000 in your browser