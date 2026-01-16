// ===================================
// Tab Navigation System
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize interactive features
    initBooleanBoxes();
    initLogicCalculator();
    initRelationalCalculator();
});

// ===================================
// Boolean Boxes Animation
// ===================================
function initBooleanBoxes() {
    const trueBox = document.getElementById('true-box');
    const falseBox = document.getElementById('false-box');

    if (trueBox) {
        trueBox.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.5s ease';
            }, 10);
        });
    }

    if (falseBox) {
        falseBox.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.5s ease';
            }, 10);
        });
    }
}

// ===================================
// Logical Operators Calculator
// ===================================
function initLogicCalculator() {
    const logicA = document.getElementById('logic-a');
    const logicB = document.getElementById('logic-b');

    if (logicA && logicB) {
        logicA.addEventListener('change', updateLogicResults);
        logicB.addEventListener('change', updateLogicResults);
        updateLogicResults(); // Initial calculation
    }
}

function updateLogicResults() {
    const a = document.getElementById('logic-a').value === 'true';
    const b = document.getElementById('logic-b').value === 'true';

    // Calculate results
    const andResult = a && b;
    const orResult = a || b;
    const notResult = !a;

    // Update AND result
    const andDiv = document.getElementById('result-and');
    andDiv.textContent = andResult.toString();
    andDiv.className = 'expression-result ' + (andResult ? 'true' : 'false');

    // Update OR result
    const orDiv = document.getElementById('result-or');
    orDiv.textContent = orResult.toString();
    orDiv.className = 'expression-result ' + (orResult ? 'true' : 'false');

    // Update NOT result
    const notDiv = document.getElementById('result-not');
    notDiv.textContent = notResult.toString();
    notDiv.className = 'expression-result ' + (notResult ? 'true' : 'false');
}

// ===================================
// Relational Operators Calculator
// ===================================
function initRelationalCalculator() {
    const relA = document.getElementById('rel-a');
    const relB = document.getElementById('rel-b');

    if (relA && relB) {
        relA.addEventListener('input', updateRelationalResults);
        relB.addEventListener('input', updateRelationalResults);
        updateRelationalResults(); // Initial calculation
    }
}

function updateRelationalResults() {
    const a = parseFloat(document.getElementById('rel-a').value);
    const b = parseFloat(document.getElementById('rel-b').value);

    // Calculate results
    const results = {
        'eq': a === b,
        'neq': a !== b,
        'lt': a < b,
        'gt': a > b,
        'lte': a <= b,
        'gte': a >= b
    };

    // Update all result divs
    for (const [key, value] of Object.entries(results)) {
        const div = document.getElementById('result-' + key);
        if (div) {
            div.textContent = value.toString();
            div.className = 'expression-result ' + (value ? 'true' : 'false');
        }
    }
}

// ===================================
// Compound Expression Evaluator
// ===================================
function evaluateExpression() {
    const input = document.getElementById('compound-expr').value;
    const resultDiv = document.getElementById('compound-result');
    const valueSpan = document.getElementById('compound-value');

    try {
        // Replace logical operators with JavaScript equivalents
        let expr = input
            .replace(/\btrue\b/g, 'true')
            .replace(/\bfalse\b/g, 'false')
            .replace(/&&/g, '&&')
            .replace(/\|\|/g, '||')
            .replace(/!/g, '!');

        // Validate expression (only allow safe characters)
        if (!/^[\s\(\)!&|truefals]+$/.test(expr)) {
            throw new Error('無效的運算式');
        }

        // Evaluate the expression
        const result = eval(expr);
        
        // Display result
        valueSpan.textContent = result.toString();
        resultDiv.className = 'expression-result ' + (result ? 'true' : 'false');
        resultDiv.style.display = 'block';

    } catch (error) {
        valueSpan.textContent = '錯誤: ' + error.message;
        resultDiv.className = 'expression-result false';
        resultDiv.style.display = 'block';
    }
}

// Allow Enter key to evaluate expression
document.addEventListener('DOMContentLoaded', function() {
    const compoundExpr = document.getElementById('compound-expr');
    if (compoundExpr) {
        compoundExpr.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                evaluateExpression();
            }
        });
    }
});

// ===================================
// Interactive Examples
// ===================================

// Leap Year Checker
function checkLeapYear() {
    const year = parseInt(document.getElementById('leap-year').value);
    const resultDiv = document.getElementById('leap-result');

    const isLeapYear = (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);

    resultDiv.style.display = 'block';
    if (isLeapYear) {
        resultDiv.innerHTML = `<span style="color: var(--success);">✓ ${year} 是閏年</span>`;
    } else {
        resultDiv.innerHTML = `<span style="color: var(--danger);">✗ ${year} 不是閏年</span>`;
    }
    resultDiv.style.animation = 'pulse 0.5s ease';
}

// Grade Checker
function checkGrade() {
    const score = parseInt(document.getElementById('grade-score').value);
    const resultDiv = document.getElementById('grade-result');

    let grade = '';
    let color = '';

    if (score >= 90) {
        grade = 'A';
        color = 'var(--success)';
    } else if (score >= 80) {
        grade = 'B';
        color = '#10b981';
    } else if (score >= 70) {
        grade = 'C';
        color = 'var(--warning)';
    } else if (score >= 60) {
        grade = 'D';
        color = '#f59e0b';
    } else {
        grade = 'F';
        color = 'var(--danger)';
    }

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<span style="color: ${color}; font-size: 1.5rem;">等第: ${grade}</span>`;
    resultDiv.style.animation = 'pulse 0.5s ease';
}

// Triangle Checker
function checkTriangle() {
    const a = parseFloat(document.getElementById('tri-a').value);
    const b = parseFloat(document.getElementById('tri-b').value);
    const c = parseFloat(document.getElementById('tri-c').value);
    const resultDiv = document.getElementById('tri-result');

    const isTriangle = (a + b > c) && (b + c > a) && (a + c > b);

    resultDiv.style.display = 'block';
    if (isTriangle) {
        resultDiv.innerHTML = `<span style="color: var(--success);">✓ 可以形成三角形</span>`;
        
        // Check triangle type
        if (a === b && b === c) {
            resultDiv.innerHTML += `<br><span style="color: var(--text-secondary); font-size: 0.9rem;">正三角形</span>`;
        } else if (a === b || b === c || a === c) {
            resultDiv.innerHTML += `<br><span style="color: var(--text-secondary); font-size: 0.9rem;">等腰三角形</span>`;
        } else if (Math.abs((a*a + b*b) - c*c) < 0.01 || 
                   Math.abs((b*b + c*c) - a*a) < 0.01 || 
                   Math.abs((a*a + c*c) - b*b) < 0.01) {
            resultDiv.innerHTML += `<br><span style="color: var(--text-secondary); font-size: 0.9rem;">直角三角形</span>`;
        }
    } else {
        resultDiv.innerHTML = `<span style="color: var(--danger);">✗ 無法形成三角形</span>`;
    }
    resultDiv.style.animation = 'pulse 0.5s ease';
}

// ===================================
// Smooth Scroll Animation
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===================================
// Truth Table Row Highlight
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const tables = document.querySelectorAll('.truth-table tbody tr');
    
    tables.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
