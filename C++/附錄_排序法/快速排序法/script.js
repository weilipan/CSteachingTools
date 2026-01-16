// Quick Sort Visualization
let array = [];
let animationSpeed = 500;
let isPaused = false;
let isSorting = false;
let animationQueue = [];
let recursionCalls = [];

// DOM Elements
const arrayContainer = document.getElementById('arrayContainer');
const stepDescription = document.getElementById('stepDescription');
const treeContainer = document.getElementById('treeContainer');
const generateBtn = document.getElementById('generateBtn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

// Initialize
generateArray();

// Event Listeners
generateBtn.addEventListener('click', generateArray);
startBtn.addEventListener('click', startSorting);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetVisualization);
speedSlider.addEventListener('input', (e) => {
    const speed = parseInt(e.target.value);
    speedValue.textContent = speed;
    animationSpeed = 1100 - (speed * 100);
});

// Generate Random Array
function generateArray() {
    array = [];
    const size = 7;
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 90) + 10);
    }
    renderArray();
    updateStepDescription('已產生隨機陣列，點擊「開始排序」開始演示');
    recursionCalls = [];
    renderRecursionTree();
}

// Render Array
function renderArray(highlights = {}) {
    arrayContainer.innerHTML = '';
    const maxValue = Math.max(...array);

    array.forEach((value, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'array-bar';

        const bar = document.createElement('div');
        bar.className = 'bar';
        const height = (value / maxValue) * 250;
        bar.style.height = `${height}px`;

        // Apply highlights
        if (highlights.pivot === index) {
            bar.classList.add('pivot');
        } else if (highlights.comparing && highlights.comparing.includes(index)) {
            bar.classList.add('comparing');
        } else if (highlights.swapping && highlights.swapping.includes(index)) {
            bar.classList.add('swapping');
        } else if (highlights.sorted && highlights.sorted.includes(index)) {
            bar.classList.add('sorted');
        } else if (highlights.leftPartition && highlights.leftPartition.includes(index)) {
            bar.classList.add('left-partition');
        } else if (highlights.rightPartition && highlights.rightPartition.includes(index)) {
            bar.classList.add('right-partition');
        }

        const valueLabel = document.createElement('div');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = value;

        barContainer.appendChild(bar);
        barContainer.appendChild(valueLabel);
        arrayContainer.appendChild(barContainer);
    });
}

// Update Step Description
function updateStepDescription(text) {
    stepDescription.textContent = text;
}

// Render Recursion Tree
function renderRecursionTree() {
    treeContainer.innerHTML = '';
    recursionCalls.forEach((call, index) => {
        const node = document.createElement('div');
        node.className = 'tree-node';
        if (index === recursionCalls.length - 1) {
            node.classList.add('active');
        }
        node.textContent = call;
        treeContainer.appendChild(node);
    });
}

// Start Sorting
async function startSorting() {
    if (isSorting) return;

    isSorting = true;
    isPaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    generateBtn.disabled = true;

    recursionCalls = [];
    await quickSort(0, array.length - 1, 0);

    // Mark all as sorted
    renderArray({ sorted: array.map((_, i) => i) });
    updateStepDescription('✅ 排序完成！所有元素已按升序排列。');

    isSorting = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    generateBtn.disabled = false;
}

// Quick Sort Algorithm
async function quickSort(low, high, depth) {
    if (low < high) {
        const indent = '  '.repeat(depth);
        const rangeStr = `[${array.slice(low, high + 1).join(', ')}]`;
        recursionCalls.push(`${indent}quickSort(${low}, ${high}) → ${rangeStr}`);
        renderRecursionTree();

        updateStepDescription(`遞迴呼叫：處理範圍 [${low}, ${high}]，陣列片段：${rangeStr}`);
        await sleep(animationSpeed);

        // Partition
        const pi = await partition(low, high, depth);

        // Recursively sort left and right
        await quickSort(low, pi - 1, depth + 1);
        await quickSort(pi + 1, high, depth + 1);
    } else if (low === high) {
        const indent = '  '.repeat(depth);
        recursionCalls.push(`${indent}quickSort(${low}, ${high}) → [${array[low]}] (單一元素，已排序)`);
        renderRecursionTree();
        await sleep(animationSpeed / 2);
    }
}

// Partition Function
async function partition(low, high, depth) {
    const pivot = array[high];
    const indent = '  '.repeat(depth);

    recursionCalls.push(`${indent}  partition: pivot = ${pivot} (index ${high})`);
    renderRecursionTree();

    updateStepDescription(`選擇基準值 (pivot) = ${pivot}，位於索引 ${high}`);
    renderArray({ pivot: high });
    await sleep(animationSpeed);

    let i = low - 1;

    for (let j = low; j < high; j++) {
        await checkPause();

        updateStepDescription(`比較 arr[${j}] = ${array[j]} 與 pivot = ${pivot}`);
        renderArray({
            pivot: high,
            comparing: [j],
            leftPartition: i >= low ? Array.from({ length: i - low + 1 }, (_, k) => low + k) : []
        });
        await sleep(animationSpeed);

        if (array[j] < pivot) {
            i++;

            if (i !== j) {
                // Store values BEFORE swap for correct message
                const valueAtI = array[i];
                const valueAtJ = array[j];

                updateStepDescription(`${valueAtJ} < ${pivot}，交換 arr[${i}] = ${valueAtI} 和 arr[${j}] = ${valueAtJ}`);
                renderArray({
                    pivot: high,
                    swapping: [i, j]
                });
                await sleep(animationSpeed);

                // Swap
                [array[i], array[j]] = [array[j], array[i]];

                recursionCalls.push(`${indent}    swap(${i}, ${j}): ${valueAtI} ↔ ${valueAtJ}`);
                renderRecursionTree();

                renderArray({
                    pivot: high,
                    leftPartition: Array.from({ length: i - low + 1 }, (_, k) => low + k)
                });
                await sleep(animationSpeed);
            } else {
                updateStepDescription(`${array[j]} < ${pivot}，arr[${j}] 已在正確位置`);
                await sleep(animationSpeed / 2);
            }
        } else {
            updateStepDescription(`${array[j]} >= ${pivot}，不需交換`);
            await sleep(animationSpeed / 2);
        }
    }

    // Place pivot in correct position
    const pivotIndex = i + 1;
    if (pivotIndex !== high) {
        updateStepDescription(`將 pivot = ${pivot} 放到正確位置 ${pivotIndex}`);
        renderArray({
            pivot: high,
            swapping: [pivotIndex, high]
        });
        await sleep(animationSpeed);

        [array[pivotIndex], array[high]] = [array[high], array[pivotIndex]];

        recursionCalls.push(`${indent}    將 pivot 放到位置 ${pivotIndex}`);
        renderRecursionTree();
    }

    updateStepDescription(`分割完成！pivot = ${pivot} 在位置 ${pivotIndex}，左邊都 < ${pivot}，右邊都 > ${pivot}`);
    renderArray({
        sorted: [pivotIndex],
        leftPartition: pivotIndex > low ? Array.from({ length: pivotIndex - low }, (_, k) => low + k) : [],
        rightPartition: pivotIndex < high ? Array.from({ length: high - pivotIndex }, (_, k) => pivotIndex + 1 + k) : []
    });
    await sleep(animationSpeed);

    return pivotIndex;
}

// Toggle Pause
function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶️ 繼續' : '⏸️ 暫停';
}

// Check Pause
async function checkPause() {
    while (isPaused) {
        await sleep(100);
    }
}

// Reset Visualization
function resetVisualization() {
    isPaused = false;
    isSorting = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    generateBtn.disabled = false;
    pauseBtn.textContent = '⏸️ 暫停';
    generateArray();
}

// Sleep Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize MathJax
window.addEventListener('load', () => {
    if (window.MathJax) {
        MathJax.typesetPromise().catch((err) => console.log('MathJax error:', err));
    }
});
