// State
let currentString = "Hello C++";
const memoryStartAddr = 0x7ffc00; // Simulated base address

// DOM Elements
const arrayContainer = document.getElementById('arrayContainer');
const logContent = document.getElementById('logContent');
const mainStringInput = document.getElementById('mainStringInput');
const updateBtn = document.getElementById('updateBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderArray();

    // Event Listeners
    updateBtn.addEventListener('click', () => {
        currentString = mainStringInput.value;
        renderArray();
        logAction(`str = "${currentString}";`, "String updated manually.");
    });

    mainStringInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateBtn.click();
        }
    });
});

// Rendering Logic
function renderArray() {
    arrayContainer.innerHTML = '';

    // Create boxes for each character
    for (let i = 0; i < currentString.length; i++) {
        createCharBox(currentString[i], i);
    }

    // Add Null Terminator (visual only, to show C-style string concept if needed, 
    // though std::string manages this internally, it's good for education)
    const nullBox = document.createElement('div');
    nullBox.className = 'char-box-wrapper';
    nullBox.innerHTML = `
        <div class="char-box null-char">\\0</div>
        <span class="char-index">${currentString.length}</span>
        <span class="char-addr">0x${(memoryStartAddr + currentString.length).toString(16)}</span>
    `;
    arrayContainer.appendChild(nullBox);
}

function createCharBox(char, index, isNew = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'char-box-wrapper';
    if (isNew) wrapper.classList.add('new-item');

    wrapper.innerHTML = `
        <div class="char-box" id="box-${index}">${char === ' ' ? '&nbsp;' : char}</div>
        <span class="char-index">${index}</span>
        <span class="char-addr">0x${(memoryStartAddr + index).toString(16)}</span>
    `;

    arrayContainer.appendChild(wrapper);

    // If inserting in middle, we might need to re-order, but for simple render we just append
    // For complex animations (insert in middle), full re-render is easier but less animated.
    // We will stick to full re-render for simplicity unless specific animation is needed.
}

// Helper: Highlight Indices
async function highlightIndices(indices, type = 'primary', duration = 1000) {
    // Clear previous highlights
    document.querySelectorAll('.char-box').forEach(box => {
        box.classList.remove('highlight', 'highlight-secondary');
    });

    indices.forEach(idx => {
        const box = document.getElementById(`box-${idx}`);
        if (box) {
            box.classList.add(type === 'primary' ? 'highlight' : 'highlight-secondary');
        }
    });

    if (duration > 0) {
        await new Promise(r => setTimeout(r, duration));
        indices.forEach(idx => {
            const box = document.getElementById(`box-${idx}`);
            if (box) {
                box.classList.remove(type === 'primary' ? 'highlight' : 'highlight-secondary');
            }
        });
    }
}

// Logging
function logAction(code, message, isError = false) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${isError ? 'error' : ''}`;
    entry.innerHTML = `
        <span class="code">${code}</span>
        <p>${message}</p>
    `;
    logContent.prepend(entry);
}

function clearLog() {
    logContent.innerHTML = '';
}

// --- Operations ---

// 0. Length / Size
async function runLength() {
    const len = currentString.length;
    const code = `str.length(); // or str.size()`;

    // Highlight all characters
    const indices = [];
    for (let i = 0; i < len; i++) indices.push(i);

    await highlightIndices(indices, 'primary', 1500);
    logAction(code, `String length is ${len}.`);
}

// 1. Find
async function runFind() {
    const sub = document.getElementById('findInput').value;
    if (!sub) return;

    const idx = currentString.indexOf(sub);
    const code = `str.find("${sub}");`;

    if (idx !== -1) {
        // Highlight the found substring
        const indices = [];
        for (let i = 0; i < sub.length; i++) indices.push(idx + i);

        await highlightIndices(indices, 'primary', 2000);
        logAction(code, `Found "${sub}" at index ${idx}.`);
    } else {
        logAction(code, `"${sub}" not found. Returns std::string::npos (-1).`);
    }
}

// 2. Substr
async function runSubstr() {
    const pos = parseInt(document.getElementById('substrPos').value);
    const len = parseInt(document.getElementById('substrLen').value);

    if (isNaN(pos)) {
        logAction(`str.substr(...)`, "Invalid parameters.", true);
        return;
    }

    // C++ behavior: if len is omitted (we'll treat NaN as omitted/default), it goes to end
    const actualLen = isNaN(len) ? currentString.length - pos : len;

    try {
        if (pos > currentString.length) throw new Error("Position out of range");

        const result = currentString.substr(pos, actualLen);
        const code = `str.substr(${pos}, ${isNaN(len) ? '' : len});`;

        // Highlight
        const indices = [];
        for (let i = 0; i < result.length && (pos + i) < currentString.length; i++) {
            indices.push(pos + i);
        }

        await highlightIndices(indices, 'primary', 2000);
        logAction(code, `Result: "${result}"`);

    } catch (e) {
        logAction(`str.substr(${pos}, ...);`, "std::out_of_range exception!", true);
    }
}

// 3. At / []
async function runAt() {
    const pos = parseInt(document.getElementById('atPos').value);

    if (isNaN(pos)) return;

    const code = `str.at(${pos});`;

    if (pos >= 0 && pos < currentString.length) {
        await highlightIndices([pos], 'primary', 1500);
        logAction(code, `Character at index ${pos} is '${currentString[pos]}'.`);
    } else {
        logAction(code, `Index ${pos} is out of range! std::out_of_range exception.`, true);
    }
}

// 4. Append
function runAppend() {
    const text = document.getElementById('appendInput').value;
    if (!text) return;

    const oldLen = currentString.length;
    currentString += text;
    mainStringInput.value = currentString;

    // Render full array first
    renderArray();

    // Animate new items
    const newIndices = [];
    for (let i = 0; i < text.length; i++) newIndices.push(oldLen + i);

    // Manually add 'new-item' class to the newly created boxes for animation
    newIndices.forEach(idx => {
        const boxWrapper = arrayContainer.children[idx]; // children matches index because of 0-based + null terminator is last
        if (boxWrapper) boxWrapper.classList.add('new-item');
    });

    logAction(`str.append("${text}");`, `Appended "${text}". New length: ${currentString.length}.`);
}

// 5. Insert
function runInsert() {
    const pos = parseInt(document.getElementById('insertPos').value);
    const text = document.getElementById('insertStr').value;

    if (isNaN(pos) || !text) return;

    if (pos < 0 || pos > currentString.length) {
        logAction(`str.insert(${pos}, "${text}");`, "std::out_of_range exception!", true);
        return;
    }

    const part1 = currentString.substring(0, pos);
    const part2 = currentString.substring(pos);
    currentString = part1 + text + part2;
    mainStringInput.value = currentString;

    renderArray();

    // Highlight inserted
    const indices = [];
    for (let i = 0; i < text.length; i++) indices.push(pos + i);
    highlightIndices(indices, 'primary', 1000);

    logAction(`str.insert(${pos}, "${text}");`, `Inserted "${text}" at index ${pos}.`);
}

// 6. Erase
function runErase() {
    const pos = parseInt(document.getElementById('erasePos').value);
    const len = parseInt(document.getElementById('eraseLen').value);

    if (isNaN(pos)) return;

    if (pos < 0 || pos >= currentString.length) {
        logAction(`str.erase(${pos}, ...);`, "std::out_of_range exception!", true);
        return;
    }

    const actualLen = isNaN(len) ? currentString.length - pos : len;

    // Visual removal before data update (advanced) or just update (simple)
    // Let's just update for robustness, but maybe highlight what will be removed first?

    const indicesToRemove = [];
    for (let i = 0; i < actualLen && (pos + i) < currentString.length; i++) {
        indicesToRemove.push(pos + i);
    }

    // Highlight red before removing
    indicesToRemove.forEach(idx => {
        const box = document.getElementById(`box-${idx}`);
        if (box) {
            box.style.backgroundColor = '#ef4444';
            box.style.borderColor = '#ef4444';
        }
    });

    setTimeout(() => {
        const part1 = currentString.substring(0, pos);
        const part2 = currentString.substring(pos + actualLen);
        currentString = part1 + part2;
        mainStringInput.value = currentString;

        renderArray();
        logAction(`str.erase(${pos}, ${actualLen});`, `Erased ${actualLen} characters starting at ${pos}.`);
    }, 500);
}

// 7. Replace
function runReplace() {
    const pos = parseInt(document.getElementById('replacePos').value);
    const len = parseInt(document.getElementById('replaceLen').value);
    const str = document.getElementById('replaceStr').value;

    if (isNaN(pos) || isNaN(len) || str === undefined) return;

    if (pos < 0 || pos > currentString.length) { // Replace allows pos == length (append)
        logAction(`str.replace(${pos}, ...);`, "std::out_of_range exception!", true);
        return;
    }

    // C++ replace: replaces 'len' chars starting at 'pos' with 'str'
    // Note: 'str' length doesn't have to match 'len'

    const part1 = currentString.substring(0, pos);
    const part2 = currentString.substring(pos + len);
    currentString = part1 + str + part2;
    mainStringInput.value = currentString;

    renderArray();

    // Highlight the new segment
    const newIndices = [];
    for (let i = 0; i < str.length; i++) newIndices.push(pos + i);
    highlightIndices(newIndices, 'primary', 1000);

    logAction(`str.replace(${pos}, ${len}, "${str}");`, `Replaced ${len} chars at ${pos} with "${str}".`);
}
