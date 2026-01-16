// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Function Structure Highlighting
const partCards = document.querySelectorAll('.part-card');
const codeParts = document.querySelectorAll('.part');

partCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const highlightPart = card.dataset.highlight;

        // Remove all highlights
        partCards.forEach(c => c.classList.remove('active'));
        codeParts.forEach(p => p.classList.remove('highlight'));

        // Add highlight to current
        card.classList.add('active');
        const targetPart = document.querySelector(`.part[data-part="${highlightPart}"]`);
        if (targetPart) {
            targetPart.classList.add('highlight');
        }
    });
});

// Code parts highlighting on hover
codeParts.forEach(part => {
    part.addEventListener('mouseenter', () => {
        const partName = part.dataset.part;

        // Remove all highlights
        partCards.forEach(c => c.classList.remove('active'));
        codeParts.forEach(p => p.classList.remove('highlight'));

        // Add highlight
        part.classList.add('highlight');
        const targetCard = document.querySelector(`.part-card[data-highlight="${partName}"]`);
        if (targetCard) {
            targetCard.classList.add('active');
        }
    });
});

// Application Examples
const runBtns = document.querySelectorAll('.run-btn');

runBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const example = btn.dataset.example;
        const output = document.getElementById(`output-${example}`);

        output.classList.add('show');

        switch (example) {
            case 'math':
                simulateMathExample(output);
                break;
            case 'array':
                simulateArrayExample(output);
                break;
            case 'string':
                simulateStringExample(output);
                break;
            case 'validation':
                simulateValidationExample(output);
                break;
        }
    });
});

function simulateMathExample(output) {
    output.innerHTML = '';
    const steps = [
        '執行: calculateArea(5.0)',
        'radius = 5.0',
        'PI = 3.14159',
        '計算: 3.14159 × 5.0 × 5.0',
        '結果: 78.53975',
        '',
        '輸出: 面積: 78.53975'
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            output.innerHTML += steps[i] + '\n';
            i++;
        } else {
            clearInterval(interval);
        }
    }, 300);
}

function simulateArrayExample(output) {
    output.innerHTML = '';
    const steps = [
        '執行: findMax(numbers, 5)',
        '陣列: [3, 7, 2, 9, 1]',
        'max = 3 (初始值)',
        '比較: 7 > 3 → max = 7',
        '比較: 2 < 7 → max 不變',
        '比較: 9 > 7 → max = 9',
        '比較: 1 < 9 → max 不變',
        '',
        '回傳: 9'
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            output.innerHTML += steps[i] + '\n';
            i++;
        } else {
            clearInterval(interval);
        }
    }, 300);
}

function simulateStringExample(output) {
    output.innerHTML = '';
    const steps = [
        '執行: reverseString("Hello")',
        '原始字串: "Hello"',
        'reversed = ""',
        '加入: "o" → reversed = "o"',
        '加入: "l" → reversed = "ol"',
        '加入: "l" → reversed = "oll"',
        '加入: "e" → reversed = "olle"',
        '加入: "H" → reversed = "olleH"',
        '',
        '回傳: "olleH"'
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            output.innerHTML += steps[i] + '\n';
            i++;
        } else {
            clearInterval(interval);
        }
    }, 300);
}

function simulateValidationExample(output) {
    output.innerHTML = '';
    const steps = [
        '執行: isPrime(17)',
        'n = 17',
        '檢查: 17 > 1 ✓',
        '測試除數 2: 17 % 2 = 1 (不整除)',
        '測試除數 3: 17 % 3 = 2 (不整除)',
        '測試除數 4: 17 % 4 = 1 (不整除)',
        '4 × 4 = 16 < 17，繼續',
        '5 × 5 = 25 > 17，停止',
        '',
        '回傳: true (17 是質數)'
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            output.innerHTML += steps[i] + '\n';
            i++;
        } else {
            clearInterval(interval);
        }
    }, 300);
}

// Interactive Function Visualizer
const exampleSelect = document.getElementById('exampleSelect');
const interactiveCode = document.getElementById('interactiveCode');
const callStack = document.getElementById('callStack');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');
const stepInfo = document.getElementById('stepInfo');

let currentExample = 'simple';
let currentStep = 0;
let executionSteps = [];

const examples = {
    simple: {
        code: `int add(int a, int b) {
    int result = a + b;
    return result;
}

int main() {
    int x = 5;
    int y = 3;
    int sum = add(x, y);
    return 0;
}`,
        steps: [
            {
                info: '程式從 main() 開始執行',
                stack: [
                    { name: 'main()', vars: { x: '?', y: '?', sum: '?' } }
                ]
            },
            {
                info: '宣告變數 x = 5',
                stack: [
                    { name: 'main()', vars: { x: '5', y: '?', sum: '?' } }
                ]
            },
            {
                info: '宣告變數 y = 3',
                stack: [
                    { name: 'main()', vars: { x: '5', y: '3', sum: '?' } }
                ]
            },
            {
                info: '呼叫 add(5, 3)',
                stack: [
                    { name: 'main()', vars: { x: '5', y: '3', sum: '?' } },
                    { name: 'add(5, 3)', vars: { a: '5', b: '3', result: '?' } }
                ]
            },
            {
                info: '計算 result = a + b = 8',
                stack: [
                    { name: 'main()', vars: { x: '5', y: '3', sum: '?' } },
                    { name: 'add(5, 3)', vars: { a: '5', b: '3', result: '8' } }
                ]
            },
            {
                info: '回傳 result (8) 給 main()',
                stack: [
                    { name: 'main()', vars: { x: '5', y: '3', sum: '8' } }
                ]
            },
            {
                info: '程式執行完畢',
                stack: []
            }
        ]
    },
    factorial: {
        code: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(4);
    return 0;
}`,
        steps: [
            {
                info: '程式從 main() 開始執行',
                stack: [
                    { name: 'main()', vars: { result: '?' } }
                ]
            },
            {
                info: '呼叫 factorial(4)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4' } }
                ]
            },
            {
                info: '4 > 1，呼叫 factorial(3)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4' } },
                    { name: 'factorial(3)', vars: { n: '3' } }
                ]
            },
            {
                info: '3 > 1，呼叫 factorial(2)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4' } },
                    { name: 'factorial(3)', vars: { n: '3' } },
                    { name: 'factorial(2)', vars: { n: '2' } }
                ]
            },
            {
                info: '2 > 1，呼叫 factorial(1)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4' } },
                    { name: 'factorial(3)', vars: { n: '3' } },
                    { name: 'factorial(2)', vars: { n: '2' } },
                    { name: 'factorial(1)', vars: { n: '1' } }
                ]
            },
            {
                info: '1 <= 1，回傳 1',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4' } },
                    { name: 'factorial(3)', vars: { n: '3' } },
                    { name: 'factorial(2)', vars: { n: '2', '回傳': '1' } }
                ]
            },
            {
                info: '計算 2 × 1 = 2，回傳 2',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4' } },
                    { name: 'factorial(3)', vars: { n: '3', '回傳': '2' } }
                ]
            },
            {
                info: '計算 3 × 2 = 6，回傳 6',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'factorial(4)', vars: { n: '4', '回傳': '6' } }
                ]
            },
            {
                info: '計算 4 × 6 = 24，回傳 24',
                stack: [
                    { name: 'main()', vars: { result: '24' } }
                ]
            },
            {
                info: '程式執行完畢，結果 = 24',
                stack: []
            }
        ]
    },
    fibonacci: {
        code: `int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    int result = fibonacci(4);
    return 0;
}`,
        steps: [
            {
                info: '程式從 main() 開始執行',
                stack: [
                    { name: 'main()', vars: { result: '?' } }
                ]
            },
            {
                info: '呼叫 fibonacci(4)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } }
                ]
            },
            {
                info: '4 > 1，需計算 fib(3) + fib(2)，先呼叫 fib(3)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } }
                ]
            },
            {
                info: '3 > 1，需計算 fib(2) + fib(1)，先呼叫 fib(2)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } },
                    { name: 'fibonacci(2)', vars: { n: '2' } }
                ]
            },
            {
                info: '2 > 1，需計算 fib(1) + fib(0)，先呼叫 fib(1)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } },
                    { name: 'fibonacci(2)', vars: { n: '2' } },
                    { name: 'fibonacci(1)', vars: { n: '1' } }
                ]
            },
            {
                info: '1 <= 1，回傳 1',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } },
                    { name: 'fibonacci(2)', vars: { n: '2' } }
                ]
            },
            {
                info: '呼叫 fib(0)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } },
                    { name: 'fibonacci(2)', vars: { n: '2' } },
                    { name: 'fibonacci(0)', vars: { n: '0' } }
                ]
            },
            {
                info: '0 <= 1，回傳 0。fib(2) = 1 + 0 = 1',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } }
                ]
            },
            {
                info: '現在呼叫 fib(1)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(3)', vars: { n: '3' } },
                    { name: 'fibonacci(1)', vars: { n: '1' } }
                ]
            },
            {
                info: '1 <= 1，回傳 1。fib(3) = 1 + 1 = 2',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } }
                ]
            },
            {
                info: '現在呼叫 fib(2)',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } },
                    { name: 'fibonacci(2)', vars: { n: '2' } }
                ]
            },
            {
                info: '經過類似計算，fib(2) = 1',
                stack: [
                    { name: 'main()', vars: { result: '?' } },
                    { name: 'fibonacci(4)', vars: { n: '4' } }
                ]
            },
            {
                info: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3',
                stack: [
                    { name: 'main()', vars: { result: '3' } }
                ]
            },
            {
                info: '程式執行完畢，fibonacci(4) = 3',
                stack: []
            }
        ]
    }
};

exampleSelect.addEventListener('change', (e) => {
    currentExample = e.target.value;
    resetVisualization();
});

stepBtn.addEventListener('click', () => {
    if (currentStep < executionSteps.length) {
        updateVisualization(currentStep);
        currentStep++;
    } else {
        stepInfo.textContent = '執行完畢！點擊重置開始新的執行';
    }
});

resetBtn.addEventListener('click', () => {
    resetVisualization();
});

function resetVisualization() {
    currentStep = 0;
    const example = examples[currentExample];
    executionSteps = example.steps;

    // Update code display
    interactiveCode.innerHTML = `<code>${escapeHtml(example.code)}</code>`;

    // Reset stack
    callStack.innerHTML = '';

    // Reset info
    stepInfo.textContent = '點擊「執行步驟」開始';
}

function updateVisualization(step) {
    const stepData = executionSteps[step];

    // Update info
    stepInfo.textContent = `步驟 ${step + 1}/${executionSteps.length}: ${stepData.info}`;

    // Update call stack
    callStack.innerHTML = '';

    if (stepData.stack.length === 0) {
        callStack.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">堆疊為空</div>';
    } else {
        stepData.stack.forEach((frame, index) => {
            const frameEl = document.createElement('div');
            frameEl.className = 'stack-frame';

            const frameName = document.createElement('div');
            frameName.className = 'frame-name';
            frameName.textContent = frame.name;
            frameEl.appendChild(frameName);

            const varsContainer = document.createElement('div');
            varsContainer.className = 'variables';

            for (const [varName, varValue] of Object.entries(frame.vars)) {
                const varEl = document.createElement('div');
                varEl.className = 'variable';
                varEl.innerHTML = `${varName}: <span class="var-value">${varValue}</span>`;
                varsContainer.appendChild(varEl);
            }

            frameEl.appendChild(varsContainer);
            callStack.appendChild(frameEl);
        });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
resetVisualization();
