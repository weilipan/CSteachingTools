const container = document.getElementById('visualization-container');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedRange = document.getElementById('speed-range');
const statusText = document.getElementById('status-text');

let array = [];
let bars = [];
let isSorting = false;
let isPaused = false;
let abortController = null;
let delay = 50;

// Initialize
function init() {
    generateArray();
    addEventListeners();
}

function addEventListeners() {
    generateBtn.addEventListener('click', generateArray);
    startBtn.addEventListener('click', startSort);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', reset);
    speedRange.addEventListener('input', updateSpeed);
}

function updateSpeed() {
    // Invert value so higher range = faster (lower delay)
    // Range 1-100. Map to 500ms - 5ms
    const val = parseInt(speedRange.value);
    delay = 505 - (val * 5);
}

function generateArray() {
    if (isSorting) return;
    
    container.innerHTML = '';
    array = [];
    bars = [];
    
    // Determine number of bars based on screen width
    const numBars = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < numBars; i++) {
        const value = Math.floor(Math.random() * 90) + 10; // 10-99
        array.push(value);
        
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        
        const valueLabel = document.createElement('div');
        valueLabel.classList.add('bar-value');
        valueLabel.textContent = value;
        bar.appendChild(valueLabel);
        
        container.appendChild(bar);
        bars.push(bar);
    }
    
    statusText.textContent = '準備就緒，請點擊「開始排序」';
    resetBtn.disabled = true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkPause() {
    while (isPaused) {
        await sleep(100);
    }
}

async function startSort() {
    if (isSorting) return;
    isSorting = true;
    abortController = new AbortController();
    
    generateBtn.disabled = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    
    try {
        await insertionSort(abortController.signal);
        statusText.textContent = '排序完成！';
    } catch (error) {
        if (error.name === 'AbortError') {
            statusText.textContent = '已重置';
        } else {
            console.error(error);
        }
    } finally {
        isSorting = false;
        isPaused = false;
        generateBtn.disabled = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = '暫停';
        pauseBtn.classList.remove('primary');
        pauseBtn.classList.add('warning');
    }
}

function togglePause() {
    if (!isSorting) return;
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.textContent = '繼續';
        pauseBtn.classList.remove('warning');
        pauseBtn.classList.add('success');
        statusText.textContent = '已暫停';
    } else {
        pauseBtn.textContent = '暫停';
        pauseBtn.classList.remove('success');
        pauseBtn.classList.add('warning');
        statusText.textContent = '排序中...';
    }
}

function reset() {
    if (isSorting) {
        if (abortController) {
            abortController.abort();
        }
        isSorting = false;
        isPaused = false;
    }
    generateArray();
    generateBtn.disabled = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = '暫停';
}

async function insertionSort(signal) {
    const n = array.length;
    
    // Highlight the first element as initially sorted
    bars[0].style.backgroundColor = 'var(--bar-sorted)';
    
    for (let i = 1; i < n; i++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        await checkPause();
        
        let key = array[i];
        let j = i - 1;
        
        statusText.textContent = `正在處理元素: ${key}`;
        
        // Highlight current element
        bars[i].style.backgroundColor = 'var(--bar-active)';
        bars[i].style.height = `${key * 3}px`; // Ensure height is correct
        await sleep(delay);
        
        while (j >= 0 && array[j] > key) {
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            await checkPause();
            
            statusText.textContent = `比較: ${array[j]} > ${key}，將 ${array[j]} 往後移`;
            
            // Highlight comparing element
            bars[j].style.backgroundColor = 'var(--bar-compare)';
            await sleep(delay);
            
            // Shift element visually
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j] * 3}px`;
            bars[j + 1].querySelector('.bar-value').textContent = array[j];
            bars[j + 1].style.backgroundColor = 'var(--bar-sorted)'; // It's part of sorted array now
            
            // Reset color of j (it will be processed again or stay sorted)
            // bars[j].style.backgroundColor = 'var(--bar-sorted)'; 
            
            j = j - 1;
            await sleep(delay);
        }
        
        array[j + 1] = key;
        bars[j + 1].style.height = `${key * 3}px`;
        bars[j + 1].querySelector('.bar-value').textContent = key;
        
        // Mark as sorted
        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = 'var(--bar-sorted)';
        }
        
        await sleep(delay);
    }
}

// Start
init();
updateSpeed();
