// DOM Elements
const inputField = document.getElementById('simulation-input');
const resetBtn = document.getElementById('reset-btn');
const bufferViz = document.getElementById('buffer-viz');

const runCinBtn = document.getElementById('run-cin');
const cinVarValue = document.getElementById('cin-var-value');
const cinLog = document.getElementById('cin-log');

const runGetlineBtn = document.getElementById('run-getline');
const getlineVarValue = document.getElementById('getline-var-value');
const getlineLog = document.getElementById('getline-log');

// State
let buffer = []; // Array of objects {char, type, raw}
let cursorIndex = 0;
let isAnimating = false;

// Initialization
function init() {
    updateBufferFromInput();

    // Event Listeners
    resetBtn.addEventListener('click', () => {
        cursorIndex = 0;
        updateBufferFromInput();
        resetOutputs();
    });

    inputField.addEventListener('input', () => {
        cursorIndex = 0;
        updateBufferFromInput();
        resetOutputs();
    });

    runCinBtn.addEventListener('click', () => {
        if (!isAnimating) simulateCin();
    });

    runGetlineBtn.addEventListener('click', () => {
        if (!isAnimating) simulateGetline();
    });
}

function updateBufferFromInput() {
    const text = inputField.value;
    buffer = text.split('').map(char => {
        if (char === '\n') return { char: '\\n', type: 'newline', raw: '\n' };
        if (char === ' ') return { char: '␣', type: 'space', raw: ' ' };
        if (char === '\t') return { char: '\\t', type: 'space', raw: '\t' };
        return { char: char, type: 'char', raw: char };
    });

    // Simulate Enter key/Newline at end if not present (standard console behavior test)
    buffer.push({ char: '\\n', type: 'newline', raw: '\n' });

    renderBuffer();
}

function renderBuffer() {
    bufferViz.innerHTML = '';

    if (buffer.length === 0) {
        bufferViz.innerHTML = '<div class="buffer-placeholder">Buffer is empty</div>';
        return;
    }

    buffer.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = `char-block ${item.type}`;
        el.dataset.index = index; // identifying by index

        if (index < cursorIndex) el.classList.add('consumed');

        el.innerHTML = `
            <span class="char-val">${item.char}</span>
            <span class="char-idx">${index}</span>
        `;
        bufferViz.appendChild(el);
    });
}

function resetOutputs() {
    cinVarValue.textContent = '""';
    getlineVarValue.textContent = '""';
    cinLog.textContent = '';
    getlineLog.textContent = '';
    isAnimating = false;
}

// Helpers for Delay
const delay = ms => new Promise(res => setTimeout(res, ms));

async function highlightCurrent(idx, className = 'current') {
    const el = bufferViz.querySelector(`.char-block[data-index="${idx}"]`);
    if (el) {
        el.classList.add(className);
        // Scroll into view if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

async function clearHighlight(idx, className = 'current') {
    const el = bufferViz.querySelector(`.char-block[data-index="${idx}"]`);
    if (el) el.classList.remove(className);
}

// CIN Simulation
async function simulateCin() {
    if (cursorIndex >= buffer.length) {
        cinLog.textContent = "Error: Buffer Empty / End of Stream";
        return;
    }

    isAnimating = true;
    cinLog.textContent = "步驟 1: 跳過前導空白 (Skipping leading whitespace)...";

    // Step 1: Skip leading whitespace
    while (cursorIndex < buffer.length) {
        await highlightCurrent(cursorIndex, 'reading');
        await delay(400); // Visual delay

        const currentChar = buffer[cursorIndex];

        if (currentChar.type === 'space' || currentChar.type === 'newline') {
            await clearHighlight(cursorIndex, 'reading');
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.add('consumed'); // Mark as consumed (skipped)
            // Visual effect for skipped
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.add('skipped');
            cursorIndex++;
        } else {
            // Found non-whitespace
            await clearHighlight(cursorIndex, 'reading');
            break;
        }
    }

    if (cursorIndex >= buffer.length) {
        cinLog.textContent = "僅剩餘空白，無法讀取有效資料。";
        isAnimating = false;
        return;
    }

    cinLog.textContent = "步驟 2: 讀取資料直到遇見空白 (Reading until whitespace)...";
    let readResult = "";

    // Step 2: Read until whitespace
    while (cursorIndex < buffer.length) {
        await highlightCurrent(cursorIndex, 'reading');
        await delay(400);

        const currentChar = buffer[cursorIndex];

        if (currentChar.type === 'space' || currentChar.type === 'newline') {
            // STOP reading, do NOT consume this whitespace
            await clearHighlight(cursorIndex, 'reading');
            cinLog.textContent += " 遇到空白，停止讀取。";
            break;
        } else {
            readResult += currentChar.raw;
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.remove('reading');
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.add('consumed');
            cinVarValue.textContent = `"${readResult}"`;
            cursorIndex++;
        }
    }

    cinLog.textContent = `完成。讀取到: "${readResult}"`;
    isAnimating = false;
}

// GETLINE Simulation
async function simulateGetline() {
    if (cursorIndex >= buffer.length) {
        getlineLog.textContent = "Error: Buffer Empty / End of Stream";
        return;
    }

    isAnimating = true;
    getlineLog.textContent = "步驟 1: 讀取直到換行符號 (Reading until newline)...";
    let readResult = "";

    while (cursorIndex < buffer.length) {
        await highlightCurrent(cursorIndex, 'reading');
        await delay(400);

        const currentChar = buffer[cursorIndex];

        if (currentChar.type === 'newline') {
            // Stop, consume newline but don't add to result
            getlineLog.textContent += " 遇到換行符號。";
            await clearHighlight(cursorIndex, 'reading');
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.add('consumed'); // Newline IS consumed
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.add('skipped'); // Visual style for consumed control char
            cursorIndex++;
            break;
        } else {
            readResult += currentChar.raw;
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.remove('reading');
            bufferViz.querySelector(`.char-block[data-index="${cursorIndex}"]`).classList.add('consumed');
            getlineVarValue.textContent = `"${readResult}"`;
            cursorIndex++;
        }
    }

    getlineLog.textContent = `完成。讀取到: "${readResult}" (換行符號被丟棄)`;
    isAnimating = false;
}

// Initial Call
init();
