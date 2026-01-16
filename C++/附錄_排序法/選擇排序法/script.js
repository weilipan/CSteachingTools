const arrayContainer = document.getElementById('array-container');
const statusText = document.getElementById('status-text');
const explanationText = document.getElementById('explanation-text');
const codeDisplay = document.getElementById('code-display');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stepBtn = document.getElementById('step-btn');
const speedSlider = document.getElementById('speed-slider');

let array = [];
let isSorting = false;
let isPaused = false;
let abortController = null;
let delayTime = 500;
let stepResolve = null;

// Configuration
const ARRAY_SIZE = 15;
const MIN_VAL = 10;
const MAX_VAL = 100;

// Code lines mapping (approximate line numbers in the displayed code)
// 0: void selectionSort(int arr[], int n) {
// 1:     for (int i = 0; i < n - 1; i++) {
// 2:         int min_idx = i;
// 3:         for (int j = i + 1; j < n; j++) {
// 4:             if (arr[j] < arr[min_idx])
// 5:                 min_idx = j;
// 6:         }
// 7:         swap(arr[min_idx], arr[i]);
// 8:     }
// 9: }

function init() {
    generateArray();
    setupEventListeners();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', () => {
        if (isSorting) {
            stopSorting();
        }
        generateArray();
    });

    startBtn.addEventListener('click', startSorting);
    
    pauseBtn.addEventListener('click', () => {
        if (isPaused) {
            resumeSorting();
        } else {
            pauseSorting();
        }
    });

    stepBtn.addEventListener('click', () => {
        if (stepResolve) {
            stepResolve();
            stepResolve = null;
        }
    });

    speedSlider.addEventListener('input', (e) => {
        // Invert value: higher slider = lower delay
        const val = parseInt(e.target.value);
        delayTime = 1000 - (val * 9); // 100 -> 100ms, 1 -> 991ms
    });
}

function generateArray() {
    array = [];
    arrayContainer.innerHTML = '';
    
    for (let i = 0; i < ARRAY_SIZE; i++) {
        const val = Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL;
        array.push(val);
        
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${val * 2}px`; // Scale for visibility
        bar.id = `bar-${i}`;
        
        const label = document.createElement('span');
        label.innerText = val;
        bar.appendChild(label);
        
        arrayContainer.appendChild(bar);
    }
    
    resetUI();
}

function resetUI() {
    statusText.innerText = '準備就緒';
    explanationText.innerText = '點擊「開始排序」來觀察演算法運作。';
    highlightCode(-1);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = true;
    pauseBtn.innerText = '暫停';
    isPaused = false;
}

function stopSorting() {
    if (abortController) {
        abortController.abort();
    }
    isSorting = false;
    isPaused = false;
    stepResolve = null;
    resetUI();
}

function pauseSorting() {
    isPaused = true;
    pauseBtn.innerText = '繼續';
    stepBtn.disabled = false;
    statusText.innerText = '已暫停';
}

function resumeSorting() {
    isPaused = false;
    pauseBtn.innerText = '暫停';
    stepBtn.disabled = true;
    statusText.innerText = '排序中...';
    if (stepResolve) {
        stepResolve();
        stepResolve = null;
    }
}

async function wait() {
    if (isPaused) {
        await new Promise(resolve => {
            stepResolve = resolve;
        });
    } else {
        await new Promise(resolve => setTimeout(resolve, delayTime));
    }
}

async function startSorting() {
    if (isSorting) return;
    isSorting = true;
    abortController = new AbortController();
    const signal = abortController.signal;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    generateBtn.disabled = true;
    statusText.innerText = '排序中...';

    try {
        await selectionSort(signal);
        statusText.innerText = '排序完成！';
        explanationText.innerText = '陣列已完全排序。';
        highlightCode(-1);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Sorting aborted');
        } else {
            console.error(error);
        }
    } finally {
        isSorting = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stepBtn.disabled = true;
        generateBtn.disabled = false;
        pauseBtn.innerText = '暫停';
    }
}

function highlightCode(lineIndex) {
    // Simple implementation: re-render code with highlight class
    // In a real app, we might just toggle classes on existing elements
    // For now, let's assume the code is static and we just want to highlight logically
    // Since the code block is just text, we can't easily highlight lines without structure.
    // Let's wrap lines in spans first if not done.
    
    const codeBlock = document.getElementById('code-display');
    const lines = codeBlock.innerText.split('\n');
    codeBlock.innerHTML = '';
    
    lines.forEach((line, index) => {
        const div = document.createElement('div');
        div.textContent = line;
        if (index === lineIndex) {
            div.style.backgroundColor = '#2f334d';
            div.style.width = '100%';
            div.style.display = 'inline-block';
        }
        codeBlock.appendChild(div);
    });
}

async function selectionSort(signal) {
    const n = array.length;
    
    highlightCode(0);
    await wait();
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    for (let i = 0; i < n - 1; i++) {
        highlightCode(1);
        explanationText.innerText = `第 ${i + 1} 輪：尋找從索引 ${i} 開始的最小值。`;
        await wait();
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

        let min_idx = i;
        highlightCode(2);
        updateBarColor(min_idx, 'current-min');
        explanationText.innerText = `目前最小值設為索引 ${min_idx} (數值: ${array[min_idx]})。`;
        await wait();
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

        for (let j = i + 1; j < n; j++) {
            highlightCode(3);
            updateBarColor(j, 'scanning');
            explanationText.innerText = `檢查索引 ${j} (數值: ${array[j]}) 是否小於目前最小值 ${array[min_idx]}。`;
            await wait();
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

            highlightCode(4);
            if (array[j] < array[min_idx]) {
                // Revert old min color if it wasn't the starting i
                if (min_idx !== i) {
                    updateBarColor(min_idx, 'default');
                } else {
                    // If min_idx was i, we keep it as default/scanning visually until swap? 
                    // Actually, let's just reset it to default if we found a new min, 
                    // unless it's 'i', which is handled specially later.
                    // For visualization simplicity:
                    // 'i' is the target position.
                    // 'min_idx' is the candidate.
                }
                
                // If the old min_idx was just 'i', we might want to keep 'i' marked differently?
                // Let's keep it simple: revert old min_idx color
                updateBarColor(min_idx, 'default');
                
                min_idx = j;
                highlightCode(5);
                updateBarColor(min_idx, 'current-min');
                explanationText.innerText = `發現更小的值！更新最小值索引為 ${min_idx}。`;
                await wait();
                if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            } else {
                updateBarColor(j, 'default');
            }
        }

        highlightCode(7);
        if (min_idx !== i) {
            explanationText.innerText = `交換索引 ${i} (${array[i]}) 與索引 ${min_idx} (${array[min_idx]})。`;
            await swap(i, min_idx);
        } else {
            explanationText.innerText = `最小值已在正確位置，無需交換。`;
        }
        
        // Mark i as sorted
        updateBarColor(i, 'sorted');
        // Reset min_idx color if it's different from i (it was swapped)
        if (min_idx !== i) {
             updateBarColor(min_idx, 'default');
        }
        
        await wait();
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    }
    
    // Mark last element as sorted
    updateBarColor(n - 1, 'sorted');
    highlightCode(9);
}

async function swap(idx1, idx2) {
    const bar1 = document.getElementById(`bar-${idx1}`);
    const bar2 = document.getElementById(`bar-${idx2}`);
    
    // Visual swap (height and text)
    const tempHeight = bar1.style.height;
    bar1.style.height = bar2.style.height;
    bar2.style.height = tempHeight;
    
    const tempText = bar1.querySelector('span').innerText;
    bar1.querySelector('span').innerText = bar2.querySelector('span').innerText;
    bar2.querySelector('span').innerText = tempText;
    
    // Data swap
    const temp = array[idx1];
    array[idx1] = array[idx2];
    array[idx2] = temp;
    
    await new Promise(resolve => setTimeout(resolve, 200)); // Small extra delay for swap effect
}

function updateBarColor(idx, className) {
    const bar = document.getElementById(`bar-${idx}`);
    if (bar) {
        bar.className = 'array-bar'; // Reset
        bar.classList.add(className);
    }
}

// Initialize
init();
