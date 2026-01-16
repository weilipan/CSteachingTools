const codeLines = [
    { line: 5, type: 'start', text: 'int main() {' },
    { line: 7, type: 'declare', varName: 'age', varType: 'int', value: 18, text: 'int age = 18;' },
    { line: 8, type: 'declare', varName: 'height', varType: 'double', value: 1.75, text: 'double height = 1.75;' },
    { line: 9, type: 'declare', varName: 'name', varType: 'string', value: '"Alice"', text: 'string name = "Alice";' },
    { line: 12, type: 'cout', content: 'Name: Alice\n', text: 'cout << "Name: " << name << endl;' },
    { line: 13, type: 'cout', content: 'Age: 18\n', text: 'cout << "Age: " << age << endl;' },
    { line: 16, type: 'declare', varName: 'newAge', varType: 'int', value: '?', text: 'int newAge;' },
    { line: 17, type: 'cout', content: 'Enter new age: ', text: 'cout << "Enter new age: ";' },
    { line: 18, type: 'cin', varName: 'newAge', text: 'cin >> newAge;' },
    { line: 21, type: 'update', varName: 'age', sourceVar: 'newAge', text: 'age = newAge;' },
    { line: 22, type: 'cout', content: 'Updated Age: ', varName: 'age', text: 'cout << "Updated Age: " << age << endl;' },
    { line: 24, type: 'end', text: 'return 0;' }
];

let currentStep = -1;
let memory = {};
let history = [];

const codeDisplay = document.getElementById('code-display');
const highlightLine = document.getElementById('highlight-line');
const memoryContainer = document.getElementById('memory-container');
const consoleOutput = document.getElementById('console-output');
const inputArea = document.getElementById('input-area');
const consoleInput = document.getElementById('console-input');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnReset = document.getElementById('btn-reset');
const submitInputBtn = document.getElementById('submit-input');

// Initialize
function init() {
    updateHighlight();
    updateControls();
}

function updateControls() {
    btnPrev.disabled = currentStep < 0;
    btnNext.disabled = currentStep >= codeLines.length - 1;
}

function updateHighlight() {
    const nextStepIndex = currentStep + 1;
    if (codeLines[nextStepIndex]) {
        highlightCode(codeLines[nextStepIndex].line);
    } else {
        highlightLine.style.display = 'none';
    }
}

function highlightCode(lineNum) {
    // Adjust for 0-based index. 
    // Assuming the browser strips the initial newline in <pre><code>
    // Line 1 (#include) is at index 0.
    // Line 5 (int main) is at index 4.
    const visualIndex = lineNum - 1;
    const lineHeight = 22.4; // 14px * 1.6

    highlightLine.style.display = 'block';
    highlightLine.style.top = `${visualIndex * lineHeight + 15}px`; // 15px padding
}

function renderMemory() {
    memoryContainer.innerHTML = '';
    if (Object.keys(memory).length === 0) {
        memoryContainer.innerHTML = '<div class="memory-placeholder">尚未宣告變數</div>';
        return;
    }

    for (const [name, data] of Object.entries(memory)) {
        const block = document.createElement('div');
        block.className = `memory-block type-${data.type}`;
        block.id = `mem-${name}`;

        block.innerHTML = `
            <div class="mem-type">${data.type}</div>
            <div class="mem-header">
                <span class="mem-name">${name}</span>
                <span class="mem-address">${data.address}</span>
            </div>
            <div class="mem-value">${data.value}</div>
        `;
        memoryContainer.appendChild(block);
    }
}

function generateAddress() {
    return '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
}

function addToConsole(text) {
    const span = document.createElement('span');
    span.textContent = text;
    consoleOutput.appendChild(span);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
    consoleOutput.innerHTML = '';
}

async function executeStep(stepIndex, isForward = true) {
    const step = codeLines[stepIndex];
    // Note: Highlighting is now handled by updateHighlight()

    if (!isForward) {
        // Restore state from history
        const state = history[stepIndex]; // State BEFORE this step
        if (state) {
            memory = JSON.parse(JSON.stringify(state.memory));
            consoleOutput.innerHTML = state.consoleHTML;
            renderMemory();
        } else {
            // Initial state
            memory = {};
            clearConsole();
            renderMemory();
        }
        inputArea.style.display = 'none';
        return;
    }

    // Save current state before executing
    history[stepIndex] = {
        memory: JSON.parse(JSON.stringify(memory)),
        consoleHTML: consoleOutput.innerHTML
    };

    switch (step.type) {
        case 'declare':
            memory[step.varName] = {
                type: step.varType,
                value: step.value,
                address: generateAddress()
            };
            renderMemory();
            // Animation effect
            setTimeout(() => {
                const el = document.getElementById(`mem-${step.varName}`);
                if (el) el.classList.add('flash-update');
            }, 50);
            break;

        case 'cout':
            if (step.varName) {
                // Dynamic output with variable
                addToConsole(`Updated Age: ${memory[step.varName].value}\n`);
            } else {
                addToConsole(step.content);
            }
            break;

        case 'cin':
            inputArea.style.display = 'flex';
            consoleInput.value = '';
            consoleInput.focus();
            btnNext.disabled = true; // Block next until input
            btnPrev.disabled = true; // Block prev during input

            // Wait for user input
            await new Promise(resolve => {
                const handler = () => {
                    const val = consoleInput.value;
                    if (!val) return;

                    addToConsole(val + '\n');
                    memory[step.varName].value = val;
                    renderMemory();

                    // Flash effect
                    const el = document.getElementById(`mem-${step.varName}`);
                    if (el) {
                        const valEl = el.querySelector('.mem-value');
                        valEl.classList.add('flash-update');
                    }

                    inputArea.style.display = 'none';
                    submitInputBtn.removeEventListener('click', handler);
                    consoleInput.removeEventListener('keypress', keyHandler);
                    resolve();
                };

                const keyHandler = (e) => {
                    if (e.key === 'Enter') handler();
                };

                submitInputBtn.addEventListener('click', handler);
                consoleInput.addEventListener('keypress', keyHandler);
            });

            btnNext.disabled = false;
            btnPrev.disabled = false;
            break;

        case 'update':
            if (step.sourceVar) {
                memory[step.varName].value = memory[step.sourceVar].value;
            }
            renderMemory();
            // Flash effect
            setTimeout(() => {
                const el = document.getElementById(`mem-${step.varName}`);
                if (el) {
                    const valEl = el.querySelector('.mem-value');
                    valEl.classList.add('flash-update');
                }
            }, 50);
            break;
    }
}

btnNext.addEventListener('click', async () => {
    if (currentStep < codeLines.length - 1) {
        currentStep++;
        await executeStep(currentStep, true);
        updateHighlight();
        updateControls();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > -1) {
        // Undo current step
        executeStep(currentStep, false);
        currentStep--;
        updateHighlight();
        updateControls();
    }
});

btnReset.addEventListener('click', () => {
    currentStep = -1;
    memory = {};
    history = [];
    clearConsole();
    renderMemory();
    inputArea.style.display = 'none';
    updateHighlight();
    updateControls();
});

init();
