# 🎯 Simple Development Mode - Clean & Straightforward

## ✅ **New Simplified Architecture**

You were absolutely right! The previous approach was overcomplicated. Here's the new clean solution:

### **Configuration (config.toml)**
```toml
[dev]
# Simple boolean flag for dev mode
dev_mode = true

# Dev server ports (only used when dev_mode = true)
control_station_port = 5173
ethernet_view_port = 5174

# Production server config (unchanged)
[server.control-station]
address = "127.0.0.1:4000"

[server.ethernet-view]
address = "127.0.0.1:4040"
```

## 🚀 **How It Works**

### **Development Mode** (dev_mode = true)
1. **Backend starts** on dev ports (5173/5174) with API endpoints
2. **Browser opens** 127.0.0.1:5173 and 127.0.0.1:5174 ✅
3. **Developer runs** `npm run dev` manually in separate terminals for hot reload
4. **Vite dev servers** can run on different ports and proxy to backend

### **Production Mode** (dev_mode = false)  
1. **Backend starts** on production ports (4000/4040) with static files + API
2. **Browser opens** 127.0.0.1:4000 and 127.0.0.1:4040 ✅
3. **No dev servers** needed

## 🔧 **Backend Logic**

```go
// Determine ports based on dev mode
if config.Dev.DevMode {
    // Use dev ports for backend (5173/5174)
    serverAddresses = map[string]string{
        "control-station": "127.0.0.1:5173",
        "ethernet-view":   "127.0.0.1:5174",
    }
} else {
    // Use production ports for backend (4000/4040)
    serverAddresses = map[string]string{
        "control-station": "127.0.0.1:4000", 
        "ethernet-view":   "127.0.0.1:4040",
    }
}

// Browser always opens the same URLs as backend
frontendURLs = serverAddresses
```

## 🎯 **Benefits**

1. **✅ Simple Configuration**: Just one `dev_mode` boolean flag
2. **✅ Consistent URLs**: Browser always opens where backend is running
3. **✅ No Complex Process Management**: No automatic dev server startup
4. **✅ Developer Choice**: Run dev servers manually when needed
5. **✅ Clean Separation**: Dev and prod modes are clearly distinct
6. **✅ No Port Conflicts**: Dev and prod use different ports

## 🧪 **Usage**

### **Development Workflow:**
```bash
# 1. Set dev_mode = true in config.toml
# 2. Start backend
./control-station.sh
# Backend starts on 5173/5174, browser opens 5173/5174

# 3. (Optional) Start dev servers for hot reload in separate terminals
cd control-station && npm run dev -- --port 3000
cd ethernet-view && npm run dev -- --port 3001
# Dev servers can use any free ports and proxy to backend
```

### **Production Workflow:**
```bash
# 1. Set dev_mode = false in config.toml  
# 2. Start backend
./control-station.sh
# Backend starts on 4000/4040, browser opens 4000/4040
# Static files served directly, no dev servers needed
```

## 🎉 **Result**

**No more 404 errors!** The browser now opens the correct URLs:

- **Dev mode**: Opens 5173/5174 where backend APIs are running
- **Prod mode**: Opens 4000/4040 where backend + static files are running
- **Consistent**: Same URL = same backend = no confusion
- **Simple**: One flag controls everything

This is exactly what you suggested - clean, simple, and effective! 🚀