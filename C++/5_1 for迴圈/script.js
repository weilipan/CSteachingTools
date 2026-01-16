document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnPlay = document.getElementById('btn-play');
    const btnPlayText = document.getElementById('btn-play-text');
    const btnNext = document.getElementById('btn-next');
    const btnReset = document.getElementById('btn-reset');
    const varI = document.getElementById('var-i');
    const consoleOutput = document.getElementById('console-output');
    const codeLines = document.querySelectorAll('.code-line');

    // State
    let i = 0;
    const limit = 5;
    let step = 0;
    // step: 0(Init), 1(Condition), 2(Body), 3(Update), 4(Done)

    let isRunning = false;
    let autoPlayInterval = null;

    function updateUI(highlightI = false) {
        varI.textContent = i;
        if (highlightI) {
            varI.classList.add('pulse');
            setTimeout(() => varI.classList.remove('pulse'), 400);
        }
    }

    function printToConsole(text) {
        const span = document.createElement('span');
        span.textContent = text + '\n';
        consoleOutput.appendChild(span);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function highlightLine(lineId) {
        codeLines.forEach(el => el.classList.remove('active'));
        if (lineId) {
            const line = document.getElementById(`line-${lineId}`);
            if (line) line.classList.add('active');
        }
    }

    function resetSimulator() {
        stopAutoPlay();
        i = 0;
        step = 0;
        varI.textContent = '?';
        varI.style.color = 'var(--text-main)';
        varI.style.opacity = '1';
        consoleOutput.innerHTML = '';
        highlightLine(null);
    }

    function runNextStep() {
        switch (step) {
            case 0: // Initialization
                i = 0;
                updateUI(true);
                highlightLine(1);
                step = 1;
                break;

            case 1: // Condition Check
                highlightLine(1);
                if (i < limit) {
                    step = 2; // Enter Body
                } else {
                    step = 4; // Exit to Done
                    runNextStep(); // Immediately show done state
                }
                break;

            case 2: // Loop Body
                highlightLine(2);
                printToConsole(`Count: ${i}`);
                step = 3; // Go to Update
                break;

            case 3: // Update
                highlightLine(1);
                i++;
                updateUI(true);
                step = 1; // Back to Condition
                break;

            case 4: // Done
                highlightLine(4);
                printToConsole("Done!");
                varI.textContent = "已回收 (Scope End)";
                varI.style.color = "var(--text-muted)";
                varI.style.fontSize = "0.9rem";
                step = -1; // Finished
                stopAutoPlay();
                break;

            default:
                resetSimulator();
                break;
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        isRunning = false;
        btnPlayText.textContent = '自動執行';
        btnPlay.querySelector('.icon').textContent = '▶';
    }

    // Event Listeners
    btnNext.addEventListener('click', () => {
        stopAutoPlay();
        runNextStep();
    });

    btnPlay.addEventListener('click', () => {
        if (isRunning) {
            stopAutoPlay();
        } else {
            isRunning = true;
            btnPlayText.textContent = '暫停';
            btnPlay.querySelector('.icon').textContent = '⏸';
            autoPlayInterval = setInterval(runNextStep, 1000);
        }
    });

    btnReset.addEventListener('click', resetSimulator);

    // Syntax Hover Interaction
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const part = item.getAttribute('data-part');
            const syntaxSpan = document.querySelector(`.code-syntax-explorer .${part}`);
            if (syntaxSpan) {
                syntaxSpan.style.background = 'rgba(255, 255, 255, 0.15)';
                syntaxSpan.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.1)';
                syntaxSpan.style.borderRadius = '4px';
                syntaxSpan.style.padding = '2px 4px';
            }
        });

        item.addEventListener('mouseleave', () => {
            const part = item.getAttribute('data-part');
            const syntaxSpan = document.querySelector(`.code-syntax-explorer .${part}`);
            if (syntaxSpan) {
                syntaxSpan.style.background = 'transparent';
                syntaxSpan.style.boxShadow = 'none';
                syntaxSpan.style.padding = '0';
            }
        });
    });
});
