// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Update active button
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(targetTab).classList.add('active');
    });
});

// Helper function to display output
function displayOutput(elementId, lines) {
    const outputElement = document.getElementById(elementId);
    outputElement.innerHTML = '';
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'output-line';
            lineDiv.textContent = line;
            outputElement.appendChild(lineDiv);
        }, index * 100);
    });
}

// Print Section Functions
function runPrintBasic() {
    const output = [
        'Hello, World!',
        '你好，世界！',
        '123',
        '3.14'
    ];
    displayOutput('print-basic-output', output);
}

function runPrintMultiple() {
    const output = [
        '姓名: 小明 年齡: 20'
    ];
    displayOutput('print-multiple-output', output);
}

function runPrintParams() {
    const output = [
        'A-B-C',
        '第一行 | 第二行'
    ];
    displayOutput('print-params-output', output);
}

// Input Section Functions
function runInputBasic() {
    const name = document.getElementById('input-name').value || '訪客';
    const output = [
        `請輸入你的名字: ${name}`,
        `你好, ${name}`
    ];
    displayOutput('input-basic-output', output);
}

function runInputNumbers() {
    const age = document.getElementById('input-age').value || '0';
    const height = document.getElementById('input-height').value || '0';
    
    const output = [
        `請輸入年齡: ${age}`,
        `請輸入身高(cm): ${height}`,
        `你 ${age} 歲，身高 ${height} 公分`
    ];
    displayOutput('input-numbers-output', output);
}

function runCalculator() {
    const num1 = parseFloat(document.getElementById('calc-num1').value) || 0;
    const num2 = parseFloat(document.getElementById('calc-num2').value) || 0;
    const result = num1 + num2;
    
    const output = [
        `第一個數字: ${num1}`,
        `第二個數字: ${num2}`,
        `${num1} + ${num2} = ${result}`
    ];
    displayOutput('calculator-output', output);
}

// String Formatting Functions
function runFString() {
    const output = [
        '姓名: 小華',
        '年齡: 25 歲',
        '成績: 95.5 分'
    ];
    displayOutput('fstring-output', output);
}

function runFStringAdvanced() {
    const price = 1234.5678;
    const output = [
        `總價: ${(price * 1.05).toFixed(4)}`,
        `價格: ${price.toFixed(2)} 元`,
        `編號: ${String(42).padStart(5, '0')}`
    ];
    displayOutput('fstring-advanced-output', output);
}

function runFormat() {
    const output = [
        '學生: 小明, 分數: 87.5',
        '分數: 87.5, 學生: 小明',
        '成績: 87.5'
    ];
    displayOutput('format-output', output);
}

function runPercent() {
    const output = [
        '姓名: 小美',
        '年齡: 22 歲',
        'GPA: 3.87'
    ];
    displayOutput('percent-output', output);
}

function runInteractiveFormatter() {
    const name = document.getElementById('fmt-name').value || '小明';
    const age = document.getElementById('fmt-age').value || '20';
    const score = parseFloat(document.getElementById('fmt-score').value) || 95.5;
    
    const output = [
        '=== f-string 格式 ===',
        `print(f"姓名: {name}")`,
        `→ 姓名: ${name}`,
        '',
        `print(f"年齡: {age} 歲")`,
        `→ 年齡: ${age} 歲`,
        '',
        `print(f"成績: {score:.1f} 分")`,
        `→ 成績: ${score.toFixed(1)} 分`,
        '',
        '=== format() 格式 ===',
        `print("學生: {}, 成績: {:.2f}".format(name, score))`,
        `→ 學生: ${name}, 成績: ${score.toFixed(2)}`,
        '',
        '=== % 格式 ===',
        `print("姓名: %s, 年齡: %d" % (name, age))`,
        `→ 姓名: ${name}, 年齡: ${age}`
    ];
    displayOutput('interactive-formatter-output', output);
}

// Data Types Functions
function runIntDemo() {
    const output = [
        "age = 25",
        "count = -10",
        "big_num = 1000000",
        "",
        "print(type(age))  # <class 'int'>",
        "print(age + 5)    # 30"
    ];
    displayOutput('int-output', output);
}

function runFloatDemo() {
    const output = [
        "pi = 3.14159",
        "temp = -5.5",
        "price = 99.99",
        "",
        "print(type(pi))      # <class 'float'>",
        "print(f\"{pi:.2f}\")   # 3.14"
    ];
    displayOutput('float-output', output);
}

function runBoolDemo() {
    const output = [
        "is_student = True",
        "has_license = False",
        "",
        "print(type(is_student))  # <class 'bool'>",
        "print(5 > 3)             # True",
        "print(10 == 20)          # False"
    ];
    displayOutput('bool-output', output);
}

function runStringDemo() {
    const output = [
        'name = "Python"',
        "message = '你好'",
        'multi = """多行字串"""',
        "",
        "print(type(name))    # <class 'str'>",
        "print(name[0])       # P",
        "print(len(name))     # 6"
    ];
    displayOutput('string-output', output);
}

function runConversion() {
    const output = [
        '# 字串轉數字',
        'num_str = "123"',
        'num = int(num_str)',
        'print(num + 10)  # 133',
        '',
        '# 數字轉字串',
        'age = 25',
        'text = str(age)',
        'print("我" + text + "歲")  # 我25歲',
        '',
        '# 浮點數轉整數',
        'pi = 3.14',
        'print(int(pi))  # 3'
    ];
    displayOutput('conversion-output', output);
}

function checkType() {
    const input = document.getElementById('type-check-input').value;
    
    if (!input) {
        displayOutput('type-checker-output', ['請輸入一個值！']);
        return;
    }
    
    let value = input;
    let type = 'str';
    let info = [];
    
    // Try to determine the type
    if (input === 'True' || input === 'False') {
        type = 'bool';
        value = input;
        info = [
            `值: ${value}`,
            `型態: <class 'bool'>`,
            ``,
            `布林值只有兩個可能: True 或 False`,
            `常用於條件判斷和邏輯運算`
        ];
    } else if (!isNaN(input) && input.trim() !== '') {
        if (input.includes('.')) {
            type = 'float';
            value = parseFloat(input);
            info = [
                `值: ${value}`,
                `型態: <class 'float'>`,
                ``,
                `這是一個浮點數（有小數點的數字）`,
                `int(${value}) = ${Math.floor(value)}`,
                `round(${value}, 2) = ${value.toFixed(2)}`
            ];
        } else {
            type = 'int';
            value = parseInt(input);
            info = [
                `值: ${value}`,
                `型態: <class 'int'>`,
                ``,
                `這是一個整數（沒有小數點）`,
                `${value} + 10 = ${value + 10}`,
                `${value} * 2 = ${value * 2}`
            ];
        }
    } else {
        type = 'str';
        value = input;
        info = [
            `值: "${value}"`,
            `型態: <class 'str'>`,
            ``,
            `這是一個字串（文字資料）`,
            `長度: ${value.length} 個字元`,
            value.length > 0 ? `第一個字元: "${value[0]}"` : '空字串',
            `大寫: "${value.toUpperCase()}"`,
            `小寫: "${value.toLowerCase()}"`
        ];
    }
    
    displayOutput('type-checker-output', info);
}

// Add enter key support for inputs
document.addEventListener('DOMContentLoaded', () => {
    // Input section
    document.getElementById('input-name')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runInputBasic();
    });
    
    document.getElementById('input-height')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runInputNumbers();
    });
    
    document.getElementById('calc-num2')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runCalculator();
    });
    
    // Formatter section
    document.getElementById('fmt-score')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runInteractiveFormatter();
    });
    
    // Type checker
    document.getElementById('type-check-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkType();
    });
});
