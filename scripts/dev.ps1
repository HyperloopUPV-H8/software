# Development environment setup script for Windows PowerShell
param(
    [Parameter(Position=0)]
    [string]$Command = ""
)

# Script setup
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Colors for output
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    
    switch ($Color) {
        "Red"    { Write-Host $Message -ForegroundColor Red }
        "Green"  { Write-Host $Message -ForegroundColor Green }
        "Yellow" { Write-Host $Message -ForegroundColor Yellow }
        "Cyan"   { Write-Host $Message -ForegroundColor Cyan }
        default  { Write-Host $Message }
    }
}

function Print-Header {
    Write-Host ""
    Write-ColorOutput "🚄 Hyperloop H10 Development Environment" "Green"
    Write-ColorOutput "=======================================" "Green"
    Write-ColorOutput "OS: Windows (PowerShell)" "Yellow"
    Write-Host ""
}

function Print-Usage {
    Write-Host "Usage: .\dev.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  setup       - Install all dependencies"
    Write-Host "  backend     - Run backend server"
    Write-Host "  ethernet    - Run ethernet-view dev server"
    Write-Host "  control     - Run control-station dev server"
    Write-Host "  packet      - Run packet-sender"
    Write-Host "  all         - Run all services in parallel"
    Write-Host "  test        - Run all tests"
    Write-Host "  build       - Build all components"
    Write-Host ""
}

function Check-Dependencies {
    Write-ColorOutput "Checking dependencies..." "Yellow"
    
    $missing = @()
    
    if (-not (Get-Command "go" -ErrorAction SilentlyContinue)) {
        $missing += "go"
    }
    
    if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
        $missing += "node"
    }
    
    if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
        $missing += "npm"
    }
    
    if ($missing.Count -gt 0) {
        Write-ColorOutput "Error: Missing required dependencies: $($missing -join ', ')" "Red"
        Write-Host "Please install them before continuing."
        exit 1
    }
    
    Write-ColorOutput "✅ All dependencies found" "Green"
}

function Setup-Project {
    Write-ColorOutput "Setting up project dependencies..." "Yellow"
    
    Set-Location $ProjectRoot
    
    # Build common-front first
    Write-Host "📦 Building common-front..."
    Set-Location "common-front"
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    # Install ethernet-view dependencies
    Write-Host "📦 Installing ethernet-view dependencies..."
    Set-Location "..\ethernet-view"
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    # Install control-station dependencies
    Write-Host "📦 Installing control-station dependencies..."
    Set-Location "..\control-station"
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    # Download Go dependencies
    Write-Host "📦 Downloading Go dependencies..."
    Set-Location "..\backend"
    go mod download
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    Set-Location "..\packet-sender"
    go mod download
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    Write-ColorOutput "✅ Setup complete!" "Green"
}

function Run-Backend {
    Set-Location "$ProjectRoot\backend\cmd"
    Write-ColorOutput "Starting backend server..." "Yellow"
    go run .
}

function Run-EthernetView {
    Set-Location "$ProjectRoot\ethernet-view"
    Write-ColorOutput "Starting ethernet-view dev server..." "Yellow"
    npm run dev
}

function Run-ControlStation {
    Set-Location "$ProjectRoot\control-station"
    Write-ColorOutput "Starting control-station dev server..." "Yellow"
    npm run dev
}

function Run-PacketSender {
    Set-Location "$ProjectRoot\packet-sender"
    Write-ColorOutput "Starting packet-sender..." "Yellow"
    go run . run --enable-protections --enable-states --packet-interval 100ms
}

function Run-AllParallel {
    Write-ColorOutput "Starting all services in parallel..." "Yellow"
    Write-ColorOutput "Each service will open in a new PowerShell window" "Cyan"
    Write-ColorOutput "Close the respective windows to stop each service" "Cyan"
    Write-Host ""
    
    # Start each service in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot\backend\cmd'; Write-Host 'Backend Server' -ForegroundColor Green; go run ."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot\ethernet-view'; Write-Host 'Ethernet View' -ForegroundColor Green; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot\control-station'; Write-Host 'Control Station' -ForegroundColor Green; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot\packet-sender'; Write-Host 'Packet Sender' -ForegroundColor Green; go run . run --enable-protections --enable-states"
    
    Write-ColorOutput "✅ All services started in separate windows" "Green"
}

function Run-Tests {
    Write-ColorOutput "Running tests..." "Yellow"
    
    Set-Location "$ProjectRoot\backend"
    Write-Host "🧪 Running backend tests..."
    go test -v ./...
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    # Add more test commands as needed
    Write-ColorOutput "✅ All tests passed" "Green"
}

function Build-All {
    Set-Location $ProjectRoot
    Write-ColorOutput "Building all components..." "Yellow"
    
    # Check if make is available (e.g., from MinGW or WSL)
    if (Get-Command "make" -ErrorAction SilentlyContinue) {
        make all
    } else {
        Write-ColorOutput "Make not found, building components individually..." "Yellow"
        
        # Build backend
        Write-Host "Building backend..."
        Set-Location "backend"
        go build -o backend cmd/main.go cmd/config.go cmd/pid.go cmd/trace.go
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        
        # Build common-front
        Write-Host "Building common-front..."
        Set-Location "..\common-front"
        npm run build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        
        # Build other frontends
        Write-Host "Building ethernet-view..."
        Set-Location "..\ethernet-view"
        npm run build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        
        Write-Host "Building control-station..."
        Set-Location "..\control-station"
        npm run build
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
    
    Write-ColorOutput "✅ Build complete!" "Green"
}

# Main script logic
Print-Header
Check-Dependencies

switch ($Command) {
    "setup" {
        Setup-Project
    }
    "backend" {
        Run-Backend
    }
    "ethernet" {
        Run-EthernetView
    }
    "control" {
        Run-ControlStation
    }
    "packet" {
        Run-PacketSender
    }
    "all" {
        Run-AllParallel
    }
    "test" {
        Run-Tests
    }
    "build" {
        Build-All
    }
    default {
        Write-ColorOutput "Unknown command: $Command" "Red"
        Print-Usage
        exit 1
    }
}