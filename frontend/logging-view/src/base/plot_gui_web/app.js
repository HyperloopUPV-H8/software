// ===== STATE MANAGEMENT =====
const state = {
    files: new Map(), // fileName -> { name, data: [{time, value}], pointCount }
    operations: new Map(), // opId -> { id, name, type, signalA, signalB, data }
    transforms: new Map(), // transformId -> { id, name, sourceSignal, expression, data }
    plots: new Map(), // plotId -> { id, name, signals: [{signalId, yAxis: 'left'|'right', showFFT: false}] }
    plotCounter: 0,
    operationCounter: 0,
    transformCounter: 0,
    sidebarCollapsed: true
};

// ===== UTILITY FUNCTIONS =====
function parseCSV(text, fileName) {
    const lines = text.trim().split('\n');
    const data = [];

    for (const line of lines) {
        const parts = line.split(',');
        if (parts.length >= 4) {
            const timestamp = parseFloat(parts[0]);
            const value = parseFloat(parts[3]);

            if (!isNaN(timestamp) && !isNaN(value)) {
                data.push({ time: timestamp, value });
            }
        }
    }

    // Normalize time to start at 0 (keep milliseconds, don't convert to seconds yet)
    if (data.length > 0) {
        const startTime = data[0].time;
        data.forEach(point => {
            point.time = point.time - startTime; // Keep in milliseconds
        });
    }

    return data;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function getAllSignals() {
    const signals = [];

    // Add raw files
    state.files.forEach((file, fileName) => {
        signals.push({ id: fileName, name: fileName, type: 'file' });
    });

    // Add calculated signals (operations)
    state.operations.forEach(op => {
        signals.push({ id: op.id, name: op.name, type: 'operation' });
    });

    // Add transforms
    state.transforms.forEach(tr => {
        signals.push({ id: tr.id, name: tr.name, type: 'transform' });
    });

    return signals;
}

function getSignalData(signalId) {
    // Check if it's a file
    if (state.files.has(signalId)) {
        return state.files.get(signalId).data;
    }

    // Check if it's an operation
    if (state.operations.has(signalId)) {
        return state.operations.get(signalId).data;
    }

    // Check if it's a transform
    if (state.transforms.has(signalId)) {
        return state.transforms.get(signalId).data;
    }

    return null;
}

// ===== FFT COMPUTATION =====
// Global FFT sample rate override (null = auto-detect from timestamps)
let fftSampleRateOverride = null; // Hz, e.g. 1000 for 1kHz

function setFFTSampleRate(rateHz) {
    fftSampleRateOverride = rateHz;
    console.log(`FFT sample rate set to: ${rateHz ? rateHz + 'Hz' : 'auto-detect'}`);
    console.log('Re-rendering all plots with new sample rate...');
    // Re-render all plots to update FFT
    renderAllPlots();
    console.log('Plots re-rendered.');
}

function computeFFT(data) {
    // Pad to next power of 2 for efficient FFT
    const n = data.length;
    const nextPow2 = Math.pow(2, Math.ceil(Math.log2(n)));

    // Create complex array (real, imag pairs)
    const real = new Array(nextPow2).fill(0);
    const imag = new Array(nextPow2).fill(0);

    // Copy data to real part
    for (let i = 0; i < n; i++) {
        real[i] = data[i].value;
    }

    // Cooley-Tukey FFT (in-place, radix-2)
    fftInPlace(real, imag, nextPow2);

    // Calculate sample rate
    let sampleRate;
    if (fftSampleRateOverride && fftSampleRateOverride > 0) {
        sampleRate = fftSampleRateOverride;
        console.log(`FFT: ${n} samples, using manual Fs=${sampleRate}Hz, Nyquist=${sampleRate / 2}Hz`);
    } else {
        const dt = (data[data.length - 1].time - data[0].time) / (data.length - 1); // ms
        sampleRate = 1000 / dt; // Hz
        console.log(`FFT: ${n} samples, dt=${dt.toFixed(3)}ms, auto Fs=${sampleRate.toFixed(1)}Hz, Nyquist=${(sampleRate / 2).toFixed(1)}Hz`);
    }

    // Build frequency-magnitude result (only positive frequencies)
    const result = [];
    const halfN = nextPow2 / 2;

    for (let i = 0; i < halfN; i++) {
        const freq = (i * sampleRate) / nextPow2;
        const magnitude = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / n;
        result.push({ frequency: freq, magnitude: magnitude });
    }

    return result;
}

function fftInPlace(real, imag, n) {
    // Bit-reversal permutation
    let j = 0;
    for (let i = 0; i < n - 1; i++) {
        if (i < j) {
            [real[i], real[j]] = [real[j], real[i]];
            [imag[i], imag[j]] = [imag[j], imag[i]];
        }
        let k = n / 2;
        while (k <= j) {
            j -= k;
            k /= 2;
        }
        j += k;
    }

    // Cooley-Tukey iterative FFT
    for (let len = 2; len <= n; len *= 2) {
        const halfLen = len / 2;
        const angle = -2 * Math.PI / len;
        const wReal = Math.cos(angle);
        const wImag = Math.sin(angle);

        for (let i = 0; i < n; i += len) {
            let curReal = 1;
            let curImag = 0;

            for (let j = 0; j < halfLen; j++) {
                const uReal = real[i + j];
                const uImag = imag[i + j];
                const tReal = curReal * real[i + j + halfLen] - curImag * imag[i + j + halfLen];
                const tImag = curReal * imag[i + j + halfLen] + curImag * real[i + j + halfLen];

                real[i + j] = uReal + tReal;
                imag[i + j] = uImag + tImag;
                real[i + j + halfLen] = uReal - tReal;
                imag[i + j + halfLen] = uImag - tImag;

                const nextReal = curReal * wReal - curImag * wImag;
                const nextImag = curReal * wImag + curImag * wReal;
                curReal = nextReal;
                curImag = nextImag;
            }
        }
    }
}

// ===== SIGNAL TRANSFORMS =====
function applyTransform(data, expression) {
    // Safe math expression evaluator
    const safeEval = (expr, x) => {
        // Replace common patterns
        let processed = expr
            .replace(/\^/g, '**')  // Power operator
            .replace(/(\d)x/g, '$1*x')  // 2x -> 2*x
            .replace(/x(\d)/g, 'x*$1')  // x2 -> x*2
            .replace(/\babs\b/g, 'Math.abs')
            .replace(/\bsin\b/g, 'Math.sin')
            .replace(/\bcos\b/g, 'Math.cos')
            .replace(/\btan\b/g, 'Math.tan')
            .replace(/\bsqrt\b/g, 'Math.sqrt')
            .replace(/\blog\b/g, 'Math.log')
            .replace(/\blog10\b/g, 'Math.log10')
            .replace(/\bexp\b/g, 'Math.exp')
            .replace(/\bpi\b/gi, 'Math.PI')
            .replace(/\be\b/g, 'Math.E');

        try {
            // Create a safe function that only has access to x and Math
            const fn = new Function('x', 'Math', `return (${processed})`);
            return fn(x, Math);
        } catch (e) {
            return NaN;
        }
    };

    return data.map(point => ({
        time: point.time,
        value: safeEval(expression, point.value)
    })).filter(p => isFinite(p.value));
}

// ===== NOISE ANALYSIS FUNCTIONS =====

// Basic statistical functions
function mean(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function variance(arr) {
    if (arr.length === 0) return 0;
    const m = mean(arr);
    return arr.reduce((sum, val) => sum + (val - m) ** 2, 0) / arr.length;
}

function stdDev(arr) {
    return Math.sqrt(variance(arr));
}

function rms(arr) {
    if (arr.length === 0) return 0;
    return Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0) / arr.length);
}

// Compute comprehensive noise statistics for a data range
function computeNoiseStats(data, startTime = null, endTime = null) {
    let values;
    if (startTime !== null && endTime !== null) {
        values = data.filter(p => p.time >= startTime && p.time <= endTime).map(p => p.value);
    } else {
        values = data.map(p => p.value);
    }

    if (values.length === 0) return null;

    const m = mean(values);
    const std = stdDev(values);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    return {
        count: values.length,
        mean: m,
        std: std,
        rms: rms(values),
        min: minVal,
        max: maxVal,
        peakToPeak: maxVal - minVal,
        variance: variance(values)
    };
}

// Compute derivative of signal (rate of change)
function computeDerivative(data) {
    if (data.length < 2) return [];

    const result = [];
    for (let i = 1; i < data.length; i++) {
        const dt = data[i].time - data[i - 1].time;
        if (dt > 0) {
            const derivative = (data[i].value - data[i - 1].value) / dt;
            result.push({
                time: (data[i].time + data[i - 1].time) / 2,
                value: derivative
            });
        }
    }
    return result;
}

// Compute absolute derivative (magnitude of change)
function computeAbsDerivative(data) {
    return computeDerivative(data).map(p => ({
        time: p.time,
        value: Math.abs(p.value)
    }));
}

// Detect motion regions based on derivative threshold
function detectMotionRegions(data, threshold) {
    const deriv = computeAbsDerivative(data);
    const regions = [];
    let inMotion = false;
    let regionStart = null;

    for (let i = 0; i < deriv.length; i++) {
        if (deriv[i].value > threshold && !inMotion) {
            inMotion = true;
            regionStart = deriv[i].time;
        } else if (deriv[i].value <= threshold && inMotion) {
            inMotion = false;
            regions.push({ start: regionStart, end: deriv[i].time, type: 'motion' });
        }
    }

    if (inMotion && regionStart !== null) {
        regions.push({ start: regionStart, end: deriv[deriv.length - 1].time, type: 'motion' });
    }

    return regions;
}

// Estimate noise floor from static regions
function estimateNoiseFloor(data, windowSize = 100) {
    // Find regions with lowest variance (likely static)
    const windows = [];

    for (let i = 0; i < data.length - windowSize; i += Math.floor(windowSize / 2)) {
        const windowData = data.slice(i, i + windowSize).map(p => p.value);
        const v = variance(windowData);
        windows.push({
            start: data[i].time,
            end: data[i + windowSize - 1].time,
            variance: v,
            std: Math.sqrt(v)
        });
    }

    // Sort by variance and take lowest 20% as "static" regions
    windows.sort((a, b) => a.variance - b.variance);
    const staticWindows = windows.slice(0, Math.max(1, Math.floor(windows.length * 0.2)));

    // Average noise floor from static regions
    const avgNoiseFloor = mean(staticWindows.map(w => w.std));

    return {
        noiseFloor: avgNoiseFloor,
        staticRegions: staticWindows,
        allWindows: windows
    };
}

// Windowed statistics for visualization
function computeWindowedStats(data, windowMs = 50) {
    const result = [];
    const windowSize = Math.max(1, Math.floor(windowMs / ((data[data.length - 1].time - data[0].time) / data.length)));

    for (let i = 0; i < data.length - windowSize; i++) {
        const windowData = data.slice(i, i + windowSize).map(p => p.value);
        result.push({
            time: data[i + Math.floor(windowSize / 2)].time,
            rms: rms(windowData),
            std: stdDev(windowData),
            peakToPeak: Math.max(...windowData) - Math.min(...windowData)
        });
    }

    return result;
}
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    sidebar.classList.toggle('collapsed');

    // Trigger resize after transition (300ms matches CSS transition)
    setTimeout(() => {
        state.plots.forEach(plot => {
            const container = document.getElementById(plot.id);
            if (container) Plotly.Plots.resize(container);
        });
    }, 310);
});

// ===== FILE HANDLING =====
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput'); // Folder input
const fileInputFiles = document.getElementById('fileInputFiles'); // Files input
const fileList = document.getElementById('fileList');

uploadZone.addEventListener('click', (e) => {
    // Click to browse for files
    fileInput.click();
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');

    const items = e.dataTransfer.items;
    const files = [];

    // Handle both files and folders
    for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
            if (item.isFile) {
                items[i].getAsFile() && files.push(items[i].getAsFile());
            } else if (item.isDirectory) {
                readDirectory(item, files);
            }
        }
    }

    // Fallback for simple file drop
    if (files.length === 0) {
        handleFiles(e.dataTransfer.files);
    } else {
        setTimeout(() => handleFiles(files), 100);
    }
});

function readDirectory(directoryEntry, files) {
    const reader = directoryEntry.createReader();
    reader.readEntries((entries) => {
        entries.forEach(entry => {
            if (entry.isFile && entry.name.endsWith('.csv')) {
                entry.file(file => files.push(file));
            } else if (entry.isDirectory) {
                readDirectory(entry, files);
            }
        });
    });
}

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

fileInputFiles.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.name.endsWith('.csv')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = parseCSV(e.target.result, file.name);
            state.files.set(file.name, {
                name: file.name,
                data: data,
                pointCount: data.length
            });
            renderFileList();
            updateOperationSelects();
            renderPlotControls();  // Update plot dropdowns with new signals
        };
        reader.readAsText(file);
    });
}

function renderFileList() {
    if (state.files.size === 0) {
        fileList.innerHTML = '';
        return;
    }

    fileList.innerHTML = Array.from(state.files.values()).map(file => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">${formatNumber(file.pointCount)} points</div>
            </div>
            <div class="file-actions">
                <button class="icon-btn danger" onclick="removeFile('${file.name}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function removeFile(fileName) {
    state.files.delete(fileName);

    // Remove from all plots
    state.plots.forEach(plot => {
        plot.signals = plot.signals.filter(s => s !== fileName);
    });

    renderFileList();
    renderAllPlots();
    updateOperationSelects();
}

// ===== OPERATIONS =====
const addOperationBtn = document.getElementById('addOperationBtn');
const operationModal = document.getElementById('operationModal');
const closeModal = document.getElementById('closeModal');
const cancelOperation = document.getElementById('cancelOperation');
const createOperation = document.getElementById('createOperation');
const operationsList = document.getElementById('operationsList');

addOperationBtn.addEventListener('click', () => {
    operationModal.classList.add('active');
    updateOperationSelects();
});

closeModal.addEventListener('click', () => operationModal.classList.remove('active'));
cancelOperation.addEventListener('click', () => operationModal.classList.remove('active'));

operationModal.addEventListener('click', (e) => {
    if (e.target === operationModal) {
        operationModal.classList.remove('active');
    }
});

createOperation.addEventListener('click', () => {
    const name = document.getElementById('opName').value.trim();
    const type = document.getElementById('opType').value;
    const signalA = document.getElementById('opSignalA').value;
    const signalB = document.getElementById('opSignalB').value;

    if (!name || !signalA || !signalB) {
        alert('Please fill all fields');
        return;
    }

    if (signalA === signalB) {
        alert('Please select different signals');
        return;
    }

    const dataA = getSignalData(signalA);
    const dataB = getSignalData(signalB);

    if (!dataA || !dataB) {
        alert('Error loading signal data');
        return;
    }

    // Perform operation
    const result = performOperation(dataA, dataB, type);

    const opId = `op_${state.operationCounter++}`;
    state.operations.set(opId, {
        id: opId,
        name,
        type,
        signalA,
        signalB,
        data: result
    });

    renderOperationsList();
    operationModal.classList.remove('active');

    // Clear form
    document.getElementById('opName').value = '';
    document.getElementById('opSignalA').value = '';
    document.getElementById('opSignalB').value = '';
});

function performOperation(dataA, dataB, type) {
    // Find common time range
    const minTime = Math.max(dataA[0].time, dataB[0].time);
    const maxTime = Math.min(dataA[dataA.length - 1].time, dataB[dataB.length - 1].time);

    // OPTIMIZED: Use adaptive time step based on signal sampling rates
    // Calculate average sampling interval for both signals
    const avgDtA = (dataA[dataA.length - 1].time - dataA[0].time) / (dataA.length - 1);
    const avgDtB = (dataB[dataB.length - 1].time - dataB[0].time) / (dataB.length - 1);
    // Use the finer resolution of the two (but not less than 1ms)
    const dt = Math.max(1, Math.min(avgDtA, avgDtB));

    const result = [];
    let idxA = 0;
    let idxB = 0;

    for (let t = minTime; t <= maxTime; t += dt) {
        // Find surrounding points for A and B
        while (idxA < dataA.length - 1 && dataA[idxA + 1].time < t) idxA++;
        while (idxB < dataB.length - 1 && dataB[idxB + 1].time < t) idxB++;

        // Linear interpolation
        const valueA = interpolate(dataA, idxA, t);
        const valueB = interpolate(dataB, idxB, t);

        let resultValue;
        switch (type) {
            case 'subtract': resultValue = valueA - valueB; break;
            case 'add': resultValue = valueA + valueB; break;
            case 'multiply': resultValue = valueA * valueB; break;
            case 'divide': resultValue = valueB !== 0 ? valueA / valueB : 0; break;
            default: resultValue = 0;
        }

        result.push({ time: t, value: resultValue });
    }

    return result;
}

function interpolate(data, idx, t) {
    if (idx >= data.length - 1) return data[data.length - 1].value;

    const p1 = data[idx];
    const p2 = data[idx + 1];
    const ratio = (t - p1.time) / (p2.time - p1.time);

    return p1.value + ratio * (p2.value - p1.value);
}

function renderOperationsList() {
    if (state.operations.size === 0) {
        operationsList.innerHTML = '';
        return;
    }

    const opSymbols = {
        subtract: '−',
        add: '+',
        multiply: '×',
        divide: '÷'
    };

    operationsList.innerHTML = Array.from(state.operations.values()).map(op => {
        const signalAName = state.files.has(op.signalA)
            ? state.files.get(op.signalA).name
            : state.operations.get(op.signalA)?.name || 'Unknown';
        const signalBName = state.files.has(op.signalB)
            ? state.files.get(op.signalB).name
            : state.operations.get(op.signalB)?.name || 'Unknown';

        return `
            <div class="operation-item">
                <div class="operation-info">
                    <div class="operation-name">${op.name}</div>
                    <div class="operation-formula">${signalAName} ${opSymbols[op.type]} ${signalBName}</div>
                </div>
                <div class="file-actions">
                    <button class="icon-btn danger" onclick="removeOperation('${op.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function removeOperation(opId) {
    state.operations.delete(opId);

    // Remove from all plots
    state.plots.forEach(plot => {
        plot.signals = plot.signals.filter(s => s !== opId);
    });

    renderOperationsList();
    renderAllPlots();
}

function updateOperationSelects() {
    const signals = getAllSignals();
    const optionsHtml = '<option value="">Select signal...</option>' +
        signals.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    document.getElementById('opSignalA').innerHTML = optionsHtml;
    document.getElementById('opSignalB').innerHTML = optionsHtml;

    // Also update transform modal select
    const transformSelect = document.getElementById('trSignal');
    if (transformSelect) {
        transformSelect.innerHTML = optionsHtml;
    }
}

// ===== TRANSFORMS MANAGEMENT =====
const addTransformBtn = document.getElementById('addTransformBtn');
const transformModal = document.getElementById('transformModal');
const closeTransformModal = document.getElementById('closeTransformModal');
const cancelTransform = document.getElementById('cancelTransform');
const createTransform = document.getElementById('createTransform');
const transformsList = document.getElementById('transformsList');

if (addTransformBtn) {
    addTransformBtn.addEventListener('click', () => {
        transformModal.classList.add('active');
        updateOperationSelects();
    });
}

if (closeTransformModal) {
    closeTransformModal.addEventListener('click', () => transformModal.classList.remove('active'));
}
if (cancelTransform) {
    cancelTransform.addEventListener('click', () => transformModal.classList.remove('active'));
}

if (transformModal) {
    transformModal.addEventListener('click', (e) => {
        if (e.target === transformModal) {
            transformModal.classList.remove('active');
        }
    });
}

if (createTransform) {
    createTransform.addEventListener('click', () => {
        const name = document.getElementById('trName').value.trim();
        const sourceSignal = document.getElementById('trSignal').value;
        const expression = document.getElementById('trExpression').value.trim();

        if (!name || !sourceSignal || !expression) {
            alert('Please fill all fields');
            return;
        }

        const sourceData = getSignalData(sourceSignal);
        if (!sourceData) {
            alert('Error loading source signal data');
            return;
        }

        // Apply transform
        const result = applyTransform(sourceData, expression);

        if (result.length === 0) {
            alert('Transform produced no valid values. Check your expression.');
            return;
        }

        const trId = `tr_${state.transformCounter++}`;
        state.transforms.set(trId, {
            id: trId,
            name,
            sourceSignal,
            expression,
            data: result
        });

        renderTransformsList();
        transformModal.classList.remove('active');
        updateOperationSelects();

        // Clear form
        document.getElementById('trName').value = '';
        document.getElementById('trExpression').value = '';
    });
}

function renderTransformsList() {
    if (!transformsList) return;

    if (state.transforms.size === 0) {
        transformsList.innerHTML = '';
        return;
    }

    transformsList.innerHTML = Array.from(state.transforms.values()).map(tr => {
        const sourceName = state.files.has(tr.sourceSignal)
            ? state.files.get(tr.sourceSignal).name
            : state.operations.get(tr.sourceSignal)?.name || state.transforms.get(tr.sourceSignal)?.name || 'Unknown';

        return `
            <div class="transform-item">
                <div class="transform-info">
                    <div class="transform-name">${tr.name}</div>
                    <div class="transform-formula">f(${sourceName}) = ${tr.expression}</div>
                </div>
                <div class="file-actions">
                    <button class="icon-btn danger" onclick="removeTransform('${tr.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function removeTransform(trId) {
    state.transforms.delete(trId);

    // Remove from all plots
    state.plots.forEach(plot => {
        plot.signals = plot.signals.filter(s =>
            (typeof s === 'string' && s !== trId) ||
            (typeof s === 'object' && s.signalId !== trId)
        );
    });

    renderTransformsList();
    renderAllPlots();
    updateOperationSelects();
}

// ===== PLOT MANAGEMENT =====
const addPlotBtn = document.getElementById('addPlotBtn');
const plotsContainer = document.getElementById('plotsContainer');
const plotList = document.getElementById('plotList');

addPlotBtn.addEventListener('click', addPlot);

function addPlot() {
    const plotId = `plot_${state.plotCounter++}`;
    state.plots.set(plotId, {
        id: plotId,
        name: `Plot ${state.plots.size + 1}`,
        signals: []
    });

    renderPlotControls();
    renderPlot(plotId);
}

function renderPlotControls() {
    plotList.innerHTML = Array.from(state.plots.values()).map(plot => {
        const signals = getAllSignals();
        return `
            <div class="plot-control">
                <div class="plot-header">
                    <div class="plot-title">${plot.name}</div>
                    <button class="icon-btn danger" onclick="removePlot('${plot.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="signal-assignment">
                    ${plot.signals.map(sig => {
            const signalId = typeof sig === 'string' ? sig : sig.signalId;
            const yAxis = typeof sig === 'object' ? sig.yAxis : 'left';
            const showFFT = typeof sig === 'object' ? sig.showFFT : false;
            const signal = state.files.get(signalId) || state.operations.get(signalId) || state.transforms.get(signalId);
            return `
                            <div class="signal-item-extended">
                                <div class="signal-main">
                                    <span class="signal-name">${signal?.name || signalId}</span>
                                    <button class="icon-btn danger small" onclick="removeSignalFromPlot('${plot.id}', '${signalId}')">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div class="signal-options">
                                    <select class="input small" onchange="updateSignalAxis('${plot.id}', '${signalId}', this.value)" title="Y-Axis">
                                        <option value="left" ${yAxis === 'left' ? 'selected' : ''}>◀ Left</option>
                                        <option value="right" ${yAxis === 'right' ? 'selected' : ''}>Right ▶</option>
                                    </select>
                                    <label class="checkbox-label" title="Show FFT instead of time signal">
                                        <input type="checkbox" ${showFFT ? 'checked' : ''} onchange="toggleSignalFFT('${plot.id}', '${signalId}', this.checked)">
                                        FFT
                                    </label>
                                </div>
                            </div>
                        `;
        }).join('')}
                    <select class="input" onchange="addSignalToPlot('${plot.id}', this.value); this.value='';">
                        <option value="">+ Add signal...</option>
                        ${signals.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
    }).join('');
}

function addSignalToPlot(plotId, signalId) {
    if (!signalId) return;

    const plot = state.plots.get(plotId);
    // Check if signal already exists (handle both old string format and new object format)
    const exists = plot.signals.some(s =>
        (typeof s === 'string' && s === signalId) ||
        (typeof s === 'object' && s.signalId === signalId)
    );

    if (!exists) {
        plot.signals.push({ signalId, yAxis: 'left', showFFT: false });
        renderPlotControls();
        renderPlot(plotId);
    }
}

function removeSignalFromPlot(plotId, signalId) {
    const plot = state.plots.get(plotId);
    plot.signals = plot.signals.filter(s =>
        (typeof s === 'string' && s !== signalId) ||
        (typeof s === 'object' && s.signalId !== signalId)
    );
    renderPlotControls();
    renderPlot(plotId);
}

function updateSignalAxis(plotId, signalId, axis) {
    const plot = state.plots.get(plotId);
    const sig = plot.signals.find(s =>
        (typeof s === 'object' && s.signalId === signalId)
    );
    if (sig) {
        sig.yAxis = axis;
        renderPlot(plotId);
    }
}

function toggleSignalFFT(plotId, signalId, showFFT) {
    const plot = state.plots.get(plotId);
    const sig = plot.signals.find(s =>
        (typeof s === 'object' && s.signalId === signalId)
    );
    if (sig) {
        sig.showFFT = showFFT;
        renderPlot(plotId);
    }
}

function removePlot(plotId) {
    state.plots.delete(plotId);
    renderPlotControls();
    renderAllPlots();
}

function renderPlot(plotId) {
    const plot = state.plots.get(plotId);
    if (!plot) return;

    // Check if container exists
    let container = document.getElementById(plotId);
    if (!container) {
        // Remove empty state if it exists
        const emptyState = plotsContainer.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        // Create plot wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'plot-wrapper';
        wrapper.innerHTML = `
            <div class="plot-wrapper-header">
                <div class="plot-wrapper-title">${plot.name}</div>
                <div class="plot-actions">
                    <div class="zoom-controls">
                        <div class="axis-zoom" title="Y Left axis">
                            <span class="axis-label">Y◀</span>
                            <button class="btn-tiny" onclick="zoomAxis('${plotId}', 'y1', 'in')">+</button>
                            <button class="btn-tiny" onclick="zoomAxis('${plotId}', 'y1', 'out')">−</button>
                        </div>
                        <div class="axis-zoom" title="Y Right axis">
                            <span class="axis-label">Y▶</span>
                            <button class="btn-tiny" onclick="zoomAxis('${plotId}', 'y2', 'in')">+</button>
                            <button class="btn-tiny" onclick="zoomAxis('${plotId}', 'y2', 'out')">−</button>
                        </div>
                        <div class="axis-zoom" title="X axis">
                            <span class="axis-label">X</span>
                            <button class="btn-tiny" onclick="zoomAxis('${plotId}', 'x', 'in')">+</button>
                            <button class="btn-tiny" onclick="zoomAxis('${plotId}', 'x', 'out')">−</button>
                        </div>
                        <button class="btn-small" onclick="resetZoom('${plotId}')" title="Reset Zoom">⟲</button>
                    </div>
                    <button class="btn-small accent" onclick="showNoiseAnalysis('${plotId}')" title="Analyze Noise">📊 Stats</button>
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
            <div class="stats-panel" id="stats-${plotId}" style="display: none;">
                <div class="stats-header">
                    <span>Signal Statistics</span>
                    <button class="icon-btn small" onclick="hideNoiseAnalysis('${plotId}')">&times;</button>
                </div>
                <div class="stats-content" id="stats-content-${plotId}"></div>
            </div>
        `;
        plotsContainer.appendChild(wrapper);
        container = document.getElementById(plotId);
    }

    // Determine if we need dual Y-axis
    const hasRightAxis = plot.signals.some(s => typeof s === 'object' && s.yAxis === 'right');
    const hasFFT = plot.signals.some(s => typeof s === 'object' && s.showFFT);

    // Prepare traces
    const traces = plot.signals.map(sig => {
        const signalId = typeof sig === 'string' ? sig : sig.signalId;
        const yAxis = typeof sig === 'object' ? sig.yAxis : 'left';
        const showFFT = typeof sig === 'object' ? sig.showFFT : false;

        const data = getSignalData(signalId);
        if (!data || data.length < 2) return null;

        const signal = state.files.get(signalId) || state.operations.get(signalId) || state.transforms.get(signalId);

        // Remove .csv extension from legend name
        let displayName = signal?.name || signalId;
        if (displayName.endsWith('.csv')) {
            displayName = displayName.slice(0, -4);
        }

        if (showFFT) {
            // Compute and plot FFT
            const fftData = computeFFT(data);
            displayName += ' (FFT)';
            return {
                x: fftData.map(p => p.frequency),
                y: fftData.map(p => p.magnitude),
                type: 'scatter',
                mode: 'lines',
                name: displayName,
                line: { width: 2 },
                yaxis: yAxis === 'right' ? 'y2' : 'y'
            };
        } else {
            return {
                x: data.map(p => p.time),
                y: data.map(p => p.value),
                type: 'scatter',
                mode: 'lines',
                name: displayName,
                line: { width: 2.5 },
                yaxis: yAxis === 'right' ? 'y2' : 'y'
            };
        }
    }).filter(t => t !== null);

    // Determine X-axis label
    const xAxisLabel = hasFFT ? 'Frequency (Hz)' : 'Time (ms)';

    const layout = {
        autosize: true,
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        font: {
            color: '#000000',
            family: 'Computer Modern, Latin Modern Math, Times New Roman, serif',
            size: 14
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                font: { size: 16, color: '#000000' }
            },
            gridcolor: '#e0e0e0',
            linecolor: '#000000',
            linewidth: 1.5,
            mirror: true,
            ticks: 'outside',
            tickwidth: 1.5,
            tickcolor: '#000000',
            color: '#000000',
            showline: true,
            zeroline: false,
            fixedrange: false  // Allow independent zoom
        },
        yaxis: {
            title: {
                text: hasRightAxis ? 'Value (Left)' : 'Value',
                font: { size: 16, color: hasRightAxis ? '#1f77b4' : '#000000' }
            },
            gridcolor: '#e0e0e0',
            linecolor: hasRightAxis ? '#1f77b4' : '#000000',
            linewidth: 1.5,
            mirror: !hasRightAxis,
            ticks: 'outside',
            tickwidth: 1.5,
            tickcolor: hasRightAxis ? '#1f77b4' : '#000000',
            color: hasRightAxis ? '#1f77b4' : '#000000',
            showline: true,
            zeroline: false,
            fixedrange: false  // Allow independent zoom
        },
        margin: { l: 80, r: hasRightAxis ? 80 : 40, t: 40, b: 80 },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            bordercolor: '#000000',
            borderwidth: 1,
            font: { size: 13, color: '#000000' }
        }
    };

    // Add second Y-axis if needed
    if (hasRightAxis) {
        layout.yaxis2 = {
            title: {
                text: 'Value (Right)',
                font: { size: 16, color: '#ff7f0e' }
            },
            overlaying: 'y',
            side: 'right',
            gridcolor: 'transparent',
            linecolor: '#ff7f0e',
            linewidth: 1.5,
            ticks: 'outside',
            tickwidth: 1.5,
            tickcolor: '#ff7f0e',
            color: '#ff7f0e',
            showline: true,
            zeroline: false,
            fixedrange: false  // Allow independent zoom
        };
    }

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['select2d', 'lasso2d'],
        editable: true,
        toImageButtonOptions: {
            format: 'svg',
            width: 1200,
            height: 800,
            scale: 1
        }
    };

    Plotly.newPlot(container, traces, layout, config).then(() => {
        Plotly.Plots.resize(container);
    });

    // Add resize functionality
    makeResizable(container);
}

function renderAllPlots() {
    // Clear container
    plotsContainer.innerHTML = '';

    if (state.plots.size === 0) {
        plotsContainer.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <h2>No plots yet</h2>
                <p>Click "Add New Plot" to get started</p>
            </div>
        `;
        return;
    }

    state.plots.forEach(plot => renderPlot(plot.id));
}


function exportPlotSVG(plotId) {
    const plotElement = document.getElementById(plotId);
    if (!plotElement) return;

    Plotly.toImage(plotElement, {
        format: 'svg',
        width: 1200,
        height: 800
    }).then(function (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `plot_${plotId}_${Date.now()}.svg`;
        link.click();
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

    // Manual Resize Logic
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

        const delta = e.clientY - startY;
        const newHeight = Math.max(300, startHeight + delta);
        container.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    // ROBUST AUTO-RESIZE: Use ResizeObserver to detect ANY size change
    // This fixes issues where sidebar toggle or window resize cuts off the plot
    const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
            Plotly.Plots.resize(container);
        });
    });

    resizeObserver.observe(container);
    // Also observe the wrapper height changes indirectly via parent
    if (container.parentElement) {
        resizeObserver.observe(container.parentElement);
    }
}

// ===== ZOOM CONTROLS =====
function setZoomMode(plotId, mode) {
    const container = document.getElementById(plotId);
    if (!container) return;

    let dragmode;
    switch (mode) {
        case 'x': dragmode = 'zoom'; break;  // Plotly default zoom
        case 'y': dragmode = 'zoom'; break;
        case 'xy': dragmode = 'zoom'; break;
        default: dragmode = 'zoom';
    }

    // Update layout with constrained zoom
    const update = { dragmode: dragmode };

    if (mode === 'x') {
        update['yaxis.fixedrange'] = true;
        update['xaxis.fixedrange'] = false;
    } else if (mode === 'y') {
        update['yaxis.fixedrange'] = false;
        update['xaxis.fixedrange'] = true;
    } else {
        update['yaxis.fixedrange'] = false;
        update['xaxis.fixedrange'] = false;
    }

    Plotly.relayout(container, update);
}

function resetZoom(plotId) {
    const container = document.getElementById(plotId);
    if (!container) return;

    Plotly.relayout(container, {
        'xaxis.autorange': true,
        'yaxis.autorange': true,
        'yaxis2.autorange': true,
        'xaxis.fixedrange': false,
        'yaxis.fixedrange': false
    });
}

// Zoom in/out on specific axis
function zoomAxis(plotId, axis, direction) {
    const container = document.getElementById(plotId);
    if (!container || !container.layout) return;

    const layout = container.layout;
    const factor = direction === 'in' ? 0.7 : 1.4; // 30% zoom in/out

    let axisKey, rangeKey;
    if (axis === 'y1') {
        axisKey = 'yaxis';
        rangeKey = 'yaxis.range';
    } else if (axis === 'y2') {
        axisKey = 'yaxis2';
        rangeKey = 'yaxis2.range';
    } else if (axis === 'x') {
        axisKey = 'xaxis';
        rangeKey = 'xaxis.range';
    }

    if (!layout[axisKey]) return;

    let range = layout[axisKey].range;
    if (!range) {
        // Get current range from plotly
        const gd = container;
        if (axis === 'y2' && gd._fullLayout.yaxis2) {
            range = gd._fullLayout.yaxis2.range;
        } else if (axis === 'y1' && gd._fullLayout.yaxis) {
            range = gd._fullLayout.yaxis.range;
        } else if (axis === 'x' && gd._fullLayout.xaxis) {
            range = gd._fullLayout.xaxis.range;
        }
    }

    if (!range || range.length < 2) return;

    const center = (range[0] + range[1]) / 2;
    const halfSpan = (range[1] - range[0]) / 2;
    const newHalfSpan = halfSpan * factor;

    const update = {};
    update[rangeKey] = [center - newHalfSpan, center + newHalfSpan];

    Plotly.relayout(container, update);
}

// ===== NOISE ANALYSIS UI =====
function showNoiseAnalysis(plotId) {
    const statsPanel = document.getElementById(`stats-${plotId}`);
    const statsContent = document.getElementById(`stats-content-${plotId}`);
    const plot = state.plots.get(plotId);
    const container = document.getElementById(plotId);

    if (!statsPanel || !statsContent || !plot) return;

    // Get visible X range from plot (for zoom-based stats)
    let xMin = null, xMax = null;
    let rangeInfo = '(full signal)';
    if (container && container._fullLayout && container._fullLayout.xaxis) {
        const xRange = container._fullLayout.xaxis.range;
        if (xRange && xRange.length === 2) {
            xMin = Math.min(xRange[0], xRange[1]);
            xMax = Math.max(xRange[0], xRange[1]);
            rangeInfo = `(${xMin.toFixed(1)} - ${xMax.toFixed(1)} ms)`;
        }
    }

    let html = `<div class="stats-range-info">Showing stats for visible range: <strong>${rangeInfo}</strong></div>`;

    plot.signals.forEach(sig => {
        const signalId = typeof sig === 'string' ? sig : sig.signalId;
        let data = getSignalData(signalId);
        const signal = state.files.get(signalId) || state.operations.get(signalId) || state.transforms.get(signalId);

        if (!data || data.length < 2) return;

        // Filter data to visible X range
        if (xMin !== null && xMax !== null) {
            data = data.filter(p => p.time >= xMin && p.time <= xMax);
        }

        if (data.length < 2) {
            return; // Not enough data in visible range
        }

        // Compute stats for filtered data
        const stats = computeNoiseStats(data);

        // Compute noise floor for filtered data
        const noiseFloor = estimateNoiseFloor(data);

        let displayName = signal?.name || signalId;
        if (displayName.endsWith('.csv')) displayName = displayName.slice(0, -4);

        html += `
            <div class="signal-stats">
                <div class="signal-stats-name">${displayName}</div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Mean</span>
                        <span class="stat-value">${stats.mean.toFixed(4)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Std Dev</span>
                        <span class="stat-value">${stats.std.toFixed(4)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">RMS</span>
                        <span class="stat-value">${stats.rms.toFixed(4)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Peak-to-Peak</span>
                        <span class="stat-value">${stats.peakToPeak.toFixed(4)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Min</span>
                        <span class="stat-value">${stats.min.toFixed(4)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Max</span>
                        <span class="stat-value">${stats.max.toFixed(4)}</span>
                    </div>
                    <div class="stat-item highlight">
                        <span class="stat-label">Noise Floor (σ)</span>
                        <span class="stat-value">${noiseFloor.noiseFloor.toFixed(4)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Samples</span>
                        <span class="stat-value">${stats.count}</span>
                    </div>
                </div>
            </div>
        `;
    });

    if (html === `<div class="stats-range-info">Showing stats for visible range: <strong>${rangeInfo}</strong></div>`) {
        html += '<p class="no-stats">No signals to analyze. Add signals to the plot first.</p>';
    }

    statsContent.innerHTML = html;
    statsPanel.style.display = 'block';
}

function hideNoiseAnalysis(plotId) {
    const statsPanel = document.getElementById(`stats-${plotId}`);
    if (statsPanel) {
        statsPanel.style.display = 'none';
    }
}

// ===== FFT SAMPLE RATE UI =====
function applyFFTSampleRate() {
    const input = document.getElementById('fftSampleRate');
    const value = parseFloat(input.value);
    if (value && value > 0) {
        setFFTSampleRate(value);
    }
}

function resetFFTSampleRate() {
    const input = document.getElementById('fftSampleRate');
    input.value = '';
    setFFTSampleRate(null);
}

// ===== INITIALIZATION =====
renderFileList();
renderOperationsList();
renderPlotControls();
