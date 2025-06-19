@echo off
setlocal enabledelayedexpansion

REM Hyperloop Control Station Launcher (Windows)
REM Professional single-click application startup

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend\cmd"
set "BACKEND_BINARY=%BACKEND_DIR%\backend.exe"

echo.
echo 🚄 Hyperloop UPV Control Station
echo =================================
echo.

REM Check if backend binary exists
if not exist "%BACKEND_BINARY%" (
    echo ⚠️  Backend binary not found. Building...
    cd /d "%BACKEND_DIR%"
    
    REM Check if Go is installed
    where go >nul 2>nul
    if errorlevel 1 (
        echo ❌ Go is not installed. Please install Go and try again.
        pause
        exit /b 1
    )
    
    REM Build backend
    echo 🔨 Building backend...
    go build -o backend.exe .
    
    if errorlevel 1 (
        echo ❌ Failed to build backend
        pause
        exit /b 1
    ) else (
        echo ✅ Backend built successfully
    )
) else (
    echo ✅ Backend binary found
)

REM Check if Node.js/npm is available for development servers
where npm >nul 2>nul
if errorlevel 1 (
    echo ⚠️  npm not found - using static serving only
) else (
    echo ✅ npm found - development servers available
)

echo.
echo 🚀 Starting Hyperloop Control Station...
echo    • Backend server will start
echo    • Frontend will open automatically
echo    • Close the browser to shut down
echo.

REM Change to backend directory and start
cd /d "%BACKEND_DIR%"

REM Start the backend (which will handle frontend startup)
echo 🟢 Starting backend server...
backend.exe

echo ✅ Hyperloop Control Station shut down successfully
pause