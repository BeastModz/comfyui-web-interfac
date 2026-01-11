@echo off
echo Starting ComfyUI Studio Backend Server
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "server.py" (
    echo Error: server.py not found. Please run this script from the backend\ directory.
    pause
    exit /b 1
)

REM Check if requirements are installed
echo Checking dependencies...
python -c "import flask" 2>nul
if %errorlevel% neq 0 (
    echo Installing dependencies...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo Failed to install dependencies. Please run manually:
        echo    pip install -r requirements.txt
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)

echo.
echo Starting server...
echo.
python server.py
