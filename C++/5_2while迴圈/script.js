document.addEventListener('DOMContentLoaded', () => {
    // Simulator State
    let state = {
        i: 0,
        currentStep: 0, // 0: Init, 1: Cond, 2: Body/Output, 3: Body/Increment, 4: Terminated
        steps: [
            { line: 1, action: 'init', flowNode: 'node-start' },
            { line: 2, action: 'check', flowNode: 'node-cond' },
            { line: 3, action: 'output', flowNode: 'node-body' },
            { line: 4, action: 'increment', flowNode: 'node-body' },
            { line: 2, action: 'check', flowNode: 'node-cond' }, // Loop back
            { line: 6, action: 'terminate', flowNode: 'node-end' } // Virtual end
        ]
    };

    // We need a more dynamic step engine for the while loop
    let i = 0;
    let executionQueue = [];
    let queuePointer = 0;

    const btnNext = document.getElementById('btn-next');
    const btnReset = document.getElementById('btn-reset');
    const varI = document.getElementById('var-i');
    const condStatus = document.getElementById('cond-status');
    const consoleOutput = document.getElementById('console-output');
    const codeLines = document.querySelectorAll('.code-display .line');
    const flowNodes = document.querySelectorAll('.flow-node');

    function resetSimulator() {
        i = 0;
        queuePointer = 0;
        executionQueue = [];

        // Build initial queue (limit to prevent infinite loops in JS if user breaks it)
        let tempI = 0;
        let limit = 20;

        // Step 1: Init
        executionQueue.push({ line: 1, i: 0, cond: '?', msg: '初始化 i = 0', node: 'node-start' });

        while (tempI < 5 && limit > 0) {
            executionQueue.push({ line: 2, i: tempI, cond: 'true', msg: `檢查條件: ${tempI} < 5? 是`, node: 'node-cond' });
            executionQueue.push({ line: 3, i: tempI, cond: 'true', msg: `輸出 ${tempI}`, node: 'node-body', out: `${tempI} ` });
            tempI++;
            executionQueue.push({ line: 4, i: tempI, cond: 'true', msg: `執行 i++, i 變為 ${tempI}`, node: 'node-body' });
            limit--;
        }

        // Final check that fails
        executionQueue.push({ line: 2, i: tempI, cond: 'false', msg: `檢查條件: ${tempI} < 5? 否`, node: 'node-cond' });
        executionQueue.push({ line: 5, i: tempI, cond: 'false', msg: '迴圈終止', node: 'node-end' });

        updateUI();
        consoleOutput.innerHTML = '<span class="comment">// 程式準備就緒</span><br>';
        btnNext.disabled = false;
        btnNext.innerHTML = '<i data-lucide="play"></i> 下一步';
        lucide.createIcons();
    }

    function updateUI() {
        if (queuePointer >= executionQueue.length) {
            btnNext.disabled = true;
            return;
        }

        const step = executionQueue[queuePointer];

        // Update Code Highlighting
        codeLines.forEach(line => line.classList.remove('active'));
        const activeLine = document.querySelector(`.line[data-line="${step.line}"]`);
        if (activeLine) activeLine.classList.add('active');

        // Update Variables
        varI.textContent = step.i;
        varI.style.color = 'var(--condition)';

        // Update Condition Status
        condStatus.textContent = step.cond;
        condStatus.style.color = step.cond === 'true' ? 'var(--success)' : (step.cond === 'false' ? 'var(--error)' : 'var(--text)');

        // Update Console
        if (step.out) {
            consoleOutput.innerHTML += `<span>${step.out}</span>`;
        }
        if (queuePointer > 0) {
            // Log message
            const logEntry = document.createElement('div');
            logEntry.style.fontSize = '0.7rem';
            logEntry.style.color = 'var(--comment)';
            logEntry.textContent = `> ${step.msg}`;
            // consoleOutput.prepend(logEntry); // We keep console for actual cout output usually
        }

        // Update Flowchart
        flowNodes.forEach(node => node.classList.remove('active'));
        const activeNode = document.getElementById(step.node);
        if (activeNode) activeNode.classList.add('active');

        // Layout Scroll fix for console
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    btnNext.addEventListener('click', () => {
        if (queuePointer < executionQueue.length - 1) {
            queuePointer++;
            updateUI();
        } else {
            btnNext.disabled = true;
            btnNext.textContent = '執行完畢';
        }
    });

    btnReset.addEventListener('click', () => {
        resetSimulator();
    });

    // Initialize
    resetSimulator();
});
