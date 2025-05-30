# Development Setup

This guide provides multiple ways to set up your development environment for the Hyperloop H10 project.

## Quick Start (Recommended)

### Option 1: Using the Development Script (Standard)

```bash
# Install dependencies and setup
./scripts/dev.sh setup

# Run individual services
./scripts/dev.sh backend      # Run backend server
./scripts/dev.sh ethernet     # Run ethernet-view
./scripts/dev.sh control      # Run control-station
./scripts/dev.sh packet       # Run packet-sender

# Run all services in tmux
./scripts/dev.sh all
```

### Option 2: Using Docker Compose

```bash
# Run all services
docker-compose -f docker-compose.dev.yml up

# Run specific service
docker-compose -f docker-compose.dev.yml up backend
```

### Option 3: Manual Setup

```bash
# 1. Build common-front first (required)
cd common-front
npm install
npm run build

# 2. Install frontend dependencies
cd ../ethernet-view
npm install

cd ../control-station
npm install

# 3. Run services
cd backend/cmd && go run .              # Terminal 1
cd ethernet-view && npm run dev         # Terminal 2
cd control-station && npm run dev       # Terminal 3
cd packet-sender && go run .            # Terminal 4
```

### Option 4: Using Nix (Advanced)

For developers who prefer Nix for reproducible environments:

```bash
# Pure shell with Fish
nix-shell

# Or with your existing shell config
nix-shell -A impure
```

This provides a fully reproducible development environment with all dependencies.

## Prerequisites

- Go 1.21+
- Node.js 18+
- npm
- libpcap (for packet capture)
  - macOS: `brew install libpcap`
  - Ubuntu: `sudo apt-get install libpcap-dev`
  - Windows: Install WinPcap or Npcap

## Service Ports

- Backend: 8080
- Control Station: 5173
- Ethernet View: 5174

## Common Tasks

### Run Tests
```bash
./scripts/dev.sh test
# or manually:
cd backend && go test -v ./...
```

### Build All Components
```bash
make all
```

### Update Dependencies
```bash
# Go dependencies
cd backend && go mod tidy

# Node dependencies
cd common-front && npm update
cd control-station && npm update
cd ethernet-view && npm update
```

## Troubleshooting

1. **Permission denied on macOS/Linux for packet capture**:
   ```bash
   sudo setcap cap_net_raw+ep $(which go)
   ```

2. **Common-front not found errors**:
   Make sure to build common-front first:
   ```bash
   cd common-front && npm install && npm run build
   ```

3. **Port already in use**:
   Check and kill processes using the ports:
   ```bash
   lsof -i :8080  # backend
   lsof -i :5173  # control-station
   lsof -i :5174  # ethernet-view
   ```