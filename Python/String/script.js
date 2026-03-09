document.addEventListener('DOMContentLoaded', () => {
    initIndexingDemo();
    initSlicingDemo();
    initSplitDemo();
    initMethodLab();
    initFindReplace();
    initJoinDemo();
});

// 1.5 Slicing Demo
function initSlicingDemo() {
    const sourceEl = document.getElementById('slice-source');
    const startEl = document.getElementById('slice-start');
    const endEl = document.getElementById('slice-end');
    const stepEl = document.getElementById('slice-step');
    const resEl = document.getElementById('slice-result');
    const codeEl = document.getElementById('slice-code');

    function update() {
        const str = sourceEl.value;
        let start = startEl.value === "" ? undefined : parseInt(startEl.value);
        let end = endEl.value === "" ? undefined : parseInt(endEl.value);
        let step = stepEl.value === "" ? 1 : parseInt(stepEl.value);

        if (isNaN(step)) step = 1;

        let result = "";

        // Correct Python Slicing Logic in JS
        // Convert negative indices
        const len = str.length;

        if (start === undefined) start = (step > 0) ? 0 : len - 1;
        if (end === undefined) end = (step > 0) ? len : -len - 1; // Slightly tricky for end in JS loop

        // Use custom loop to simulate python slicing
        let resArr = [];

        // Normalize indices for loop
        let k = start;
        if (k < 0) k += len;

        let stop = end;
        if (stop < 0) stop += len;

        // Handle out of bounds by clamping? Python handles them gracefully.
        // We will just try to emulate the logic:

        // Simpler approach: Map python logic 1:1
        // If step > 0
        if (step > 0) {
            // Boundaries
            if (start < 0) start += len;
            if (start < 0) start = 0;
            if (start > len) start = len;

            if (end < 0) end += len;
            if (end < 0) end = 0;
            if (end > len) end = len; // Python allows end > len

            for (let i = start; i < end; i += step) {
                if (i >= 0 && i < len) resArr.push(str[i]);
            }
        } else if (step < 0) {
            // Negative step
            if (startEl.value === "") start = len - 1;
            else if (start < 0) start += len;

            if (endEl.value === "") end = -1; // virtual stop before 0
            else if (end < 0) end += len;

            // Clamp for loop
            if (start >= len) start = len - 1;

            for (let i = start; i > end; i += step) {
                if (i >= 0 && i < len) resArr.push(str[i]);
            }
        } else {
            // step is 0 - error in python usually
            resArr = ["Error: step cannot be 0"];
        }

        result = resArr.join('');

        // Display Code
        let sDisp = startEl.value;
        let eDisp = endEl.value;
        let stDisp = stepEl.value;

        // Format: [start:end:step]
        // If step is empty/1, usually hide unless specific
        let codeStr = `"${str}"[${sDisp}:${eDisp}`;
        if (stDisp !== "") codeStr += `:${stDisp}`;
        codeStr += `]`;

        if (step === 0) {
            resEl.innerHTML = `<span style='color:var(--accent-pink)'>ValueError: slice step cannot be zero</span>`;
        } else {
            resEl.textContent = `"${result}"`;
            resEl.style.animation = 'none';
            resEl.offsetHeight;
            resEl.style.animation = 'popIn 0.3s';
        }
        codeEl.textContent = codeStr;
    }

    [sourceEl, startEl, endEl, stepEl].forEach(el => {
        el.addEventListener('input', update);
    });

    update();
}


// 1. Indexing Demo
function initIndexingDemo() {
    const defaultStr = "Python";
    const container = document.getElementById('indexing-demo');
    const displayInfo = document.getElementById('index-display');

    function render(str) {
        container.innerHTML = '';
        str.split('').forEach((char, idx) => {
            const box = document.createElement('div');
            box.className = 'char-box';

            const charSpan = document.createElement('span');
            charSpan.className = 'char-val';
            charSpan.textContent = char;

            const idxSpan = document.createElement('span');
            idxSpan.className = 'char-idx';
            idxSpan.textContent = idx;

            box.appendChild(charSpan);
            box.appendChild(idxSpan);

            box.addEventListener('mouseenter', () => {
                box.classList.add('active');
                displayInfo.innerHTML = `Char: <span style="color:white">'${char}'</span> | Index: <span style="color:var(--accent-blue)">${idx}</span> | Negative Index: <span style="color:var(--accent-pink)">${idx - str.length}</span>`;
            });

            box.addEventListener('mouseleave', () => {
                box.classList.remove('active');
                displayInfo.textContent = '點擊上方字元';
            });

            container.appendChild(box);
        });
    }

    render(defaultStr);
}

// 2. Split Demo
function initSplitDemo() {
    const btn = document.getElementById('btn-split');
    const inputSource = document.getElementById('split-source');
    const inputSep = document.getElementById('split-separator');
    const resultContainer = document.getElementById('split-result');
    const codeSep = document.getElementById('code-sep');

    function executeSplit() {
        const source = inputSource.value;
        const separator = inputSep.value;

        let result = [];
        let codeHtml = '';

        if (separator === "") {
            // Default whitespace split simulation
            result = source.trim().split(/\s+/);
            codeHtml = '';
        } else {
            result = source.split(separator);
            codeHtml = `"${separator}"`;
        }

        codeSep.textContent = codeHtml;
        resultContainer.innerHTML = '';

        result.forEach((item, index) => {
            // Visualize empty strings clearly
            const displayItem = item === "" ? "(empty)" : item;

            const el = document.createElement('div');
            el.className = 'list-item';
            el.style.animationDelay = `${index * 0.1}s`;
            el.innerHTML = `"${item}"`; // Add quotes to look like python strings
            resultContainer.appendChild(el);
        });

        if (result.length === 0 || (result.length === 1 && result[0] === "")) {
            resultContainer.innerHTML = '<span style="color:gray">// Empty List</span>';
        }
    }

    btn.addEventListener('click', executeSplit);
    // Initial run
    executeSplit();
}

// 3. Method Lab
function initMethodLab() {
    const input = document.getElementById('lab-input');
    const inputLen = document.getElementById('input-len');
    const outBox = document.getElementById('lab-output');
    const codeEcho = document.getElementById('lab-code');
    const buttons = document.querySelectorAll('.method-btn');

    function updateLen() {
        inputLen.textContent = input.value.length;
    }

    input.addEventListener('input', updateLen);
    updateLen();

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.dataset.method;
            const original = input.value;
            let result = "";
            let code = `"${original}".${method}()`;

            try {
                switch (method) {
                    case 'strip': result = original.trim(); break;
                    case 'lstrip': result = original.trimStart(); break; // JS equivalent
                    case 'rstrip': result = original.trimEnd(); break;   // JS equivalent
                    case 'upper': result = original.toUpperCase(); break;
                    case 'lower': result = original.toLowerCase(); break;
                    case 'title':
                        // Simple Python title() simulation (JS doesn't have native title())
                        result = original.toLowerCase().replace(/(?:^|\s)\w/g, function (a) { return a.toUpperCase(); });
                        break;
                    case 'swapcase':
                        // Simple swapcase simulation
                        result = original.split('').map(c => {
                            return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
                        }).join('');
                        break;
                }

                // Visualize spaces in result for strip methods
                if (method.includes('strip')) {
                    // Replace spaces with middle dots for visualization in output only if visual clarity needed? 
                    // No, let's just show raw selection style or background. 
                    // Actually, let's reset opacity to highlight change
                    outBox.style.animation = 'none';
                    outBox.offsetHeight; /* trigger reflow */
                    outBox.style.animation = 'popIn 0.3s';
                }

                outBox.textContent = `"${result}"`;
                codeEcho.textContent = `>>> ${code}`;

            } catch (e) {
                outBox.textContent = "Error";
            }
        });
    });

    // Trigger default
    buttons[0].click();
}

// 4. Find & Replace
function initFindReplace() {
    const sourceEl = document.getElementById('fr-source');

    // Find
    const findQuery = document.getElementById('find-query');
    const findBtn = document.getElementById('btn-find');
    const findRes = document.getElementById('find-result');

    findBtn.addEventListener('click', () => {
        const str = sourceEl.value;
        const q = findQuery.value;
        const idx = str.indexOf(q);
        findRes.textContent = `結果索引: ${idx}`;
        if (idx !== -1) {
            findRes.style.color = 'var(--accent-blue)';
        } else {
            findRes.style.color = 'var(--accent-pink)';
        }
    });

    // Replace
    const oldStr = document.getElementById('replace-old');
    const newStr = document.getElementById('replace-new');
    const repBtn = document.getElementById('btn-replace');
    const repOut = document.getElementById('replace-output');

    repBtn.addEventListener('click', () => {
        const str = sourceEl.value;
        const oldVal = oldStr.value;
        const newVal = newStr.value;

        // JS replace only replaces first occurrence by default (like Python replace default count)
        // Python: str.replace(old, new, [count]) -> replaces all by default actually!
        // Wait, Python 'replace' replaces ALL occurrences by default. JS replace(str, str) only first.
        // We should simulate Python behavior -> replaceAll

        const res = str.split(oldVal).join(newVal);
        repOut.textContent = `"${res}"`;
    });
}

// 5. Join Demo
function initJoinDemo() {
    const inputList = document.getElementById('join-list');
    const inputSep = document.getElementById('join-sep');
    const btn = document.getElementById('btn-join');
    const result = document.getElementById('join-result');
    const sepDisplay = document.getElementById('join-sep-display');

    btn.addEventListener('click', () => {
        const listStr = inputList.value;
        const sep = inputSep.value;

        // Parse "list"
        const listItems = listStr.split(',').map(s => s.trim());

        const joined = listItems.join(sep);

        sepDisplay.textContent = sep;
        result.textContent = `"${joined}"`;
        result.style.animation = 'none';
        result.offsetHeight;
        result.style.animation = 'popIn 0.3s';
    });

    btn.click();
}
