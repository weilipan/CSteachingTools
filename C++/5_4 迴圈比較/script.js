// Tab Switching Logic
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.loop-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Helper function to update display
function updateDisplay(prefix, lineId, iVal, condVal, outputText) {
    // Clear active lines
    document.querySelectorAll(`#${prefix} .active-line`).forEach(el => el.classList.remove('active-line'));

    // Set active line
    if (lineId) {
        document.getElementById(lineId).classList.add('active-line');
    }

    // Update variables
    if (iVal !== null) document.getElementById(`${prefix}-var-i`).textContent = iVal;
    if (condVal !== null) {
        const condEl = document.getElementById(`${prefix}-cond`);
        condEl.textContent = condVal;
        condEl.style.color = condVal === 'true' ? '#0f0' : (condVal === 'false' ? '#f00' : 'inherit');
    }

    // Append output
    if (outputText) {
        const consoleBody = document.querySelector(`#${prefix}-output .console-body`);
        const p = document.createElement('div');
        p.textContent = outputText;
        consoleBody.appendChild(p);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }
}

// Get Initial Value helper
function getInitialValue() {
    const val = parseInt(document.getElementById('initial-value').value);
    return isNaN(val) ? 0 : val;
}

// Update code block display for initial value
function updateCodeDisplay(val) {
    document.querySelectorAll('.val-display').forEach(el => el.textContent = val);
}

// For Loop Logic
let forState = { step: 0, i: 0 };

function startForLoop() {
    resetForLoop();
    document.querySelector('#for .btn.start').disabled = true;
    document.querySelector('#for .btn.next').disabled = false;

    const startVal = getInitialValue();
    updateCodeDisplay(startVal);

    // Ready to Init
    updateDisplay('for', 'for-line-1', '-', '-', null);
    forState.step = 0;
}

function stepForLoop() {
    // State machine for FOR loop
    // 0: Init -> Go to Check (1)
    // 1: Check -> If true go to Body (2), Else End
    // 2: Body -> Go to Increment (3)
    // 3: Increment -> Go to Check (1)

    const prefix = 'for';

    if (forState.step === 0) {
        // Execute Init
        forState.i = getInitialValue();
        updateDisplay(prefix, 'for-line-1', forState.i, '-', null); // Highlight Init
        forState.step = 1;
    } else if (forState.step === 1) {
        // Execute Check
        const cond = forState.i < 5;
        updateDisplay(prefix, 'for-line-1', forState.i, cond ? 'true' : 'false', null);
        if (cond) {
            forState.step = 2; // Go to body
        } else {
            forState.step = 99; // End
            document.querySelector('#for .btn.next').disabled = true;
        }
    } else if (forState.step === 2) {
        // Execute Body
        updateDisplay(prefix, 'for-line-2', forState.i, 'true', `Count: ${forState.i}`);
        forState.step = 3;
    } else if (forState.step === 3) {
        // Execute Increment
        forState.i++;
        updateDisplay(prefix, 'for-line-1', forState.i, '-', null); // Highlight increment part
        forState.step = 1; // Back to check
    }
}

function resetForLoop() {
    forState = { step: 0, i: 0 };
    document.querySelector(`#for-output .console-body`).innerHTML = '';
    updateDisplay('for', null, '-', '-', null);
    document.querySelector('#for .btn.start').disabled = false;
    document.querySelector('#for .btn.next').disabled = true;
}


// While Loop Logic
let whileState = { step: 0, i: 0 };

function startWhileLoop() {
    resetWhileLoop();
    document.querySelector('#while .btn.start').disabled = true;
    document.querySelector('#while .btn.next').disabled = false;

    const startVal = getInitialValue();
    updateCodeDisplay(startVal);

    // Highlight init line
    updateDisplay('while', 'while-line-1', '-', '-', null);
    whileState.step = 0;
}

function stepWhileLoop() {
    // 0: Init -> Check
    // 1: Check -> Body or End
    // 2: Body Print -> Body Inc
    // 3: Body Inc -> Check
    const prefix = 'while';

    if (whileState.step === 0) {
        whileState.i = getInitialValue();
        updateDisplay(prefix, 'while-line-1', whileState.i, '-', null);
        whileState.step = 1;
    } else if (whileState.step === 1) {
        const cond = whileState.i < 5;
        updateDisplay(prefix, 'while-line-2', whileState.i, cond ? 'true' : 'false', null);
        if (cond) {
            whileState.step = 2;
        } else {
            whileState.step = 99;
            document.querySelector('#while .btn.next').disabled = true;
        }
    } else if (whileState.step === 2) {
        updateDisplay(prefix, 'while-line-3', whileState.i, 'true', `Count: ${whileState.i}`);
        whileState.step = 3;
    } else if (whileState.step === 3) {
        whileState.i++;
        updateDisplay(prefix, 'while-line-4', whileState.i, 'true', null);
        whileState.step = 1;
    }
}

function resetWhileLoop() {
    whileState = { step: 0, i: 0 };
    document.querySelector(`#while-output .console-body`).innerHTML = '';
    updateDisplay('while', null, '-', '-', null);
    document.querySelector('#while .btn.start').disabled = false;
    document.querySelector('#while .btn.next').disabled = true;
}

// Do-While Loop Logic
let doState = { step: 0, i: 0 };

function startDoLoop() {
    resetDoLoop();
    document.querySelector('#dowhile .btn.start').disabled = true;
    document.querySelector('#dowhile .btn.next').disabled = false;

    const startVal = getInitialValue();
    updateCodeDisplay(startVal);

    // Init
    updateDisplay('dowhile', 'do-line-1', '-', '-', null);
    doState.step = 0;
}

function stepDoLoop() {
    // 0: Init -> Do (Start of loop)
    // 1: Do -> Body Print
    // 2: Body Print -> Body Inc
    // 3: Body Inc -> Check
    // 4: Check -> Do or End
    const prefix = 'dowhile';

    if (doState.step === 0) {
        doState.i = getInitialValue();
        updateDisplay(prefix, 'do-line-1', doState.i, '-', null);
        doState.step = 1;
    } else if (doState.step === 1) {
        // Just entering the 'do' block
        updateDisplay(prefix, 'do-line-2', doState.i, '-', null);
        doState.step = 2;
    } else if (doState.step === 2) {
        updateDisplay(prefix, 'do-line-3', doState.i, '-', `Count: ${doState.i}`);
        doState.step = 3;
    } else if (doState.step === 3) {
        doState.i++;
        updateDisplay(prefix, 'do-line-4', doState.i, '-', null);
        doState.step = 4;
    } else if (doState.step === 4) {
        const cond = doState.i < 5;
        updateDisplay(prefix, 'do-line-5', doState.i, cond ? 'true' : 'false', null);
        if (cond) {
            doState.step = 1; // Back to Start of loop (do)
        } else {
            doState.step = 99;
            document.querySelector('#dowhile .btn.next').disabled = true;
        }
    }
}

function resetDoLoop() {
    doState = { step: 0, i: 0 };
    document.querySelector(`#dowhile-output .console-body`).innerHTML = '';
    updateDisplay('dowhile', null, '-', '-', null);
    document.querySelector('#dowhile .btn.start').disabled = false;
    document.querySelector('#dowhile .btn.next').disabled = true;
}
