/**
 * C++ Operators Visualizer
 * Interactive JavaScript Implementation
 */

// ============================================
// Navigation System
// ============================================

class NavigationController {
    constructor() {
        this.tabs = document.querySelectorAll('.nav-tab');
        this.sections = document.querySelectorAll('.content-section');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchSection(tab));
        });
    }

    switchSection(activeTab) {
        const targetSection = activeTab.dataset.section;

        // Update tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');

        // Update sections
        this.sections.forEach(section => {
            if (section.id === `section-${targetSection}`) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
}

// ============================================
// Arithmetic Calculator
// ============================================

class ArithmeticCalculator {
    constructor() {
        this.inputA = document.getElementById('arith-a');
        this.inputB = document.getElementById('arith-b');
        this.operatorBtns = document.querySelectorAll('#section-arithmetic .operator-btn');
        this.typeRadios = document.querySelectorAll('input[name="arith-type"]');
        this.expression = document.getElementById('arith-expression');
        this.result = document.getElementById('arith-result');
        this.alertBox = document.getElementById('arith-alert');

        // Code preview elements
        this.codeA = document.getElementById('code-arith-a');
        this.codeB = document.getElementById('code-arith-b');
        this.codeOp = document.getElementById('code-arith-op');
        this.codeResult = document.getElementById('code-arith-result');

        this.currentOp = '+';
        this.currentType = 'int';

        this.init();
    }

    init() {
        this.inputA.addEventListener('input', () => this.calculate());
        this.inputB.addEventListener('input', () => this.calculate());

        this.operatorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.operatorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentOp = btn.dataset.op;
                this.calculate();
            });
        });

        this.typeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.currentType = radio.value;
                this.inputA.step = this.currentType === 'int' ? '1' : '0.1';
                this.inputB.step = this.currentType === 'int' ? '1' : '0.1';
                this.calculate();
            });
        });

        this.calculate();
    }

    calculate() {
        let a = parseFloat(this.inputA.value) || 0;
        let b = parseFloat(this.inputB.value) || 0;

        // Convert to int if needed
        if (this.currentType === 'int') {
            a = Math.trunc(a);
            b = Math.trunc(b);
        }

        let res;
        let warning = null;

        switch (this.currentOp) {
            case '+':
                res = a + b;
                break;
            case '-':
                res = a - b;
                break;
            case '*':
                res = a * b;
                break;
            case '/':
                if (b === 0) {
                    res = 'Error';
                    warning = {
                        type: 'error',
                        title: '除以零錯誤！',
                        message: '除數不能為零。'
                    };
                } else {
                    res = a / b;
                    if (this.currentType === 'int') {
                        const originalRes = res;
                        res = Math.trunc(res);
                        if (originalRes !== res) {
                            warning = {
                                type: 'warning',
                                title: '整數除法 (Integer Division)',
                                message: `因為兩個運算元都是整數，小數部分被捨去。實際結果 ${originalRes.toFixed(2)} → ${res}`
                            };
                        }
                    }
                }
                break;
            case '%':
                if (b === 0) {
                    res = 'Error';
                    warning = {
                        type: 'error',
                        title: '除以零錯誤！',
                        message: '取餘數運算的除數不能為零。'
                    };
                } else if (this.currentType !== 'int') {
                    res = 'N/A';
                    warning = {
                        type: 'warning',
                        title: '類型錯誤',
                        message: '取餘數運算只適用於整數。'
                    };
                } else {
                    res = a % b;
                }
                break;
        }

        // Update UI
        this.expression.textContent = `${a} ${this.currentOp} ${b}`;
        this.result.textContent = res;

        // Update code preview
        this.codeA.textContent = a;
        this.codeB.textContent = b;
        this.codeOp.textContent = this.currentOp;
        this.codeResult.textContent = res;

        // Show/hide alert
        if (warning) {
            this.showAlert(warning);
        } else {
            this.alertBox.classList.add('hidden');
        }
    }

    showAlert(warning) {
        this.alertBox.className = `alert alert--${warning.type}`;
        this.alertBox.innerHTML = `
            <span class="alert__icon">${warning.type === 'error' ? '❌' : '⚠️'}</span>
            <div class="alert__content">
                <div class="alert__title">${warning.title}</div>
                <div class="alert__message">${warning.message}</div>
            </div>
        `;
        this.alertBox.classList.remove('hidden');
    }
}

// ============================================
// Increment/Decrement Visualizer
// ============================================

class IncrementVisualizer {
    constructor() {
        this.modePostfix = document.getElementById('mode-postfix');
        this.modePrefix = document.getElementById('mode-prefix');
        this.btnStep = document.getElementById('btn-inc-step');
        this.btnReset = document.getElementById('btn-inc-reset');

        this.varX = document.getElementById('var-x');
        this.varY = document.getElementById('var-y');
        this.valX = document.getElementById('val-x');
        this.valY = document.getElementById('val-y');

        this.beforeX = document.getElementById('before-x');
        this.beforeY = document.getElementById('before-y');
        this.afterX = document.getElementById('after-x');
        this.afterY = document.getElementById('after-y');

        this.codeExpr = document.getElementById('inc-code-expr');
        this.explanation = document.getElementById('inc-explanation');

        this.mode = 'postfix';
        this.step = 0;
        this.x = 5;
        this.y = null;

        this.init();
    }

    init() {
        this.modePostfix.addEventListener('click', () => this.setMode('postfix'));
        this.modePrefix.addEventListener('click', () => this.setMode('prefix'));
        this.btnStep.addEventListener('click', () => this.executeStep());
        this.btnReset.addEventListener('click', () => this.reset());
    }

    setMode(mode) {
        this.mode = mode;
        this.modePostfix.classList.toggle('active', mode === 'postfix');
        this.modePrefix.classList.toggle('active', mode === 'prefix');
        this.codeExpr.textContent = mode === 'postfix' ? 'x++' : '++x';
        this.reset();
    }

    executeStep() {
        if (this.step === 0) {
            this.btnStep.textContent = '下一步';

            if (this.mode === 'postfix') {
                // Postfix: y = x++
                this.explanation.textContent = '步驟 1: 將 x 的當前值 (5) 指派給 y (先取值)';
                this.highlight(this.varX, this.varY);

                setTimeout(() => {
                    this.y = this.x;
                    this.valY.textContent = this.y;
                    this.removeHighlight();
                }, 500);
            } else {
                // Prefix: y = ++x
                this.explanation.textContent = '步驟 1: 將 x 的值加 1 (先加)';
                this.highlight(this.varX);

                setTimeout(() => {
                    this.x++;
                    this.valX.textContent = this.x;
                    this.removeHighlight();
                }, 500);
            }

            this.step = 1;
        } else if (this.step === 1) {
            if (this.mode === 'postfix') {
                // Postfix Step 2: Increment x
                this.explanation.textContent = '步驟 2: 將 x 的值加 1 (後加)';
                this.highlight(this.varX);

                setTimeout(() => {
                    this.x++;
                    this.valX.textContent = this.x;
                    this.removeHighlight();

                    // Update final state
                    this.afterX.textContent = this.x;
                    this.afterY.textContent = this.y;
                }, 500);
            } else {
                // Prefix Step 2: Assign to y
                this.explanation.textContent = '步驟 2: 將新的 x 值 (6) 指派給 y (後取值)';
                this.highlight(this.varX, this.varY);

                setTimeout(() => {
                    this.y = this.x;
                    this.valY.textContent = this.y;
                    this.removeHighlight();

                    // Update final state
                    this.afterX.textContent = this.x;
                    this.afterY.textContent = this.y;
                }, 500);
            }

            this.step = 2;
            this.btnStep.textContent = '完成 (重置)';
        } else {
            this.reset();
        }
    }

    highlight(...elements) {
        elements.forEach(el => el.classList.add('highlight'));
    }

    removeHighlight() {
        this.varX.classList.remove('highlight');
        this.varY.classList.remove('highlight');
    }

    reset() {
        this.step = 0;
        this.x = 5;
        this.y = null;

        this.valX.textContent = this.x;
        this.valY.textContent = '?';

        this.beforeX.textContent = '5';
        this.beforeY.textContent = '?';
        this.afterX.textContent = '-';
        this.afterY.textContent = '-';

        this.removeHighlight();
        this.explanation.textContent = '點擊「執行步驟」開始演示';
        this.btnStep.textContent = '執行步驟';
    }
}

// ============================================
// Logical Operations
// ============================================

class LogicalOperations {
    constructor() {
        this.switchA = document.getElementById('switch-a');
        this.switchB = document.getElementById('switch-b');
        this.valueA = document.getElementById('value-a');
        this.valueB = document.getElementById('value-b');
        this.btnAnd = document.getElementById('logical-and');
        this.btnOr = document.getElementById('logical-or');
        this.opDisplay = document.getElementById('logical-op-display');
        this.resultBadge = document.getElementById('logical-result');
        this.scMessage = document.getElementById('sc-message');
        this.codeExpr = document.getElementById('code-logical-expr');

        this.currentOp = '&&';

        this.init();
    }

    init() {
        this.switchA.addEventListener('change', () => this.evaluate());
        this.switchB.addEventListener('change', () => this.evaluate());
        this.btnAnd.addEventListener('click', () => this.setOperator('&&'));
        this.btnOr.addEventListener('click', () => this.setOperator('||'));

        this.evaluate();
    }

    setOperator(op) {
        this.currentOp = op;
        this.btnAnd.classList.toggle('active', op === '&&');
        this.btnOr.classList.toggle('active', op === '||');
        this.opDisplay.textContent = op;
        this.evaluate();
    }

    evaluate() {
        const a = this.switchA.checked;
        const b = this.switchB.checked;

        // Update value displays
        this.valueA.textContent = a.toString();
        this.valueB.textContent = b.toString();

        let result;
        let message;

        if (this.currentOp === '&&') {
            if (!a) {
                result = false;
                message = '🔴 短路觸發！因為 A 為 false，B 不會被執行，結果直接為 false。';
            } else {
                result = a && b;
                message = '✅ 無短路。A 為 true，必須檢查 B 的值。';
            }
        } else { // ||
            if (a) {
                result = true;
                message = '🔴 短路觸發！因為 A 為 true，B 不會被執行，結果直接為 true。';
            } else {
                result = a || b;
                message = '✅ 無短路。A 為 false，必須檢查 B 的值。';
            }
        }

        // Update result badge
        this.resultBadge.textContent = result.toString();
        this.resultBadge.className = `result-badge ${result}`;

        // Update short-circuit message
        this.scMessage.textContent = message;

        // Update code example
        this.codeExpr.textContent = `${a} ${this.currentOp} ${b}`;
    }
}



// ============================================
// Precedence Demonstrations
// ============================================

class PrecedenceDemonstrations {
    constructor() {
        this.items = document.querySelectorAll('.precedence-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const btn = item.querySelector('.precedence-item__btn');
            const answer = item.querySelector('.precedence-item__answer');

            btn.addEventListener('click', () => {
                const isHidden = answer.classList.contains('hidden');
                answer.classList.toggle('hidden');
                btn.textContent = isHidden ? '隱藏解析' : '顯示解析';
            });
        });
    }
}

// ============================================
// Initialize All Components
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new NavigationController();
    new ArithmeticCalculator();
    new IncrementVisualizer();
    new LogicalOperations();

    new PrecedenceDemonstrations();
});
