const arrayContainer = document.getElementById('arrayContainer');
const generateBtn = document.getElementById('generateBtn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const statusText = document.getElementById('statusText');
const codeDisplay = document.getElementById('codeDisplay');

let array = [];
let isSorting = false;
let isPaused = false;
let abortController = null;
let speed = 50;

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
    speedSlider.addEventListener('input', (e) => {
        speed = e.target.value;
    });
}

function generateArray() {
    if (isSorting) return;
    array = [];
    arrayContainer.innerHTML = '';
    const numBars = 20;
    for (let i = 0; i < numBars; i++) {
        const value = Math.floor(Math.random() * 90) + 10;
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value * 3}px`;
        bar.textContent = value;
        bar.id = `bar-${i}`;
        arrayContainer.appendChild(bar);
    }
    statusText.textContent = "已產生新陣列，準備就緒。";
    resetHighlights();
}

function getDelay() {
    // Map 1-100 to 1000ms-10ms
    return 1010 - speed * 10;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkPaused() {
    while (isPaused) {
        await sleep(100);
    }
}

async function startSort() {
    if (isSorting) return;
    isSorting = true;
    generateBtn.disabled = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    
    abortController = new AbortController();
    const signal = abortController.signal;

    try {
        await bubbleSort(signal);
        if (!signal.aborted) {
            statusText.textContent = "排序完成！";
            isSorting = false;
            generateBtn.disabled = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            pauseBtn.textContent = "暫停";
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Sorting aborted');
        } else {
            console.error(error);
        }
    }
}

async function bubbleSort(signal) {
    const n = array.length;
    const bars = document.getElementsByClassName('array-bar');

    highlightLine(2); // for (int i = 0; i < n-1; i++)
    
    for (let i = 0; i < n - 1; i++) {
        if (signal.aborted) return;
        await checkPaused();

        for (let j = 0; j < n - i - 1; j++) {
            if (signal.aborted) return;
            await checkPaused();

            highlightLine(3); // for (int j = 0; j < n-i-1; j++)
            
            // Highlight comparing bars
            bars[j].style.backgroundColor = 'var(--compare-color)';
            bars[j+1].style.backgroundColor = 'var(--compare-color)';
            statusText.textContent = `比較索引 ${j} (${array[j]}) 和 ${j+1} (${array[j+1]})`;
            
            await sleep(getDelay());

            highlightLine(4); // if (arr[j] > arr[j+1])
            if (array[j] > array[j+1]) {
                statusText.textContent = `${array[j]} > ${array[j+1]}，交換位置`;
                
                // Highlight swapping
                bars[j].style.backgroundColor = 'var(--swap-color)';
                bars[j+1].style.backgroundColor = 'var(--swap-color)';
                
                highlightLine(5); // swap(&arr[j], &arr[j+1])
                await sleep(getDelay());

                // Swap in DOM and logic
                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;

                bars[j].style.height = `${array[j] * 3}px`;
                bars[j].textContent = array[j];
                bars[j+1].style.height = `${array[j+1] * 3}px`;
                bars[j+1].textContent = array[j+1];
            } else {
                statusText.textContent = `${array[j]} <= ${array[j+1]}，不交換`;
            }

            await sleep(getDelay());

            // Reset colors
            bars[j].style.backgroundColor = 'var(--default-bar-color)';
            bars[j+1].style.backgroundColor = 'var(--default-bar-color)';
        }
        
        // Mark sorted element
        bars[n - i - 1].style.backgroundColor = 'var(--sorted-color)';
    }
    // Mark the last remaining element as sorted
    bars[0].style.backgroundColor = 'var(--sorted-color)';
    highlightLine(-1); // Clear highlight
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "繼續" : "暫停";
    statusText.textContent = isPaused ? "已暫停" : "繼續排序...";
}

function reset() {
    if (abortController) {
        abortController.abort();
    }
    isSorting = false;
    isPaused = false;
    generateBtn.disabled = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    pauseBtn.textContent = "暫停";
    generateArray();
}

function resetHighlights() {
    const lines = codeDisplay.innerHTML.split('\n');
    // Simple reset, complex highlighting logic handled in highlightLine
}

function highlightLine(lineNumber) {
    // This is a simplified highlighter. 
    // In a real scenario, we'd wrap lines in spans.
    // Here we will just use a simple mapping if possible or just rely on text updates.
    // For better visualization, let's wrap the code in spans first.
}

// Better code highlighting implementation
const codeLines = [
    "void bubbleSort(int arr[], int n) {",
    "  for (int i = 0; i < n-1; i++) {",
    "    for (int j = 0; j < n-i-1; j++) {",
    "      if (arr[j] > arr[j+1]) {",
    "        swap(&arr[j], &arr[j+1]);",
    "      }",
    "    }",
    "  }",
    "}"
];

function renderCode() {
    codeDisplay.innerHTML = codeLines.map((line, index) => 
        `<div id="line-${index+1}" class="code-line">${line}</div>`
    ).join('');
}

// Override highlightLine
highlightLine = function(lineNumber) {
    document.querySelectorAll('.code-line').forEach(el => el.style.backgroundColor = 'transparent');
    if (lineNumber > 0) {
        const line = document.getElementById(`line-${lineNumber}`);
        if (line) line.style.backgroundColor = '#e3f2fd';
    }
}

renderCode();
init();
