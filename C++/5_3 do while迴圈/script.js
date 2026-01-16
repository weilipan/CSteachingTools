document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        step: 0, // Logic step counter
        count: 1, // The variable 'count' in the C++ code
        isRunning: false,
        timer: null,
        isFinished: false
    };

    // DOM Elements
    const elements = {
        codeLines: document.querySelectorAll('.line'),
        varDisplay: document.getElementById('var-count'),
        consoleOutput: document.getElementById('console-output'),
        nodes: {
            start: document.getElementById('node-start'),
            body: document.getElementById('node-body'),
            condition: document.getElementById('node-condition'),
            end: document.getElementById('node-end')
        },
        btnStep: document.getElementById('btn-step'),
        btnReset: document.getElementById('btn-reset'),
        btnAuto: document.getElementById('btn-auto'),
        statusMsg: document.getElementById('status-msg')
    };

    // Helper to highlight code line
    function highlightLine(lineNumber) {
        elements.codeLines.forEach(line => line.classList.remove('active'));
        const target = document.querySelector(`.line[data-line="${lineNumber}"]`);
        if (target) {
            target.classList.add('active');
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Helper to print to console
    function printConsole(text) {
        const span = document.createElement('div');
        span.textContent = text;
        // Insert before the cursor
        elements.consoleOutput.insertBefore(span, elements.consoleOutput.lastElementChild);
        elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
    }

    // Helper to update Flow Diagram
    function highlightNode(nodeId) {
        Object.values(elements.nodes).forEach(n => n.classList.remove('active'));
        if (elements.nodes[nodeId]) {
            elements.nodes[nodeId].classList.add('active');
        }
    }

    // The Logic Machine
    // We define a sequence of fine-grained steps
    // 0: Init (Line 1)
    // 1: Do start (Line 3)
    // 2: Print (Line 4)
    // 3: Increment (Line 5)
    // 4: Check Condition (Line 6) -> Loop or End
    // 5: End (Line 7)
    
    function executionStep() {
        if (state.isFinished) return;

        // Current internal step defines what happens next
        switch (state.step) {
            case 0: // Init
                highlightLine(1);
                highlightNode('start');
                state.count = 1;
                elements.varDisplay.textContent = state.count;
                elements.statusMsg.textContent = "初始化變數 count = 1";
                state.step = 1;
                break;

            case 1: // Do (Entrance)
                highlightLine(3);
                highlightNode('body'); // Entering body
                elements.statusMsg.textContent = "進入 do區塊 (至少執行一次)";
                state.step = 2;
                break;
            
            case 2: // Print
                highlightLine(4);
                highlightNode('body');
                printConsole(`Count: ${state.count}`);
                elements.statusMsg.textContent = `輸出 Current Count: ${state.count}`;
                state.step = 3;
                break;

            case 3: // Increment
                highlightLine(5);
                highlightNode('body');
                state.count++;
                
                // Animate change
                elements.varDisplay.classList.add('changed');
                elements.varDisplay.textContent = state.count;
                setTimeout(() => elements.varDisplay.classList.remove('changed'), 300);
                
                elements.statusMsg.textContent = `變數 count 加 1，現在是 ${state.count}`;
                state.step = 4;
                break;

            case 4: // Check Condition
                highlightLine(6);
                highlightNode('condition');
                const condition = state.count <= 3;
                
                elements.statusMsg.textContent = `檢查條件: ${state.count} <= 3 ? ${condition ? "True (繼續)" : "False (結束)"}`;
                
                if (condition) {
                    // Loop back
                    state.step = 1; // Go back to 'do'
                } else {
                    // Exit loop
                    state.step = 5;
                }
                break;

            case 5: // Done
                highlightLine(7);
                highlightNode('end');
                printConsole("Done!");
                elements.statusMsg.textContent = "程式結束";
                state.isFinished = true;
                elements.btnStep.disabled = true;
                elements.btnAuto.disabled = true;
                stopAutoRun();
                break;
        }
    }

    function reset() {
        stopAutoRun();
        state.step = 0;
        state.count = 1;
        state.isFinished = false;
        
        elements.codeLines.forEach(l => l.classList.remove('active'));
        Object.values(elements.nodes).forEach(n => n.classList.remove('active'));
        
        // Clear console but keep cursor
        while (elements.consoleOutput.childNodes.length > 2) { // 2 because of text node spaces potentially
            if (elements.consoleOutput.firstChild !== elements.consoleOutput.lastElementChild) {
                elements.consoleOutput.removeChild(elements.consoleOutput.firstChild);
            } else {
                break;
            }
        }
        // Force clean
        elements.consoleOutput.innerHTML = '<span class="cursor">_</span>';

        elements.varDisplay.textContent = '?';
        elements.statusMsg.textContent = "準備執行...";
        
        elements.btnStep.disabled = false;
        elements.btnAuto.disabled = false;
        
        // Run first step immediately to set initial state visible
        // executionStep(); 
        // Actually better to stay at blank state until user clicks
    }

    function autoRun() {
        if (state.isRunning) return;
        state.isRunning = true;
        elements.btnAuto.classList.add('active'); // You might want to style this
        
        state.timer = setInterval(() => {
            if (state.isFinished) {
                stopAutoRun();
            } else {
                executionStep();
            }
        }, 1000);
    }

    function stopAutoRun() {
        state.isRunning = false;
        if (state.timer) clearInterval(state.timer);
        elements.btnAuto.classList.remove('active');
    }

    // Bind events
    elements.btnStep.addEventListener('click', () => {
        stopAutoRun(); // Manual step stops auto
        executionStep();
    });

    elements.btnReset.addEventListener('click', reset);

    elements.btnAuto.addEventListener('click', () => {
        if (state.isRunning) {
            stopAutoRun();
        } else {
            autoRun();
        }
    });

    // Initial Start
    // Select first Step (Init) ready to go? Or just wait?
    // Let's highlight line 1 gently to show start
    // highlightLine(1);
});
