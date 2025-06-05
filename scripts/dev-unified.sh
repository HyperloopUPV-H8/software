#!/bin/bash
# Unified cross-platform development script
# Works on Unix/Linux/macOS and Windows (via Git Bash/WSL/MSYS2)

set -e

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Enhanced OS detection
detect_os() {
    local os="unknown"
    local is_wsl=false
    local shell_env="unknown"
    
    # Detect operating system
    case "$(uname -s)" in
        Linux*)
            if [[ -n "${WSL_DISTRO_NAME:-}" ]] || [[ "$(uname -r)" == *microsoft* ]]; then
                os="wsl"
                is_wsl=true
            else
                os="linux"
            fi
            ;;
        Darwin*)     os="macos";;
        CYGWIN*)     os="windows-cygwin";;
        MINGW*)      os="windows-mingw";;
        MSYS*)       os="windows-msys";;
        *)           os="unknown";;
    esac
    
    # Detect shell environment
    if [[ -n "${BASH_VERSION:-}" ]]; then
        shell_env="bash"
    elif [[ -n "${ZSH_VERSION:-}" ]]; then
        shell_env="zsh"
    else
        shell_env="sh"
    fi
    
    echo "$os|$is_wsl|$shell_env"
}

# Parse OS detection
OS_INFO=$(detect_os)
OS=$(echo "$OS_INFO" | cut -d'|' -f1)
IS_WSL=$(echo "$OS_INFO" | cut -d'|' -f2)
SHELL_ENV=$(echo "$OS_INFO" | cut -d'|' -f3)

# Determine if we're on Windows-like environment
case "$OS" in
    windows-*|wsl) IS_WINDOWS_LIKE=true;;
    *) IS_WINDOWS_LIKE=false;;
esac

# Colors for output (with Windows compatibility)
if [[ "$IS_WINDOWS_LIKE" == "true" ]] && [[ "$OS" != "wsl" ]]; then
    # Limited color support on Windows
    RED=""
    GREEN=""
    YELLOW=""
    NC=""
else
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
fi

print_header() {
    echo -e "${GREEN}🚄 Hyperloop H10 Development Environment${NC}"
    echo -e "${GREEN}=======================================${NC}"
    echo -e "${YELLOW}OS: $OS${NC}"
    echo -e "${YELLOW}Shell: $SHELL_ENV${NC}"
    echo -e "${YELLOW}WSL: $IS_WSL${NC}"
    echo ""
}

print_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Install all dependencies"
    echo "  backend     - Run backend server"
    echo "  ethernet    - Run ethernet-view dev server"
    echo "  control     - Run control-station dev server"
    echo "  packet      - Run packet-sender"
    echo "  all         - Run all services"
    echo "  test        - Run all tests"
    echo "  build       - Build all components"
    echo ""
    echo "Platform Notes:"
    if [[ "$IS_WINDOWS_LIKE" == "true" ]]; then
        echo "  - Windows detected: Services will run in parallel processes"
        echo "  - Use Ctrl+C to stop all services when running 'all' command"
    else
        echo "  - Unix-like system: 'all' command uses tmux if available"
        echo "  - Install tmux for better multi-service management"
    fi
    echo ""
}

check_dependencies() {
    local missing=()
    
    command -v go >/dev/null 2>&1 || missing+=("go")
    command -v node >/dev/null 2>&1 || missing+=("node")
    command -v npm >/dev/null 2>&1 || missing+=("npm")
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}Error: Missing required dependencies: ${missing[*]}${NC}"
        echo "Please install them before continuing."
        echo ""
        echo "Installation guides:"
        echo "  Go: https://golang.org/doc/install"
        echo "  Node.js: https://nodejs.org/"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies found${NC}"
}

# Convert Windows paths if needed
normalize_path() {
    local path="$1"
    if [[ "$IS_WINDOWS_LIKE" == "true" ]] && [[ "$OS" != "wsl" ]]; then
        echo "$path" | sed 's|/|\\|g'
    else
        echo "$path"
    fi
}

# Cross-platform directory change
safe_cd() {
    local target_dir="$1"
    local normalized_dir
    normalized_dir=$(normalize_path "$target_dir")
    
    if ! cd "$normalized_dir" 2>/dev/null; then
        echo -e "${RED}Error: Cannot change to directory: $normalized_dir${NC}"
        exit 1
    fi
}

setup_project() {
    echo -e "${YELLOW}Setting up project dependencies...${NC}"
    
    safe_cd "$PROJECT_ROOT"
    
    # Build common-front first
    echo "📦 Building common-front..."
    safe_cd "$PROJECT_ROOT/common-front"
    npm install
    npm run build
    
    # Install ethernet-view dependencies
    echo "📦 Installing ethernet-view dependencies..."
    safe_cd "$PROJECT_ROOT/ethernet-view"
    npm install
    
    # Install control-station dependencies
    echo "📦 Installing control-station dependencies..."
    safe_cd "$PROJECT_ROOT/control-station"
    npm install
    
    # Download Go dependencies
    echo "📦 Downloading Go dependencies..."
    safe_cd "$PROJECT_ROOT/backend"
    go mod download
    
    safe_cd "$PROJECT_ROOT/packet-sender"
    go mod download
    
    echo -e "${GREEN}✅ Setup complete!${NC}"
}

run_backend() {
    safe_cd "$PROJECT_ROOT/backend/cmd"
    echo -e "${YELLOW}Starting backend server...${NC}"
    go run .
}

run_ethernet_view() {
    safe_cd "$PROJECT_ROOT/ethernet-view"
    echo -e "${YELLOW}Starting ethernet-view dev server...${NC}"
    npm run dev
}

run_control_station() {
    safe_cd "$PROJECT_ROOT/control-station"
    echo -e "${YELLOW}Starting control-station dev server...${NC}"
    npm run dev
}

run_packet_sender() {
    safe_cd "$PROJECT_ROOT/packet-sender"
    echo -e "${YELLOW}Starting packet-sender...${NC}"
    go run .
}

run_all_services() {
    if [[ "$IS_WINDOWS_LIKE" == "true" ]] && [[ "$OS" != "wsl" ]]; then
        echo -e "${YELLOW}Running all services in parallel (Windows mode)...${NC}"
        echo -e "${YELLOW}Use Ctrl+C to stop all services${NC}"
        echo ""
        
        # Start all services in background
        (safe_cd "$PROJECT_ROOT/backend/cmd" && go run .) &
        PID_BACKEND=$!
        
        (safe_cd "$PROJECT_ROOT/ethernet-view" && npm run dev) &
        PID_ETHERNET=$!
        
        (safe_cd "$PROJECT_ROOT/control-station" && npm run dev) &
        PID_CONTROL=$!
        
        (safe_cd "$PROJECT_ROOT/packet-sender" && go run .) &
        PID_PACKET=$!
        
        echo -e "${GREEN}All services started. PIDs: Backend=$PID_BACKEND, Ethernet=$PID_ETHERNET, Control=$PID_CONTROL, Packet=$PID_PACKET${NC}"
        
        # Function to cleanup on exit
        cleanup() {
            echo -e "${YELLOW}Stopping all services...${NC}"
            kill $PID_BACKEND $PID_ETHERNET $PID_CONTROL $PID_PACKET 2>/dev/null || true
            exit
        }
        
        # Set trap for cleanup
        trap cleanup SIGINT SIGTERM
        
        # Wait for any process to exit
        wait
        
    else
        # Unix-like system - prefer tmux if available
        if command -v tmux >/dev/null 2>&1; then
            run_all_tmux
        else
            echo -e "${YELLOW}tmux not found. Running services in parallel...${NC}"
            echo -e "${YELLOW}Use Ctrl+C to stop all services${NC}"
            echo ""
            
            # Fallback to background processes
            (safe_cd "$PROJECT_ROOT/backend/cmd" && go run .) &
            PID_BACKEND=$!
            
            (safe_cd "$PROJECT_ROOT/ethernet-view" && npm run dev) &
            PID_ETHERNET=$!
            
            (safe_cd "$PROJECT_ROOT/control-station" && npm run dev) &
            PID_CONTROL=$!
            
            (safe_cd "$PROJECT_ROOT/packet-sender" && go run .) &
            PID_PACKET=$!
            
            echo -e "${GREEN}All services started. PIDs: Backend=$PID_BACKEND, Ethernet=$PID_ETHERNET, Control=$PID_CONTROL, Packet=$PID_PACKET${NC}"
            echo -e "${YELLOW}Tip: Install tmux for better session management${NC}"
            
            # Function to cleanup on exit
            cleanup() {
                echo -e "${YELLOW}Stopping all services...${NC}"
                kill $PID_BACKEND $PID_ETHERNET $PID_CONTROL $PID_PACKET 2>/dev/null || true
                exit
            }
            
            # Set trap for cleanup
            trap cleanup SIGINT SIGTERM
            
            # Wait for any process to exit
            wait
        fi
    fi
}

run_all_tmux() {
    SESSION="hyperloop-dev"
    
    # Kill existing session if it exists
    tmux kill-session -t $SESSION 2>/dev/null || true
    
    # Create new session with backend
    tmux new-session -d -s $SESSION -n backend "cd '$PROJECT_ROOT/backend/cmd' && go run ."
    
    # Create windows for other services
    tmux new-window -t $SESSION -n ethernet-view "cd '$PROJECT_ROOT/ethernet-view' && npm run dev"
    tmux new-window -t $SESSION -n control-station "cd '$PROJECT_ROOT/control-station' && npm run dev"
    tmux new-window -t $SESSION -n packet-sender "cd '$PROJECT_ROOT/packet-sender' && go run ."
    
    # Attach to session
    echo -e "${GREEN}Starting all services in tmux session '$SESSION'${NC}"
    echo -e "${YELLOW}Use 'tmux attach -t $SESSION' to reconnect${NC}"
    tmux attach-session -t $SESSION
}

run_tests() {
    echo -e "${YELLOW}Running tests...${NC}"
    
    safe_cd "$PROJECT_ROOT/backend"
    echo "🧪 Running backend tests..."
    go test -v ./...
    
    echo -e "${GREEN}✅ All tests completed${NC}"
}

build_all() {
    safe_cd "$PROJECT_ROOT"
    echo -e "${YELLOW}Building all components...${NC}"
    
    # Check if make is available
    if command -v make >/dev/null 2>&1; then
        make all
    else
        echo -e "${YELLOW}Make not found, building components individually...${NC}"
        
        # Build backend
        echo "Building backend..."
        safe_cd "$PROJECT_ROOT/backend"
        go build -o backend cmd/main.go cmd/config.go cmd/pid.go cmd/trace.go
        
        # Build common-front
        echo "Building common-front..."
        safe_cd "$PROJECT_ROOT/common-front"
        npm run build
        
        # Build other frontends
        echo "Building ethernet-view..."
        safe_cd "$PROJECT_ROOT/ethernet-view"
        npm run build
        
        echo "Building control-station..."
        safe_cd "$PROJECT_ROOT/control-station"
        npm run build
    fi
    
    echo -e "${GREEN}✅ Build complete!${NC}"
}

# Main script logic
print_header
check_dependencies

case "${1:-}" in
    setup)
        setup_project
        ;;
    backend)
        run_backend
        ;;
    ethernet)
        run_ethernet_view
        ;;
    control)
        run_control_station
        ;;
    packet)
        run_packet_sender
        ;;
    all)
        run_all_services
        ;;
    test)
        run_tests
        ;;
    build)
        build_all
        ;;
    "")
        print_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        print_usage
        exit 1
        ;;
esac