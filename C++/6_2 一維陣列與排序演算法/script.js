// Global State
let arrayData = [];
let sortingArray = [];
let searchArray = [];
let animationSpeed = 50;
let isSorting = false;
let isSearching = false;
let isPaused = false;
let stopRequested = false;

// DOM Elements
const arrayContainer = document.getElementById('array-container');
const searchContainer = document.getElementById('search-container');
const sortContainer = document.getElementById('sort-container');
const codeOutput = document.getElementById('code-output');
const sortExplanation = document.getElementById('sort-explanation');
const searchStatus = document.getElementById('search-status');
const speedSlider = document.getElementById('speed-slider');
const btnStartSort = document.getElementById('btn-start-sort');
const btnPauseSort = document.getElementById('btn-pause-sort');
const btnStopSort = document.getElementById('btn-stop-sort');

// --- Utility Functions ---

const getDelay = () => {
    // Map 1-100 slider to 1000ms-10ms delay
    return 1010 - (speedSlider.value * 10);
};

const sleep = async (ms) => {
    if (stopRequested) throw new Error("Stopped");

    // Initial wait
    await new Promise(resolve => setTimeout(resolve, ms));

    // Check for pause
    while (isPaused) {
        if (stopRequested) throw new Error("Stopped");
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (stopRequested) throw new Error("Stopped");
};

const generateRandomArray = (size, min = 1, max = 99) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// --- Section 1: Array Basics ---

function renderArrayBasics() {
    arrayContainer.innerHTML = '';
    arrayData.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'array-box';
        box.id = `box-${index}`;
        box.textContent = value;

        const indexLabel = document.createElement('div');
        indexLabel.className = 'index-label';
        indexLabel.textContent = index;
        box.appendChild(indexLabel);

        arrayContainer.appendChild(box);
    });
}

document.getElementById('btn-create-array').addEventListener('click', () => {
    const size = parseInt(document.getElementById('array-size-input').value);
    if (size < 3 || size > 20) {
        alert("Please enter a size between 3 and 20.");
        return;
    }
    arrayData = new Array(size).fill(0);
    renderArrayBasics();
    codeOutput.textContent = `// Create array of size ${size}\nint arr[${size}] = {0};`;
});

document.getElementById('btn-random-array').addEventListener('click', () => {
    const size = arrayData.length || 10;
    arrayData = generateRandomArray(size);
    renderArrayBasics();
    codeOutput.textContent = `// Randomize values\nint arr[${size}] = {${arrayData.join(', ')}};`;
});

document.getElementById('btn-update').addEventListener('click', async () => {
    const index = parseInt(document.getElementById('access-index').value);
    const value = document.getElementById('update-value').value;

    if (isNaN(index) || index < 0 || index >= arrayData.length) {
        alert("Invalid Index");
        return;
    }

    const box = document.getElementById(`box-${index}`);

    // Highlight access
    box.classList.add('highlight');
    codeOutput.textContent = `// Accessing index ${index}\ncout << arr[${index}]; // Output: ${arrayData[index]}`;

    await new Promise(resolve => setTimeout(resolve, 1000)); // Don't use interruptible sleep here for simplicity

    if (value !== "") {
        // Update
        arrayData[index] = parseInt(value);
        box.childNodes[0].nodeValue = value; // Update text but keep index label
        codeOutput.textContent = `// Updating index ${index}\narr[${index}] = ${value};`;
        box.classList.add('swap'); // Red color for change
        await new Promise(resolve => setTimeout(resolve, 500));
        box.classList.remove('swap');
    }

    box.classList.remove('highlight');
});

// --- Section 2: Searching ---

function renderSearchArray() {
    searchContainer.innerHTML = '';
    searchArray.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'array-box';
        box.id = `search-box-${index}`;
        box.textContent = value;

        const indexLabel = document.createElement('div');
        indexLabel.className = 'index-label';
        indexLabel.textContent = index;
        box.appendChild(indexLabel);

        searchContainer.appendChild(box);
    });
}

// Initialize search array
searchArray = generateRandomArray(10);
renderSearchArray();

document.getElementById('btn-start-search').addEventListener('click', async () => {
    if (isSearching) return;
    isSearching = true;
    const target = parseInt(document.getElementById('search-target').value);

    if (isNaN(target)) {
        alert("Please enter a target value");
        isSearching = false;
        return;
    }

    searchStatus.textContent = `Searching for ${target}...`;

    // Reset visuals
    const boxes = searchContainer.children;
    for (let box of boxes) box.className = 'array-box';

    // Sequential Search Logic
    let found = false;
    for (let i = 0; i < searchArray.length; i++) {
        const box = boxes[i];
        box.classList.add('compare'); // Yellow
        searchStatus.textContent = `Checking index ${i}: Is ${searchArray[i]} == ${target}?`;

        await new Promise(resolve => setTimeout(resolve, getDelay())); // Simple sleep

        if (searchArray[i] === target) {
            box.classList.remove('compare');
            box.classList.add('sorted'); // Green
            searchStatus.textContent = `Found ${target} at index ${i}!`;
            found = true;
            break;
        } else {
            box.classList.remove('compare');
            // Optional: mark as visited/checked
            box.style.opacity = '0.5';
        }
    }

    if (!found) {
        searchStatus.textContent = `${target} not found in the array.`;
    }

    // Reset opacity after a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    for (let box of boxes) box.style.opacity = '1';
    isSearching = false;
});

// --- Section 3: Sorting ---

let currentSortAlgo = 'bubble';

// Tab Switching
document.querySelectorAll('#sorting-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSorting) return; // Prevent switching while sorting
        document.querySelectorAll('#sorting-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSortAlgo = btn.dataset.algo;
        sortExplanation.textContent = `Selected: ${btn.textContent}. Click Start to begin.`;
    });
});

function renderSortArray() {
    sortContainer.innerHTML = '';
    // Find max value for height scaling
    const maxVal = Math.max(...sortingArray, 1);

    sortingArray.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'sort-bar';
        bar.style.height = `${(value / maxVal) * 100}%`;
        bar.textContent = value;
        bar.id = `sort-bar-${index}`;
        sortContainer.appendChild(bar);
    });
}

// Initialize sort array
sortingArray = generateRandomArray(15);
renderSortArray();

document.getElementById('btn-generate-sort-array').addEventListener('click', () => {
    if (isSorting) return;
    sortingArray = generateRandomArray(15);
    renderSortArray();
    sortExplanation.textContent = "New array generated.";
    // Reset buttons just in case
    resetSortControls();
});

function resetSortControls() {
    isSorting = false;
    isPaused = false;
    stopRequested = false;
    btnStartSort.disabled = false;
    btnPauseSort.disabled = true;
    btnStopSort.disabled = true;
    btnPauseSort.textContent = "Pause";
}

btnStartSort.addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    stopRequested = false;
    isPaused = false;

    btnStartSort.disabled = true;
    btnPauseSort.disabled = false;
    btnStopSort.disabled = false;
    btnPauseSort.textContent = "Pause";

    // Reset colors
    const bars = document.querySelectorAll('.sort-bar');
    bars.forEach(bar => bar.className = 'sort-bar');

    try {
        switch (currentSortAlgo) {
            case 'bubble': await bubbleSort(); break;
            case 'selection': await selectionSort(); break;
            case 'insertion': await insertionSort(); break;
            case 'merge': await mergeSort(0, sortingArray.length - 1); break;
            case 'quick': await quickSort(0, sortingArray.length - 1); break;
            case 'radix': await radixSort(); break;
        }
        sortExplanation.textContent = "Sorting Complete!";
        // Mark all green
        document.querySelectorAll('.sort-bar').forEach(bar => bar.classList.add('sorted'));
    } catch (error) {
        if (error.message === "Stopped") {
            sortExplanation.textContent = "Sorting Stopped.";
        } else {
            console.error(error);
            sortExplanation.textContent = "Error occurred.";
        }
    } finally {
        resetSortControls();
    }
});

btnPauseSort.addEventListener('click', () => {
    if (!isSorting) return;
    isPaused = !isPaused;
    btnPauseSort.textContent = isPaused ? "Resume" : "Pause";
    sortExplanation.textContent = isPaused ? "Paused..." : "Resuming...";
});

btnStopSort.addEventListener('click', () => {
    if (!isSorting) return;
    stopRequested = true;
    isPaused = false; // Resume to allow exit
});

// --- Sorting Algorithms ---

async function swap(i, j) {
    const bars = document.querySelectorAll('.sort-bar');

    // Validation to prevent errors
    if (!bars[i] || !bars[j]) {
        console.error(`Invalid indices for swap: ${i}, ${j}`);
        return;
    }

    bars[i].classList.add('swap');
    bars[j].classList.add('swap');

    await sleep(getDelay());

    // Swap data
    let temp = sortingArray[i];
    sortingArray[i] = sortingArray[j];
    sortingArray[j] = temp;

    // Visual Swap
    // We swap the height and text content to match the data swap
    let h1 = bars[i].style.height;
    let t1 = bars[i].textContent;
    let h2 = bars[j].style.height;
    let t2 = bars[j].textContent;

    bars[i].style.height = h2;
    bars[i].textContent = t2;
    bars[j].style.height = h1;
    bars[j].textContent = t1;

    await sleep(getDelay());

    bars[i].classList.remove('swap');
    bars[j].classList.remove('swap');
}

async function bubbleSort() {
    const len = sortingArray.length;
    const bars = document.querySelectorAll('.sort-bar');

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            // Check stop
            if (stopRequested) throw new Error("Stopped");

            bars[j].classList.add('compare');
            bars[j + 1].classList.add('compare');

            sortExplanation.textContent = `Comparing ${sortingArray[j]} and ${sortingArray[j + 1]}`;
            await sleep(getDelay());

            if (sortingArray[j] > sortingArray[j + 1]) {
                sortExplanation.textContent = `${sortingArray[j]} > ${sortingArray[j + 1]}, Swapping...`;
                await swap(j, j + 1);
            }

            bars[j].classList.remove('compare');
            bars[j + 1].classList.remove('compare');
        }
        bars[len - i - 1].classList.add('sorted');
    }
}

async function selectionSort() {
    const len = sortingArray.length;
    const bars = document.querySelectorAll('.sort-bar');

    for (let i = 0; i < len; i++) {
        let minIdx = i;
        bars[i].classList.add('pivot'); // Current position

        for (let j = i + 1; j < len; j++) {
            if (stopRequested) throw new Error("Stopped");

            bars[j].classList.add('compare');
            sortExplanation.textContent = `Finding minimum... Checking ${sortingArray[j]}`;
            await sleep(getDelay());

            if (sortingArray[j] < sortingArray[minIdx]) {
                if (minIdx !== i) bars[minIdx].classList.remove('swap'); // Unmark old min
                minIdx = j;
                bars[minIdx].classList.add('swap'); // Mark new min
            } else {
                bars[j].classList.remove('compare');
            }
        }

        if (minIdx !== i) {
            await swap(i, minIdx);
        }

        bars[minIdx].classList.remove('swap');
        bars[i].classList.remove('pivot');
        bars[i].classList.add('sorted');

        // Cleanup remaining yellow
        for (let k = i + 1; k < len; k++) bars[k].classList.remove('compare');
    }
}

async function insertionSort() {
    const len = sortingArray.length;
    const bars = document.querySelectorAll('.sort-bar');

    for (let i = 1; i < len; i++) {
        let key = sortingArray[i];
        let j = i - 1;

        bars[i].classList.add('pivot'); // Element to insert
        sortExplanation.textContent = `Inserting ${key}...`;
        await sleep(getDelay());

        while (j >= 0 && sortingArray[j] > key) {
            if (stopRequested) throw new Error("Stopped");

            bars[j].classList.add('compare');
            sortExplanation.textContent = `${sortingArray[j]} > ${key}, shifting ${sortingArray[j]} right`;

            // Visual shift
            // Instead of full swap, we overwrite j+1 with j
            sortingArray[j + 1] = sortingArray[j];

            // Visual update
            bars[j + 1].style.height = bars[j].style.height;
            bars[j + 1].textContent = bars[j].textContent;

            await sleep(getDelay());
            bars[j].classList.remove('compare');

            j = j - 1;
        }
        sortingArray[j + 1] = key;

        // Visual update for key placement
        const currentMax = Math.max(...sortingArray);
        bars[j + 1].style.height = `${(key / currentMax) * 100}%`;
        bars[j + 1].textContent = key;

        bars[i].classList.remove('pivot');

        // Mark sorted portion (0 to i)
        for (let k = 0; k <= i; k++) bars[k].classList.add('sorted');
    }
}

async function mergeSort(start, end) {
    if (start >= end) return;
    if (stopRequested) throw new Error("Stopped");

    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    if (stopRequested) throw new Error("Stopped");
    const bars = document.querySelectorAll('.sort-bar');
    sortExplanation.textContent = `Merging range [${start}, ${end}]`;

    // Mark range
    for (let i = start; i <= end; i++) bars[i].classList.add('compare');
    await sleep(getDelay());

    let left = sortingArray.slice(start, mid + 1);
    let right = sortingArray.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        if (stopRequested) throw new Error("Stopped");
        if (left[i] <= right[j]) {
            sortingArray[k] = left[i];
            i++;
        } else {
            sortingArray[k] = right[j];
            j++;
        }
        // Visual Update
        updateBar(k, sortingArray[k]);
        bars[k].classList.add('swap');
        await sleep(getDelay());
        bars[k].classList.remove('swap');
        k++;
    }

    while (i < left.length) {
        if (stopRequested) throw new Error("Stopped");
        sortingArray[k] = left[i];
        updateBar(k, sortingArray[k]);
        await sleep(getDelay());
        i++; k++;
    }

    while (j < right.length) {
        if (stopRequested) throw new Error("Stopped");
        sortingArray[k] = right[j];
        updateBar(k, sortingArray[k]);
        await sleep(getDelay());
        j++; k++;
    }

    // Unmark range
    for (let i = start; i <= end; i++) {
        bars[i].classList.remove('compare');
        bars[i].classList.add('sorted'); // Temporary sorted status for this range
    }
}

function updateBar(index, value) {
    const bars = document.querySelectorAll('.sort-bar');
    if (!bars[index]) return;
    const maxVal = Math.max(...sortingArray, 1);
    bars[index].style.height = `${(value / maxVal) * 100}%`;
    bars[index].textContent = value;
}

async function quickSort(start, end) {
    if (start >= end) return;
    if (stopRequested) throw new Error("Stopped");

    let index = await partition(start, end);
    await quickSort(start, index - 1);
    await quickSort(index + 1, end);
}

async function partition(start, end) {
    const bars = document.querySelectorAll('.sort-bar');
    let pivotIndex = start;
    let pivotValue = sortingArray[end];

    bars[end].classList.add('pivot'); // Pivot
    sortExplanation.textContent = `Partitioning with pivot ${pivotValue}`;

    for (let i = start; i < end; i++) {
        if (stopRequested) throw new Error("Stopped");
        bars[i].classList.add('compare');
        await sleep(getDelay());

        if (sortingArray[i] < pivotValue) {
            await swap(i, pivotIndex);
            pivotIndex++;
        }
        bars[i].classList.remove('compare');
    }

    await swap(pivotIndex, end);
    bars[end].classList.remove('pivot');
    bars[pivotIndex].classList.add('sorted');

    return pivotIndex;
}

async function radixSort() {
    const bars = document.querySelectorAll('.sort-bar');
    const maxNum = Math.max(...sortingArray);
    let maxDigits = Math.floor(Math.log10(maxNum)) + 1;

    for (let k = 0; k < maxDigits; k++) {
        let buckets = Array.from({ length: 10 }, () => []);

        sortExplanation.textContent = `Radix Sort: Bucketing by 10^${k} place`;

        for (let i = 0; i < sortingArray.length; i++) {
            if (stopRequested) throw new Error("Stopped");
            let digit = Math.floor(sortingArray[i] / Math.pow(10, k)) % 10;
            buckets[digit].push(sortingArray[i]);

            bars[i].classList.add('compare');
            await sleep(getDelay() / 2);
            bars[i].classList.remove('compare');
        }

        // Flatten buckets back to array
        let newArray = [].concat(...buckets);
        sortingArray = newArray;

        // Visual update entire array
        for (let i = 0; i < sortingArray.length; i++) {
            if (stopRequested) throw new Error("Stopped");
            updateBar(i, sortingArray[i]);
            bars[i].classList.add('swap');
            await sleep(getDelay() / 2);
            bars[i].classList.remove('swap');
        }
    }
}

// Initial Render
renderArrayBasics();
