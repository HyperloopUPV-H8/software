// INSTRUCTIONS FOR COMPLETING THE APP:
// The app is mostly complete. Here's what needs to be manually added:

// 1. In app.js around line 570-577, replace the config and Plotly.newPlot section with:
/*
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['select2d', 'lasso2d'],
        toImageButtonOptions: {
            format: 'svg',
            width: 1200,
            height: 800,
            scale: 1
        }
    };
    
    Plotly.newPlot(container, traces, layout, config);
    
    // Add resize functionality
    makeResizable(container);
*/

// 2. In app.js around line 483-496, replace the wrapper.innerHTML template with:
/*
        wrapper.innerHTML = `
            <div class="plot-wrapper-header">
                <div class="plot-wrapper-title">${plot.name}</div>
                <div class="plot-actions">
                    <button class="icon-btn" onclick="exportPlotSVG('${plotId}')" title="Export SVG (vector)">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </button>
                    <button class="icon-btn" onclick="exportPlotPNG('${plotId}')" title="Export PNG (high-res)">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="plot-container resizable" id="${plotId}" style="height: 600px;">
                <div class="resize-handle"></div>
            </div>
        `;
*/

// 3. In app.js around line 601-611, replace the exportPlot function and add new functions:
/*
function exportPlotSVG(plotId) {
    const plotElement = document.getElementById(plotId);
    if (!plotElement) return;
    
    Plotly.downloadImage(plotElement, {
        format: 'svg',
        width: 1200,
        height: 800,
        filename: `plot_${plotId}_${Date.now()}`
    });
}

function exportPlotPNG(plotId) {
    const plotElement = document.getElementById(plotId);
    if (!plotElement) return;
    
    Plotly.downloadImage(plotElement, {
        format: 'png',
        width: 2400,
        height: 1600,
        scale: 2,
        filename: `plot_${plotId}_${Date.now()}`
    });
}

// ===== RESIZE FUNCTIONALITY =====
function makeResizable(container) {
    const wrapper = container.parentElement;
    const handle = container.querySelector('.resize-handle');
    if (!handle) return;
    
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = container.offsetHeight;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const delta = e screenY - startY;
        const newHeight = Math.max(300, startHeight + delta);
        container.style.height = newHeight + 'px';
        
        // Trigger Plotly resize
        Plotly.Plots.resize(container);
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}
*/

// USAGE INSTRUCTIONS:
// 1. Click upload zone normally to select a folder
// 2. Shift+click to select individual files
// 3. Drag & drop folders or files
// 4. Click sidebar toggle button (≡) to collapse/expand sidebar
// 5. Drag the resize handle at bottom of each plot to adjust height
// 6. First button exports SVG (vector, perfect for LaTeX)
// 7. Second button exports PNG at 2400x1600 (high resolution for print)
// 8. Time is now in milliseconds (not converted to seconds)
