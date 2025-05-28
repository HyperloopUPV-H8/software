{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "hyperloop-h10-dev";
  
  buildInputs = with pkgs; [
    # Go development
    go
    gotools
    gopls
    
    # Node.js development
    nodejs
    nodePackages.npm
    nodePackages.typescript
    
    # Python for testadj
    python3
    
    # System dependencies
    libpcap
    pkg-config
    
    # Build tools
    gnumake
    gcc
    
    # Utilities
    git
    ripgrep
    jq
    curl
    wget
    
    # Shell enhancements
    starship
    eza
    bat
    fzf
  ];
  
  shellHook = ''
    echo "🚄 Hyperloop H10 Development Environment"
    echo "📁 Repository root: $(pwd)"
    echo ""
    echo "Available commands:"
    echo "  make all        - Build all components"
    echo "  make backend    - Build Go backend"
    echo "  make common-front - Build shared component library"
    echo "  make control-station - Build main control interface"
    echo "  make ethernet-view - Build network monitoring interface"
    echo ""
    echo "Development servers:"
    echo "  cd backend/cmd && ./backend         - Run backend (after building)"
    echo "  cd control-station && npm run dev   - Run control station"
    echo "  cd ethernet-view && npm run dev     - Run ethernet view"
    echo "  cd packet-sender && go run .        - Run packet sender"
    echo ""
    
    # Setup Node modules if needed
    if [ ! -d "common-front/node_modules" ]; then
      echo "📦 Installing common-front dependencies..."
      (cd common-front && npm install)
    fi
    
    if [ ! -d "ethernet-view/node_modules" ]; then
      echo "📦 Installing ethernet-view dependencies..."
      (cd ethernet-view && npm install)
    fi
    
    if [ ! -d "control-station/node_modules" ]; then
      echo "📦 Installing control-station dependencies..."
      (cd control-station && npm install)
    fi
    
    # Set up starship prompt if available
    if command -v starship >/dev/null 2>&1; then
      eval "$(starship init bash)"
    fi
  '';
  
  # Environment variables
  GOPATH = "$HOME/go";
  NODE_ENV = "development";
}