// ===== Number System Converter & Visualizer =====

// State management
let currentValue = null;

// DOM Elements
const inputs = {
    binary: document.getElementById('binary-input'),
    octal: document.getElementById('octal-input'),
    decimal: document.getElementById('decimal-input'),
    hex: document.getElementById('hex-input')
};

const visualizationContainer = document.getElementById('visualization-container');
const exampleButtons = document.querySelectorAll('.example-btn');
const tabButtons = document.querySelectorAll('.tab-btn');

// ===== Validation Functions =====

function isValidBinary(str) {
    return /^[01]+$/.test(str);
}

function isValidOctal(str) {
    return /^[0-7]+$/.test(str);
}

function isValidDecimal(str) {
    return /^\d+$/.test(str);
}

function isValidHex(str) {
    return /^[0-9A-Fa-f]+$/.test(str);
}

// ===== Conversion Functions =====

function convertToDecimal(value, base) {
    if (!value) return null;

    try {
        return parseInt(value, base);
    } catch (e) {
        return null;
    }
}

function convertFromDecimal(decimal, base) {
    if (decimal === null || decimal === undefined) return '';

    try {
        return decimal.toString(base).toUpperCase();
    } catch (e) {
        return '';
    }
}

// ===== Update Functions =====

function updateAllInputs(sourceInput, sourceBase) {
    const value = sourceInput.value.trim();

    if (!value) {
        clearAllInputs();
        showEmptyState();
        return;
    }

    // Validate input
    let isValid = false;
    switch (sourceBase) {
        case 2:
            isValid = isValidBinary(value);
            break;
        case 8:
            isValid = isValidOctal(value);
            break;
        case 10:
            isValid = isValidDecimal(value);
            break;
        case 16:
            isValid = isValidHex(value);
            break;
    }

    if (!isValid) {
        sourceInput.style.borderColor = '#ff3b3b';
        return;
    }

    sourceInput.style.borderColor = '';

    // Convert to decimal first
    const decimalValue = convertToDecimal(value, sourceBase);

    if (decimalValue === null || decimalValue < 0) {
        return;
    }

    currentValue = decimalValue;

    // Update all other inputs
    if (sourceBase !== 2) {
        inputs.binary.value = convertFromDecimal(decimalValue, 2);
    }
    if (sourceBase !== 8) {
        inputs.octal.value = convertFromDecimal(decimalValue, 8);
    }
    if (sourceBase !== 10) {
        inputs.decimal.value = convertFromDecimal(decimalValue, 10);
    }
    if (sourceBase !== 16) {
        inputs.hex.value = convertFromDecimal(decimalValue, 16);
    }

    // Update visualization
    updateVisualization(decimalValue);
}

function clearAllInputs() {
    Object.values(inputs).forEach(input => {
        if (document.activeElement !== input) {
            input.value = '';
        }
    });
    currentValue = null;
}

// ===== Visualization Functions =====

function showEmptyState() {
    visualizationContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🎯</div>
            <p>請在左側輸入數值以查看視覺化分解</p>
        </div>
    `;
}

function updateVisualization(decimalValue) {
    const binary = convertFromDecimal(decimalValue, 2);
    const octal = convertFromDecimal(decimalValue, 8);
    const decimal = convertFromDecimal(decimalValue, 10);
    const hex = convertFromDecimal(decimalValue, 16);

    visualizationContainer.innerHTML = `
        ${createVisualizationRow('binary', '二進位 (Binary)', binary, 2)}
        ${createVisualizationRow('octal', '八進位 (Octal)', octal, 8)}
        ${createVisualizationRow('decimal', '十進位 (Decimal)', decimal, 10)}
        ${createVisualizationRow('hex', '十六進位 (Hexadecimal)', hex, 16)}
    `;
}

function createVisualizationRow(className, title, value, base) {
    const digits = value.split('');
    const digitBoxes = digits.map((digit, index) => {
        const position = digits.length - 1 - index;
        const power = Math.pow(base, position);
        const digitValue = parseInt(digit, base);
        const contribution = digitValue * power;

        return `
            <div class="digit-box">
                <div class="digit" style="color: var(--${className}-color)">${digit}</div>
                <div class="power">${base}<sup>${position}</sup></div>
                <div class="contribution">${contribution}</div>
            </div>
        `;
    }).join('');

    return `
        <div class="visualization-row ${className}">
            <div class="vis-header">
                <span class="vis-title">${title}</span>
                <span class="vis-value" style="color: var(--${className}-color)">${value}</span>
            </div>
            <div class="digit-breakdown">
                ${digitBoxes}
            </div>
        </div>
    `;
}

// ===== Event Listeners =====

// Input event listeners
inputs.binary.addEventListener('input', (e) => {
    updateAllInputs(e.target, 2);
});

inputs.octal.addEventListener('input', (e) => {
    updateAllInputs(e.target, 8);
});

inputs.decimal.addEventListener('input', (e) => {
    updateAllInputs(e.target, 10);
});

inputs.hex.addEventListener('input', (e) => {
    updateAllInputs(e.target, 16);
});

// Prevent invalid characters
inputs.binary.addEventListener('keypress', (e) => {
    if (!/[01]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
    }
});

inputs.octal.addEventListener('keypress', (e) => {
    if (!/[0-7]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
    }
});

inputs.decimal.addEventListener('keypress', (e) => {
    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
    }
});

inputs.hex.addEventListener('keypress', (e) => {
    if (!/[0-9A-Fa-f]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
    }
});

// Example button listeners
exampleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const decimalValue = parseInt(button.dataset.decimal);
        inputs.decimal.value = decimalValue;
        updateAllInputs(inputs.decimal, 10);

        // Add animation effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    });
});

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to clicked tab and corresponding content
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// ===== Utility Functions =====

// Copy code to clipboard
function copyCode(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const code = codeBlock.textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ 已複製！';
        button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.textContent = '❌ 複製失敗';
        setTimeout(() => {
            button.textContent = '📋 複製';
        }, 2000);
    });
}

// ===== Keyboard Shortcuts =====

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear all inputs
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearAllInputs();
        showEmptyState();
        inputs.decimal.focus();
    }
});

// ===== Initialize =====

function init() {
    showEmptyState();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add focus effect to inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = '';
        });
    });

    console.log('🚀 Number System Converter initialized!');
    console.log('💡 Tip: Press Ctrl+K to clear all inputs');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== Additional Features =====

// Add input animation on value change
Object.values(inputs).forEach(input => {
    let previousValue = '';

    input.addEventListener('input', () => {
        if (input.value !== previousValue) {
            input.style.animation = 'none';
            setTimeout(() => {
                input.style.animation = '';
            }, 10);
        }
        previousValue = input.value;
    });
});

// Add hover effect to visualization rows
visualizationContainer.addEventListener('mouseover', (e) => {
    const row = e.target.closest('.visualization-row');
    if (row) {
        row.style.transform = 'translateX(4px)';
    }
});

visualizationContainer.addEventListener('mouseout', (e) => {
    const row = e.target.closest('.visualization-row');
    if (row) {
        row.style.transform = '';
    }
});

// Export functions for potential future use
window.NumberConverter = {
    convertToDecimal,
    convertFromDecimal,
    updateVisualization,
    copyCode
};

// ===== Conversion Methods Teaching System =====

// DOM Elements for conversion methods
const fromBaseSelect = document.getElementById('from-base');
const toBaseSelect = document.getElementById('to-base');
const showConversionBtn = document.getElementById('show-conversion');
const conversionContent = document.getElementById('conversion-content');

// Conversion method data
const conversionMethods = {
    '10-2': {
        title: '十進位 → 二進位',
        subtitle: 'Decimal to Binary Conversion',
        steps: [
            {
                title: '除以2取餘數法',
                description: '將十進位數不斷除以2，記錄每次的餘數，直到商為0。最後將餘數由下往上排列即為二進位。',
                example: '範例：13₁₀ → ?₂\n13 ÷ 2 = 6 餘 1\n6 ÷ 2 = 3 餘 0\n3 ÷ 2 = 1 餘 1\n1 ÷ 2 = 0 餘 1\n由下往上讀取：1101₂'
            }
        ],
        demo: { from: 13, to: '1101' },
        cppCode: `// 十進位轉二進位
#include <iostream>
#include <bitset>
using namespace std;

int main() {
    int decimal = 13;
    
    // 方法1：使用 bitset
    cout << "使用 bitset: " << bitset<8>(decimal) << endl;
    
    // 方法2：手動轉換
    string binary = "";
    int num = decimal;
    while (num > 0) {
        binary = to_string(num % 2) + binary;
        num /= 2;
    }
    cout << "手動轉換: " << binary << endl;
    
    return 0;
}`
    },
    '10-8': {
        title: '十進位 → 八進位',
        subtitle: 'Decimal to Octal Conversion',
        steps: [
            {
                title: '除以8取餘數法',
                description: '將十進位數不斷除以8，記錄每次的餘數，直到商為0。最後將餘數由下往上排列即為八進位。',
                example: '範例：83₁₀ → ?₈\n83 ÷ 8 = 10 餘 3\n10 ÷ 8 = 1 餘 2\n1 ÷ 8 = 0 餘 1\n由下往上讀取：123₈'
            }
        ],
        demo: { from: 83, to: '123' },
        cppCode: `// 十進位轉八進位
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int decimal = 83;
    
    // 使用 oct 操縱符
    cout << "八進位: " << oct << decimal << endl;
    
    // 手動轉換
    string octal = "";
    int num = decimal;
    while (num > 0) {
        octal = to_string(num % 8) + octal;
        num /= 8;
    }
    cout << "手動轉換: " << octal << endl;
    
    return 0;
}`
    },
    '10-16': {
        title: '十進位 → 十六進位',
        subtitle: 'Decimal to Hexadecimal Conversion',
        steps: [
            {
                title: '除以16取餘數法',
                description: '將十進位數不斷除以16，記錄每次的餘數（10-15用A-F表示），直到商為0。最後將餘數由下往上排列即為十六進位。',
                example: '範例：255₁₀ → ?₁₆\n255 ÷ 16 = 15 餘 15 (F)\n15 ÷ 16 = 0 餘 15 (F)\n由下往上讀取：FF₁₆'
            }
        ],
        demo: { from: 255, to: 'FF' },
        cppCode: `// 十進位轉十六進位
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int decimal = 255;
    
    // 使用 hex 操縱符
    cout << "十六進位: " << hex << uppercase << decimal << endl;
    
    // 手動轉換
    string hex = "";
    int num = decimal;
    char hexChars[] = "0123456789ABCDEF";
    while (num > 0) {
        hex = hexChars[num % 16] + hex;
        num /= 16;
    }
    cout << "手動轉換: " << hex << endl;
    
    return 0;
}`
    },
    '2-10': {
        title: '二進位 → 十進位',
        subtitle: 'Binary to Decimal Conversion',
        steps: [
            {
                title: '位值相加法',
                description: '將二進位的每一位乘以對應的2的次方，然後全部相加。',
                example: '範例：1011₂ → ?₁₀\n1×2³ + 0×2² + 1×2¹ + 1×2⁰\n= 8 + 0 + 2 + 1\n= 11₁₀'
            }
        ],
        demo: { from: '1011', to: 11 },
        cppCode: `// 二進位轉十進位
#include <iostream>
#include <string>
using namespace std;

int main() {
    string binary = "1011";
    
    // 使用 stoi 函數
    int decimal = stoi(binary, nullptr, 2);
    cout << "十進位: " << decimal << endl;
    
    // 手動轉換
    int result = 0;
    int power = 1;
    for (int i = binary.length() - 1; i >= 0; i--) {
        if (binary[i] == '1') {
            result += power;
        }
        power *= 2;
    }
    cout << "手動轉換: " << result << endl;
    
    return 0;
}`
    },
    '2-8': {
        title: '二進位 → 八進位',
        subtitle: 'Binary to Octal Conversion',
        steps: [
            {
                title: '三位一組法',
                description: '從右邊開始，每三位二進位數為一組，轉換成對應的八進位數字。',
                example: '範例：101110₂ → ?₈\n分組：101 110\n101₂ = 5₈\n110₂ = 6₈\n結果：56₈'
            }
        ],
        demo: { from: '101110', to: '56' },
        cppCode: `// 二進位轉八進位
#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

int main() {
    string binary = "101110";
    
    // 先轉十進位，再轉八進位
    int decimal = stoi(binary, nullptr, 2);
    cout << "八進位: " << oct << decimal << endl;
    
    return 0;
}`
    },
    '2-16': {
        title: '二進位 → 十六進位',
        subtitle: 'Binary to Hexadecimal Conversion',
        steps: [
            {
                title: '四位一組法',
                description: '從右邊開始，每四位二進位數為一組，轉換成對應的十六進位數字（0-9, A-F）。',
                example: '範例：11111111₂ → ?₁₆\n分組：1111 1111\n1111₂ = F₁₆\n1111₂ = F₁₆\n結果：FF₁₆'
            }
        ],
        demo: { from: '11111111', to: 'FF' },
        cppCode: `// 二進位轉十六進位
#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

int main() {
    string binary = "11111111";
    
    // 先轉十進位，再轉十六進位
    int decimal = stoi(binary, nullptr, 2);
    cout << "十六進位: " << hex << uppercase << decimal << endl;
    
    return 0;
}`
    },
    '8-10': {
        title: '八進位 → 十進位',
        subtitle: 'Octal to Decimal Conversion',
        steps: [
            {
                title: '位值相加法',
                description: '將八進位的每一位乘以對應的8的次方，然後全部相加。',
                example: '範例：127₈ → ?₁₀\n1×8² + 2×8¹ + 7×8⁰\n= 64 + 16 + 7\n= 87₁₀'
            }
        ],
        demo: { from: '127', to: 87 },
        cppCode: `// 八進位轉十進位
#include <iostream>
#include <string>
using namespace std;

int main() {
    string octal = "127";
    
    // 使用 stoi 函數
    int decimal = stoi(octal, nullptr, 8);
    cout << "十進位: " << decimal << endl;
    
    return 0;
}`
    },
    '8-2': {
        title: '八進位 → 二進位',
        subtitle: 'Octal to Binary Conversion',
        steps: [
            {
                title: '每位轉三位法',
                description: '將八進位的每一位數字轉換成對應的三位二進位數。',
                example: '範例：56₈ → ?₂\n5₈ = 101₂\n6₈ = 110₂\n結果：101110₂'
            }
        ],
        demo: { from: '56', to: '101110' },
        cppCode: `// 八進位轉二進位
#include <iostream>
#include <string>
#include <bitset>
using namespace std;

int main() {
    string octal = "56";
    
    // 先轉十進位，再轉二進位
    int decimal = stoi(octal, nullptr, 8);
    cout << "二進位: " << bitset<8>(decimal) << endl;
    
    return 0;
}`
    },
    '8-16': {
        title: '八進位 → 十六進位',
        subtitle: 'Octal to Hexadecimal Conversion',
        steps: [
            {
                title: '透過十進位轉換',
                description: '先將八進位轉成十進位，再將十進位轉成十六進位。',
                example: '範例：377₈ → ?₁₆\n377₈ = 255₁₀\n255₁₀ = FF₁₆'
            }
        ],
        demo: { from: '377', to: 'FF' },
        cppCode: `// 八進位轉十六進位
#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

int main() {
    string octal = "377";
    
    // 先轉十進位
    int decimal = stoi(octal, nullptr, 8);
    // 再轉十六進位
    cout << "十六進位: " << hex << uppercase << decimal << endl;
    
    return 0;
}`
    },
    '16-10': {
        title: '十六進位 → 十進位',
        subtitle: 'Hexadecimal to Decimal Conversion',
        steps: [
            {
                title: '位值相加法',
                description: '將十六進位的每一位（A=10, B=11, C=12, D=13, E=14, F=15）乘以對應的16的次方，然後全部相加。',
                example: '範例：1F₁₆ → ?₁₀\n1×16¹ + F×16⁰\n= 16 + 15\n= 31₁₀'
            }
        ],
        demo: { from: '1F', to: 31 },
        cppCode: `// 十六進位轉十進位
#include <iostream>
#include <string>
using namespace std;

int main() {
    string hex = "1F";
    
    // 使用 stoi 函數
    int decimal = stoi(hex, nullptr, 16);
    cout << "十進位: " << decimal << endl;
    
    return 0;
}`
    },
    '16-2': {
        title: '十六進位 → 二進位',
        subtitle: 'Hexadecimal to Binary Conversion',
        steps: [
            {
                title: '每位轉四位法',
                description: '將十六進位的每一位數字轉換成對應的四位二進位數。',
                example: '範例：FF₁₆ → ?₂\nF₁₆ = 1111₂\nF₁₆ = 1111₂\n結果：11111111₂'
            }
        ],
        demo: { from: 'FF', to: '11111111' },
        cppCode: `// 十六進位轉二進位
#include <iostream>
#include <string>
#include <bitset>
using namespace std;

int main() {
    string hex = "FF";
    
    // 先轉十進位，再轉二進位
    int decimal = stoi(hex, nullptr, 16);
    cout << "二進位: " << bitset<8>(decimal) << endl;
    
    return 0;
}`
    },
    '16-8': {
        title: '十六進位 → 八進位',
        subtitle: 'Hexadecimal to Octal Conversion',
        steps: [
            {
                title: '透過十進位轉換',
                description: '先將十六進位轉成十進位，再將十進位轉成八進位。',
                example: '範例：FF₁₆ → ?₈\nFF₁₆ = 255₁₀\n255₁₀ = 377₈'
            }
        ],
        demo: { from: 'FF', to: '377' },
        cppCode: `// 十六進位轉八進位
#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

int main() {
    string hex = "FF";
    
    // 先轉十進位
    int decimal = stoi(hex, nullptr, 16);
    // 再轉八進位
    cout << "八進位: " << oct << decimal << endl;
    
    return 0;
}`
    }
};

// Function to display conversion method
function displayConversionMethod(fromBase, toBase) {
    const key = `${fromBase}-${toBase}`;
    const method = conversionMethods[key];

    if (!method) {
        conversionContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p>相同進位系統無需轉換</p>
            </div>
        `;
        return;
    }

    // Generate steps HTML
    const stepsHTML = method.steps.map((step, index) => `
        <div class="step-item">
            <span class="step-number">${index + 1}</span>
            <div class="step-content">
                <div class="step-title">${step.title}</div>
                <div class="step-description">${step.description}</div>
                <div class="step-example">${step.example.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `).join('');

    // Generate visual demo
    const demoHTML = `
        <div class="demo-container">
            <div class="demo-step">
                <div class="demo-label">原始值</div>
                <div class="demo-value">${method.demo.from}</div>
            </div>
            <div class="demo-step">
                <div class="demo-label">轉換結果</div>
                <div class="demo-value">${method.demo.to}</div>
                <div class="demo-calculation">
                    ${getBaseName(fromBase)} → ${getBaseName(toBase)}
                </div>
            </div>
        </div>
    `;

    conversionContent.innerHTML = `
        <div class="conversion-display">
            <div class="conversion-header">
                <div class="conversion-title">${method.title}</div>
                <div class="conversion-subtitle">${method.subtitle}</div>
            </div>
            
            <div class="method-steps">
                <h3>📝 轉換步驟</h3>
                ${stepsHTML}
            </div>
            
            <div class="visual-demo">
                <h3>🎨 視覺化演示</h3>
                ${demoHTML}
            </div>
            
            <div class="cpp-conversion-code">
                <h3>💻 C++ 程式碼範例</h3>
                <div class="code-example">
                    <div class="code-header">
                        <span>conversion_${fromBase}_to_${toBase}.cpp</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 複製</button>
                    </div>
                    <pre><code>${method.cppCode}</code></pre>
                </div>
            </div>
        </div>
    `;
}

// Helper function to get base name
function getBaseName(base) {
    const names = {
        '2': '二進位',
        '8': '八進位',
        '10': '十進位',
        '16': '十六進位'
    };
    return names[base] || base;
}

// Event listener for show conversion button
if (showConversionBtn) {
    showConversionBtn.addEventListener('click', () => {
        const fromBase = fromBaseSelect.value;
        const toBase = toBaseSelect.value;

        displayConversionMethod(fromBase, toBase);

        // Smooth scroll to content
        conversionContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

console.log('✨ Conversion Methods System loaded!');
