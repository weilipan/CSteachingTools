document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const arrayContainer = document.getElementById('arrayContainer');
    const codeBlock = document.getElementById('codeBlock');
    const statusMessage = document.getElementById('statusMessage');
    
    const inputSize = document.getElementById('arraySize');
    const btnCreate = document.getElementById('btnCreate');
    
    const inputIndex = document.getElementById('accessIndex');
    const inputValue = document.getElementById('newValue');
    const btnUpdate = document.getElementById('btnUpdate');
    
    const btnTraverse = document.getElementById('btnTraverse');

    // State
    let currentArray = [];
    let isAnimating = false;

    // Constants
    const ANIMATION_DELAY = 800; // ms

    // Initialize
    createArray(5);

    // Event Listeners
    btnCreate.addEventListener('click', () => {
        if (isAnimating) return;
        const size = parseInt(inputSize.value);
        if (size > 0 && size <= 10) {
            createArray(size);
        } else {
            setStatus("Please enter a size between 1 and 10.", true);
        }
    });

    btnUpdate.addEventListener('click', () => {
        if (isAnimating) return;
        const index = parseInt(inputIndex.value);
        const value = parseInt(inputValue.value);
        
        if (index >= 0 && index < currentArray.length) {
            updateElement(index, value);
        } else {
            setStatus(`Index out of bounds! Valid range: 0 to ${currentArray.length - 1}`, true);
        }
    });

    btnTraverse.addEventListener('click', () => {
        if (isAnimating) return;
        if (currentArray.length === 0) {
            setStatus("Create an array first!", true);
            return;
        }
        runTraversalAnimation();
    });

    // Functions
    function createArray(size) {
        currentArray = new Array(size).fill(0);
        renderArray();
        
        // Update Controls
        inputIndex.max = size - 1;
        
        // Update Code View
        logCode(`// Declaration\nint arr[${size}];\n\n// Initialization (default 0)\n// Memory allocated for ${size} integers.`);
        setStatus(`Created array of size ${size}.`);
    }

    function renderArray() {
        arrayContainer.innerHTML = '';
        currentArray.forEach((value, index) => {
            const el = document.createElement('div');
            el.className = 'array-element';
            el.id = `idx-${index}`;
            
            // Mock memory address (hex)
            const address = `0x${(7000 + index * 4).toString(16).toUpperCase()}`;

            el.innerHTML = `
                <div class="element-box">${value}</div>
                <div class="element-index">index: ${index}</div>
                <div class="element-address">${address}</div>
            `;
            arrayContainer.appendChild(el);
        });
    }

    async function updateElement(index, value) {
        isAnimating = true;
        disableControls(true);

        const el = document.getElementById(`idx-${index}`);
        const box = el.querySelector('.element-box');

        // Highlight
        el.classList.add('active-access');
        logCode(`arr[${index}] = ${value};\n// Accessing memory at index ${index}...`);
        setStatus(`Accessing index ${index}...`);

        await wait(500);

        // Change Value
        currentArray[index] = value;
        box.textContent = value;
        box.style.transform = 'scale(0.8)'; // Pop effect
        
        await wait(200);
        box.style.transform = 'scale(1)';
        
        setStatus(`Updated index ${index} to value ${value}.`);
        
        await wait(500);
        el.classList.remove('active-access');
        
        isAnimating = false;
        disableControls(false);
    }

    async function runTraversalAnimation() {
        isAnimating = true;
        disableControls(true);
        
        logCode(`for(int i = 0; i < ${currentArray.length}; i++) {\n    // Visiting arr[i]\n}`);
        setStatus("Starting loop traversal...");

        for (let i = 0; i < currentArray.length; i++) {
            const el = document.getElementById(`idx-${i}`);
            
            // Highlight current
            el.classList.add('highlighted');
            setStatus(`i = ${i}, accessing arr[${i}] (Value: ${currentArray[i]})`);
            
            // Update code view dynamically
            logCode(`for(int i = 0; i < ${currentArray.length}; i++) {\n    // i = ${i}\n    cout << arr[${i}]; // ${currentArray[i]}\n}`);

            await wait(ANIMATION_DELAY);

            el.classList.remove('highlighted');
        }

        setStatus("Traversal complete.");
        logCode(`// Loop finished.`);
        isAnimating = false;
        disableControls(false);
    }

    // Utilities
    function logCode(text) {
        codeBlock.textContent = text;
    }

    function setStatus(text, isError = false) {
        statusMessage.textContent = text;
        statusMessage.style.color = isError ? '#ef4444' : 'var(--accent-color)';
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function disableControls(disabled) {
        btnCreate.disabled = disabled;
        btnUpdate.disabled = disabled;
        btnTraverse.disabled = disabled;
        inputSize.disabled = disabled;
        inputIndex.disabled = disabled;
        inputValue.disabled = disabled;
    }
});
