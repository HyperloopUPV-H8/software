#!/bin/bash
# Development environment setup script

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Detect OS
OS="unknown"
case "$(uname -s)" in
    Linux*)     OS="linux";;
    Darwin*)    OS="macos";;
    CYGWIN*|MINGW*|MSYS*) OS="windows";;
    *)          OS="unknown";;
esac

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${GREEN}🚄 Hyperloop H10 Development Environment${NC}"
    echo -e "${GREEN}=======================================${NC}"
    echo -e "${YELLOW}OS: $OS${NC}"
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
    echo "  all         - Run all services (requires tmux)"
    echo "  test        - Run all tests"
    echo "  build       - Build all components"
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
        exit 1
    fi
}

setup_project() {
    echo -e "${YELLOW}Setting up project dependencies...${NC}"

    cd "$PROJECT_ROOT"

    # Build common-front first
    echo "📦 Building common-front..."
    cd common-front
    npm install
    npm run build

    # Install ethernet-view dependencies
    echo "📦 Installing ethernet-view dependencies..."
    cd ../ethernet-view
    npm install

    # Install control-station dependencies
    echo "📦 Installing control-station dependencies..."
    cd ../control-station
    npm install

    # Download Go dependencies
    echo "📦 Downloading Go dependencies..."
    cd ../backend
    go mod download

    cd ../packet-sender
    go mod download

    echo -e "${GREEN}✅ Setup complete!${NC}"
}

run_backend() {
    cd "$PROJECT_ROOT/backend/cmd"
    echo -e "${YELLOW}Starting backend server...${NC}"
    go run .
}

run_ethernet_view() {
    cd "$PROJECT_ROOT/ethernet-view"
    echo -e "${YELLOW}Starting ethernet-view dev server...${NC}"
    npm run dev
}

run_control_station() {
    cd "$PROJECT_ROOT/control-station"
    echo -e "${YELLOW}Starting control-station dev server...${NC}"
    npm run dev
}

run_packet_sender() {
    cd "$PROJECT_ROOT/packet-sender"
    echo -e "${YELLOW}Starting packet-sender...${NC}"
    go run .
}

run_all_tmux() {
    if [ "$OS" = "windows" ]; then
        echo -e "${YELLOW}Note: Running all services in parallel on Windows...${NC}"
        echo -e "${YELLOW}Use Ctrl+C to stop all services${NC}"
        
        # Start all services in background
        (cd "$PROJECT_ROOT/backend/cmd" && go run .) &
        PID_BACKEND=$!
        
        (cd "$PROJECT_ROOT/ethernet-view" && npm run dev) &
        PID_ETHERNET=$!
        
        (cd "$PROJECT_ROOT/control-station" && npm run dev) &
        PID_CONTROL=$!
        
        (cd "$PROJECT_ROOT/packet-sender" && go run .) &
        PID_PACKET=$!
        
        echo -e "${GREEN}All services started. PIDs: Backend=$PID_BACKEND, Ethernet=$PID_ETHERNET, Control=$PID_CONTROL, Packet=$PID_PACKET${NC}"
        
        # Wait for any process to exit or Ctrl+C
        wait
        
        # Kill all background processes
        kill $PID_BACKEND $PID_ETHERNET $PID_CONTROL $PID_PACKET 2>/dev/null || true
        echo -e "${YELLOW}All services stopped${NC}"
        return
    fi

    if ! command -v tmux >/dev/null 2>&1; then
        echo -e "${RED}Error: tmux is required to run all services on Unix systems${NC}"
        echo -e "${YELLOW}Tip: Install tmux or run services individually${NC}"
        exit 1
    fi

    SESSION="hyperloop-dev"

    # Kill existing session if it exists
    tmux kill-session -t $SESSION 2>/dev/null || true

    # Create new session with backend
    tmux new-session -d -s $SESSION -n backend "cd $PROJECT_ROOT/backend/cmd && go run ."

    # Create windows for other services
    tmux new-window -t $SESSION -n ethernet-view "cd $PROJECT_ROOT/ethernet-view && npm run dev"
    tmux new-window -t $SESSION -n control-station "cd $PROJECT_ROOT/control-station && npm run dev"
    tmux new-window -t $SESSION -n packet-sender "cd $PROJECT_ROOT/packet-sender && go run ."

    # Attach to session
    echo -e "${GREEN}Starting all services in tmux session '$SESSION'${NC}"
    tmux attach-session -t $SESSION
}

run_tests() {
    echo -e "${YELLOW}Running tests...${NC}"

    cd "$PROJECT_ROOT/backend"
    echo "🧪 Running backend tests..."
    go test -v ./...

    # Add more test commands as needed
}

build_all() {
    cd "$PROJECT_ROOT"
    echo -e "${YELLOW}Building all components...${NC}"
    make all
}

# Main script logic
print_header
check_dependencies

case "${1}" in
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
        run_all_tmux
        ;;
    test)
        run_tests
        ;;
    build)
        build_all
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
