@echo off
rem Development environment setup script for Windows

setlocal enabledelayedexpansion

rem Get script directory and project root
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..

rem Colors for output (using PowerShell for colored output)
set "RED=[31m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "NC=[0m"

:print_header
echo.
echo %GREEN%🚄 Hyperloop H10 Development Environment%NC%
echo %GREEN%=======================================%NC%
echo %YELLOW%OS: Windows%NC%
echo.
goto :eof

:print_usage
echo Usage: %0 [command]
echo.
echo Commands:
echo   setup       - Install all dependencies
echo   backend     - Run backend server
echo   ethernet    - Run ethernet-view dev server
echo   control     - Run control-station dev server
echo   packet      - Run packet-sender
echo   all         - Run all services in parallel
echo   test        - Run all tests
echo   build       - Build all components
echo.
goto :eof

:check_dependencies
echo %YELLOW%Checking dependencies...%NC%

where go >nul 2>&1
if errorlevel 1 (
    echo %RED%Error: Go is not installed or not in PATH%NC%
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo %RED%Error: Node.js is not installed or not in PATH%NC%
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo %RED%Error: npm is not installed or not in PATH%NC%
    exit /b 1
)

echo %GREEN%✅ All dependencies found%NC%
goto :eof

:setup_project
echo %YELLOW%Setting up project dependencies...%NC%

cd /d "%PROJECT_ROOT%"

rem Build common-front first
echo 📦 Building common-front...
cd common-front
call npm install
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1

rem Install ethernet-view dependencies
echo 📦 Installing ethernet-view dependencies...
cd ..\ethernet-view
call npm install
if errorlevel 1 exit /b 1

rem Install control-station dependencies
echo 📦 Installing control-station dependencies...
cd ..\control-station
call npm install
if errorlevel 1 exit /b 1

rem Download Go dependencies
echo 📦 Downloading Go dependencies...
cd ..\backend
go mod download
if errorlevel 1 exit /b 1

cd ..\packet-sender
go mod download
if errorlevel 1 exit /b 1

echo %GREEN%✅ Setup complete!%NC%
goto :eof

:run_backend
cd /d "%PROJECT_ROOT%\backend\cmd"
echo %YELLOW%Starting backend server...%NC%
go run .
goto :eof

:run_ethernet_view
cd /d "%PROJECT_ROOT%\ethernet-view"
echo %YELLOW%Starting ethernet-view dev server...%NC%
call npm run dev
goto :eof

:run_control_station
cd /d "%PROJECT_ROOT%\control-station"
echo %YELLOW%Starting control-station dev server...%NC%
call npm run dev
goto :eof

:run_packet_sender
cd /d "%PROJECT_ROOT%\packet-sender"
echo %YELLOW%Starting packet-sender...%NC%
go run .
goto :eof

:run_all_parallel
echo %YELLOW%Starting all services in parallel...%NC%
echo %YELLOW%Use Ctrl+C to stop all services%NC%
echo.

rem Create a temporary batch file to run services in parallel
set TEMP_BATCH=%TEMP%\hyperloop_services.bat

echo @echo off > "%TEMP_BATCH%"
echo start "Backend" /D "%PROJECT_ROOT%\backend\cmd" cmd /k "go run ." >> "%TEMP_BATCH%"
echo start "Ethernet View" /D "%PROJECT_ROOT%\ethernet-view" cmd /k "npm run dev" >> "%TEMP_BATCH%"
echo start "Control Station" /D "%PROJECT_ROOT%\control-station" cmd /k "npm run dev" >> "%TEMP_BATCH%"
echo start "Packet Sender" /D "%PROJECT_ROOT%\packet-sender" cmd /k "go run ." >> "%TEMP_BATCH%"

call "%TEMP_BATCH%"
del "%TEMP_BATCH%"

echo %GREEN%All services started in separate windows%NC%
echo %YELLOW%Close the respective command windows to stop each service%NC%
goto :eof

:run_tests
echo %YELLOW%Running tests...%NC%

cd /d "%PROJECT_ROOT%\backend"
echo 🧪 Running backend tests...
go test -v ./...
if errorlevel 1 exit /b 1

rem Add more test commands as needed
echo %GREEN%✅ All tests passed%NC%
goto :eof

:build_all
cd /d "%PROJECT_ROOT%"
echo %YELLOW%Building all components...%NC%

rem Check if make is available (e.g., from MinGW or WSL)
where make >nul 2>&1
if not errorlevel 1 (
    make all
) else (
    echo %YELLOW%Make not found, building components individually...%NC%
    
    rem Build backend
    echo Building backend...
    cd backend
    go build -o backend cmd/main.go cmd/config.go cmd/pid.go cmd/trace.go
    if errorlevel 1 exit /b 1
    
    rem Build common-front
    echo Building common-front...
    cd ..\common-front
    call npm run build
    if errorlevel 1 exit /b 1
    
    rem Build other frontends
    echo Building ethernet-view...
    cd ..\ethernet-view
    call npm run build
    if errorlevel 1 exit /b 1
    
    echo Building control-station...
    cd ..\control-station
    call npm run build
    if errorlevel 1 exit /b 1
)

echo %GREEN%✅ Build complete!%NC%
goto :eof

rem Main script logic
call :print_header
call :check_dependencies

if "%1"=="" (
    call :print_usage
    exit /b 1
)

if "%1"=="setup" (
    call :setup_project
) else if "%1"=="backend" (
    call :run_backend
) else if "%1"=="ethernet" (
    call :run_ethernet_view
) else if "%1"=="control" (
    call :run_control_station
) else if "%1"=="packet" (
    call :run_packet_sender
) else if "%1"=="all" (
    call :run_all_parallel
) else if "%1"=="test" (
    call :run_tests
) else if "%1"=="build" (
    call :build_all
) else (
    echo %RED%Unknown command: %1%NC%
    call :print_usage
    exit /b 1
)