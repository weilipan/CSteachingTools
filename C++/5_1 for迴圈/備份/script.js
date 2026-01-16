document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnPlay = document.getElementById('btn-play');
    const btnNext = document.getElementById('btn-next');
    const btnReset = document.getElementById('btn-reset');
    const varI = document.getElementById('var-i');
    const consoleOutput = document.getElementById('console-output');

    // State variables
    let i = 0;
    const limit = 5;
    let step = 0; // 0: Init, 1: Condition, 2: Body, 3: Update, 4: Done
    let isRunning = false;
    let autoPlayInterval = null;

    const steps = [
        { line: 1, text: "初始化: int i = 0", action: () => { i = 0; updateUI(); } },
        { line: 1, text: "檢查條件: i < 5", action: () => { /* Just highlight */ } },
        { line: 2, text: "執行迴圈本體: 輸出 i", action: () => { printToConsole(`i = ${i}`); } },
        { line: 1, text: "更新: i++", action: () => { i++; updateUI(); } },
        { line: 4, text: "結束迴圈", action: () => { printToConsole("Done!"); } }
    ];

    function updateUI() {
        varI.textContent = i;
        varI.classList.add('pulse');
        setTimeout(() => varI.classList.remove('pulse'), 300);
    }

    function printToConsole(text) {
        consoleOutput.textContent += text + '\n';
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function highlightLine(lineId) {
        document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
        if (lineId) {
            const line = document.getElementById(`line-${lineId}`);
            if (line) line.classList.add('active');
        }
    }

    function nextStep() {
        if (step === -1) return;

        // Logic flow
        if (step === 0) { // Start -> Init
            steps[0].action();
            highlightLine(1);
            step = 1;
        } else if (step === 1) { // Condition check
            highlightLine(1);
            if (i < limit) {
                step = 2; // Go to body
            } else {
                step = 4; // Go to done
                nextStep(); // Immediately show done
            }
        } else if (step === 2) { // Execution
            steps[2].action();
            highlightLine(2);
            step = 3;
        } else if (step === 3) { // Update
            steps[3].action();
            highlightLine(1);
            step = 1; // Back to condition
        } else if (step === 4) { // Done
            steps[4].action();
            highlightLine(4);
            varI.textContent = "已釋放 (Out of Scope)";
            varI.style.color = "var(--text-muted)";
            varI.style.fontSize = "1rem";
            step = -1; // End
            stopAutoPlay();
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        isRunning = false;
        btnPlay.textContent = '執行';
    }

    btnNext.addEventListener('click', () => {
        stopAutoPlay();
        nextStep();
    });

    btnPlay.addEventListener('click', () => {
        if (isRunning) {
            stopAutoPlay();
        } else {
            isRunning = true;
            btnPlay.textContent = '暫停';
            autoPlayInterval = setInterval(nextStep, 800);
        }
    });

    btnReset.addEventListener('click', () => {
        stopAutoPlay();
        i = 0;
        step = 0;
        varI.textContent = '?';
        varI.style.color = "var(--accent-init)";
        varI.style.fontSize = "1.5rem";
        consoleOutput.textContent = '';
        highlightLine(null);
    });

    // Hover effect for syntax cards
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const part = item.getAttribute('data-part');
            document.querySelector(`.${part}`).style.backgroundColor = 'rgba(255,255,255,0.2)';
            document.querySelector(`.${part}`).style.borderRadius = '4px';
        });
        item.addEventListener('mouseleave', () => {
            const part = item.getAttribute('data-part');
            document.querySelector(`.${part}`).style.backgroundColor = 'transparent';
        });
    });
});
