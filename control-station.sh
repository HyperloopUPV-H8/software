#!/bin/bash

# Hyperloop Control Station Launcher
# Professional single-click application startup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend/cmd"
BACKEND_BINARY="$BACKEND_DIR/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚄 Hyperloop UPV Control Station${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Check if backend binary exists
if [ ! -f "$BACKEND_BINARY" ]; then
    echo -e "${YELLOW}⚠️  Backend binary not found. Building...${NC}"
    cd "$BACKEND_DIR"
    
    # Check if Go is installed
    if ! command -v go &> /dev/null; then
        echo -e "${RED}❌ Go is not installed. Please install Go and try again.${NC}"
        exit 1
    fi
    
    # Build backend
    echo -e "${BLUE}🔨 Building backend...${NC}"
    go build -o backend .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build backend${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Backend binary found${NC}"
fi

# Check if Node.js/npm is available for development servers
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ npm found - development servers available${NC}"
else
    echo -e "${YELLOW}⚠️  npm not found - using static serving only${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Starting Hyperloop Control Station...${NC}"
echo -e "${BLUE}   • Backend server will start${NC}"
echo -e "${BLUE}   • Frontend will open automatically${NC}"
echo -e "${BLUE}   • Close the browser to shut down${NC}"
echo ""

# Change to backend directory and start
cd "$BACKEND_DIR"

# Trap signals to clean up properly
trap 'echo -e "\n${YELLOW}👋 Shutting down Hyperloop Control Station...${NC}"; exit 0' INT TERM

# Start the backend (which will handle frontend startup)
echo -e "${GREEN}🟢 Starting backend server...${NC}"
./backend

echo -e "${GREEN}✅ Hyperloop Control Station shut down successfully${NC}"