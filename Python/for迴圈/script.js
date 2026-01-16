// State
const STATE = {
    mode: 'list', // 'list' or 'range'
    data: [],
    currentIndex: -1,
    isRunning: false,
    intervalId: null
};

// Data Models
const DATA_SETS = {
    list: {
        items: ['Apple', 'Banana', 'Cherry', 'Date'],
        code: [
            'fruits = ["Apple", "Banana", "Cherry", "Date"]',
            'for fruit in fruits:',
            '　　print(f"I like {fruit}")'
        ],
        variableName: 'fruit'
    },
    range: {
        items: [0, 1, 2, 3, 4], // equivalent to range(5)
        code: [
            '# range(5) 生成 0 到 4',
            'for i in range(5):',
            '　　print(f"Current number: {i}")'
        ],
        variableName: 'i'
    }
};

// DOM Elements
const els = {
    modeListBtn: document.getElementById('btn-list-mode'),
    modeRangeBtn: document.getElementById('btn-range-mode'),
    iterableContainer: document.getElementById('iterable-container'),
    variableBox: document.getElementById('variable-box'),
    codeDisplay: document.getElementById('code-display'),
    startBtn: document.getElementById('btn-start'),
    stepBtn: document.getElementById('btn-step'),
    resetBtn: document.getElementById('btn-reset'),
    statusMsg: document.getElementById('status-msg')
};

// Initialization
function init() {
    setMode('list');
    bindEvents();
}

// Event Listeners
function bindEvents() {
    els.modeListBtn.addEventListener('click', () => setMode('list'));
    els.modeRangeBtn.addEventListener('click', () => setMode('range'));
    els.startBtn.addEventListener('click', toggleAutoPlay);
    els.stepBtn.addEventListener('click', step);
    els.resetBtn.addEventListener('click', reset);
}

// Mode Switching
function setMode(mode) {
    if (STATE.isRunning) stopAutoPlay();

    STATE.mode = mode;
    STATE.currentIndex = -1;
    STATE.data = DATA_SETS[mode].items;

    // Update Mode Buttons
    els.modeListBtn.classList.toggle('active', mode === 'list');
    els.modeRangeBtn.classList.toggle('active', mode === 'range');

    // Render Initial State
    renderIterable();
    renderCode();
    resetVisuals();
    updateStatus("準備就緒。請按「開始執行」或「下一步」。");
}

// Rendering
function renderIterable() {
    els.iterableContainer.innerHTML = '';
    STATE.data.forEach((item, index) => {
        const box = document.createElement('div');
        box.className = 'item-box';
        box.textContent = JSON.stringify(item);
        box.dataset.index = index;
        els.iterableContainer.appendChild(box);
    });
}

function renderCode() {
    const codeLines = DATA_SETS[STATE.mode].code;
    els.codeDisplay.innerHTML = '';
    codeLines.forEach((line, index) => {
        const div = document.createElement('div');
        div.className = 'code-line';
        div.textContent = line;
        div.dataset.line = index;
        els.codeDisplay.appendChild(div);
    });
}

// Core Logic
function step() {
    if (STATE.currentIndex >= STATE.data.length - 1) {
        // Loop finished
        finishLoop();
        return;
    }

    STATE.currentIndex++;
    updateVisuals();

    // Enable/Disable Controls
    els.stepBtn.disabled = false;

    if (STATE.currentIndex === STATE.data.length - 1) {
        updateStatus("迴圈執行完畢！");
        if (STATE.isRunning) stopAutoPlay();
    } else {
        updateStatus(`正在執行第 ${STATE.currentIndex + 1} 次迭代...`);
    }
}

function updateVisuals() {
    const currentItem = STATE.data[STATE.currentIndex];

    // Update Variable Box
    els.variableBox.textContent = `${DATA_SETS[STATE.mode].variableName} = ${JSON.stringify(currentItem)}`;
    els.variableBox.style.borderColor = 'var(--accent-green)';

    // Update Iterable Highlights
    const boxes = els.iterableContainer.querySelectorAll('.item-box');
    boxes.forEach((box, idx) => {
        if (idx === STATE.currentIndex) {
            box.classList.add('active');
            box.classList.remove('visited');
        } else if (idx < STATE.currentIndex) {
            box.classList.remove('active');
            box.classList.add('visited');
        } else {
            box.classList.remove('active', 'visited');
        }
    });

    // Update Code Highlights
    // Simulating: Line 0 (setup), Line 1 (loop header), Line 2 (body)
    // Simple visualization: Highlight loop header then body
    const lines = els.codeDisplay.querySelectorAll('.code-line');
    lines.forEach(line => line.classList.remove('active'));

    // Highlight pattern: 
    // Always highlight the 'for' line (index 1) to show condition check
    // Then highlight body (index 2)

    // For visual simplicity, we'll just highlight the body line (index 2) 
    // to show "processing" current item, and maybe flash line 1 briefly if we wanted complex animation.
    // Let's just highlight line 2 (the print statement) as the "active action".
    if (lines[2]) lines[2].classList.add('active');
}

function resetVisuals() {
    STATE.currentIndex = -1;
    els.variableBox.textContent = 'waiting...';
    els.variableBox.style.borderColor = 'var(--accent-yellow)';

    const boxes = els.iterableContainer.querySelectorAll('.item-box');
    boxes.forEach(box => className = 'item-box');

    const lines = els.codeDisplay.querySelectorAll('.code-line');
    lines.forEach(line => line.classList.remove('active'));

    // Clear visited/active states
    renderIterable();
    els.startBtn.textContent = '開始執行 (Start)';
    els.startBtn.classList.remove('btn-secondary');
    els.startBtn.classList.add('btn-primary');
    els.stepBtn.disabled = false;
}

function reset() {
    stopAutoPlay();
    resetVisuals();
    updateStatus("已重置。");
}

function finishLoop() {
    updateStatus("迴圈結束 (Loop Finished)。");
    const lines = els.codeDisplay.querySelectorAll('.code-line');
    lines.forEach(line => line.classList.remove('active'));
    els.stepBtn.disabled = true;
}

// Auto Play logic
function toggleAutoPlay() {
    if (STATE.isRunning) {
        stopAutoPlay();
    } else {
        if (STATE.currentIndex >= STATE.data.length - 1) {
            reset();
        }
        startAutoPlay();
    }
}

function startAutoPlay() {
    STATE.isRunning = true;
    els.startBtn.textContent = '暫停 (Pause)';
    els.startBtn.classList.replace('btn-primary', 'btn-secondary');

    // Initial step if at start
    if (STATE.currentIndex === -1) {
        step();
    }

    STATE.intervalId = setInterval(() => {
        if (STATE.currentIndex < STATE.data.length - 1) {
            step();
        } else {
            stopAutoPlay();
        }
    }, 1500); // 1.5s delay between steps
}

function stopAutoPlay() {
    STATE.isRunning = false;
    clearInterval(STATE.intervalId);
    els.startBtn.textContent = '繼續 (Resume)';
    els.startBtn.classList.replace('btn-secondary', 'btn-primary');
}

function updateStatus(msg) {
    els.statusMsg.textContent = msg;
}

init();
