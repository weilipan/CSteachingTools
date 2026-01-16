// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Draw all flowcharts on page load
    drawIfFlowchart();
    drawIfElseFlowchart();
    drawElseIfFlowchart();
    drawSwitchFlowchart();
    drawNestedFlowchart();
});

// Flowchart Drawing Functions
function drawIfFlowchart() {
    const canvas = document.getElementById('if-flowchart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    
    // Colors
    const startColor = '#10b981';
    const conditionColor = '#f59e0b';
    const processColor = '#6366f1';
    const endColor = '#ef4444';
    const lineColor = '#334155';
    const textColor = '#0f172a';
    
    // Draw Start
    drawEllipse(ctx, 300, 50, 80, 40, startColor, '開始');
    
    // Draw arrow
    drawArrow(ctx, 300, 90, 300, 140);
    
    // Draw Condition (Diamond)
    drawDiamond(ctx, 300, 180, 120, 80, conditionColor, '條件為真?');
    
    // Draw Yes arrow
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Yes', 310, 235);
    drawArrow(ctx, 300, 220, 300, 270);
    
    // Draw Process
    drawRect(ctx, 220, 270, 160, 60, processColor, '執行程式碼');
    
    // Draw arrow to end
    drawArrow(ctx, 300, 330, 300, 360);
    
    // Draw No arrow (bypass)
    ctx.fillText('No', 380, 185);
    drawArrow(ctx, 360, 180, 450, 180);
    drawArrow(ctx, 450, 180, 450, 380);
    drawArrow(ctx, 450, 380, 340, 380);
    
    // Draw End
    drawEllipse(ctx, 300, 380, 80, 40, endColor, '結束');
}

function drawIfElseFlowchart() {
    const canvas = document.getElementById('if-else-flowchart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 500;
    
    const startColor = '#10b981';
    const conditionColor = '#f59e0b';
    const processColor = '#6366f1';
    const endColor = '#ef4444';
    const textColor = '#0f172a';
    
    // Draw Start
    drawEllipse(ctx, 350, 50, 80, 40, startColor, '開始');
    drawArrow(ctx, 350, 90, 350, 140);
    
    // Draw Condition
    drawDiamond(ctx, 350, 180, 120, 80, conditionColor, '條件為真?');
    
    // Yes branch
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Yes', 280, 235);
    drawArrow(ctx, 310, 220, 200, 280);
    drawRect(ctx, 120, 280, 160, 60, processColor, 'if 區塊');
    drawArrow(ctx, 200, 340, 200, 400);
    
    // No branch
    ctx.fillText('No', 410, 235);
    drawArrow(ctx, 390, 220, 500, 280);
    drawRect(ctx, 420, 280, 160, 60, processColor, 'else 區塊');
    drawArrow(ctx, 500, 340, 500, 400);
    
    // Merge
    drawArrow(ctx, 200, 400, 350, 400);
    drawArrow(ctx, 500, 400, 350, 400);
    drawArrow(ctx, 350, 400, 350, 440);
    
    // Draw End
    drawEllipse(ctx, 350, 460, 80, 40, endColor, '結束');
}

function drawElseIfFlowchart() {
    const canvas = document.getElementById('else-if-flowchart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    const startColor = '#10b981';
    const conditionColor = '#f59e0b';
    const processColor = '#6366f1';
    const endColor = '#ef4444';
    const textColor = '#0f172a';
    
    // Draw Start
    drawEllipse(ctx, 400, 40, 80, 40, startColor, '開始');
    drawArrow(ctx, 400, 80, 400, 120);
    
    // Condition 1
    drawDiamond(ctx, 400, 150, 100, 60, conditionColor, '條件1?');
    ctx.fillStyle = textColor;
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Yes', 330, 165);
    drawArrow(ctx, 350, 150, 200, 150);
    drawRect(ctx, 120, 130, 120, 40, processColor, '執行區塊1');
    drawArrow(ctx, 180, 170, 180, 520);
    
    // Condition 2
    ctx.fillText('No', 410, 195);
    drawArrow(ctx, 400, 180, 400, 230);
    drawDiamond(ctx, 400, 260, 100, 60, conditionColor, '條件2?');
    ctx.fillText('Yes', 330, 275);
    drawArrow(ctx, 350, 260, 280, 260);
    drawRect(ctx, 200, 240, 120, 40, processColor, '執行區塊2');
    drawArrow(ctx, 260, 280, 260, 520);
    
    // Condition 3
    ctx.fillText('No', 410, 305);
    drawArrow(ctx, 400, 290, 400, 340);
    drawDiamond(ctx, 400, 370, 100, 60, conditionColor, '條件3?');
    ctx.fillText('Yes', 330, 385);
    drawArrow(ctx, 350, 370, 360, 370);
    drawRect(ctx, 280, 350, 120, 40, processColor, '執行區塊3');
    drawArrow(ctx, 340, 390, 340, 520);
    
    // Else
    ctx.fillText('No', 460, 385);
    drawArrow(ctx, 450, 370, 520, 370);
    drawRect(ctx, 460, 350, 120, 40, processColor, 'else 區塊');
    drawArrow(ctx, 520, 390, 520, 520);
    
    // Merge and End
    drawArrow(ctx, 180, 520, 400, 520);
    drawArrow(ctx, 260, 520, 400, 520);
    drawArrow(ctx, 340, 520, 400, 520);
    drawArrow(ctx, 520, 520, 400, 520);
    drawArrow(ctx, 400, 520, 400, 550);
    drawEllipse(ctx, 400, 570, 80, 40, endColor, '結束');
}

function drawSwitchFlowchart() {
    const canvas = document.getElementById('switch-flowchart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 550;
    
    const startColor = '#10b981';
    const conditionColor = '#f59e0b';
    const processColor = '#6366f1';
    const endColor = '#ef4444';
    const textColor = '#0f172a';
    
    // Draw Start
    drawEllipse(ctx, 400, 40, 80, 40, startColor, '開始');
    drawArrow(ctx, 400, 80, 400, 130);
    
    // Draw Switch Decision
    drawDiamond(ctx, 400, 170, 140, 80, conditionColor, 'switch(變數)');
    
    // Case 1
    ctx.fillStyle = textColor;
    ctx.font = 'bold 12px Arial';
    ctx.fillText('case 1', 250, 185);
    drawArrow(ctx, 330, 170, 200, 170);
    drawRect(ctx, 120, 150, 120, 40, processColor, '執行 case 1');
    drawArrow(ctx, 180, 190, 180, 460);
    
    // Case 2
    ctx.fillText('case 2', 330, 130);
    drawArrow(ctx, 360, 140, 300, 100);
    drawArrow(ctx, 300, 100, 300, 250);
    drawRect(ctx, 240, 250, 120, 40, processColor, '執行 case 2');
    drawArrow(ctx, 300, 290, 300, 460);
    
    // Case 3
    ctx.fillText('case 3', 450, 130);
    drawArrow(ctx, 440, 140, 500, 100);
    drawArrow(ctx, 500, 100, 500, 250);
    drawRect(ctx, 440, 250, 120, 40, processColor, '執行 case 3');
    drawArrow(ctx, 500, 290, 500, 460);
    
    // Default
    ctx.fillText('default', 550, 185);
    drawArrow(ctx, 470, 170, 600, 170);
    drawRect(ctx, 540, 150, 120, 40, processColor, 'default 區塊');
    drawArrow(ctx, 600, 190, 600, 460);
    
    // Merge and End
    drawArrow(ctx, 180, 460, 400, 460);
    drawArrow(ctx, 300, 460, 400, 460);
    drawArrow(ctx, 500, 460, 400, 460);
    drawArrow(ctx, 600, 460, 400, 460);
    drawArrow(ctx, 400, 460, 400, 490);
    drawEllipse(ctx, 400, 510, 80, 40, endColor, '結束');
}

function drawNestedFlowchart() {
    const canvas = document.getElementById('nested-flowchart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 700;
    
    const startColor = '#10b981';
    const conditionColor = '#f59e0b';
    const processColor = '#6366f1';
    const endColor = '#ef4444';
    const textColor = '#0f172a';
    
    // Draw Start
    drawEllipse(ctx, 450, 40, 80, 40, startColor, '開始');
    drawArrow(ctx, 450, 80, 450, 120);
    
    // Outer condition
    drawDiamond(ctx, 450, 160, 140, 80, conditionColor, '年份 % 4 == 0?');
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px Arial';
    
    // Yes branch - nested conditions
    ctx.fillText('Yes', 380, 175);
    drawArrow(ctx, 410, 160, 350, 160);
    drawArrow(ctx, 350, 160, 350, 240);
    
    // Inner condition 1
    drawDiamond(ctx, 350, 280, 140, 80, conditionColor, '年份 % 100 == 0?');
    ctx.fillText('Yes', 280, 295);
    drawArrow(ctx, 310, 280, 250, 280);
    drawArrow(ctx, 250, 280, 250, 380);
    
    // Innermost condition
    drawDiamond(ctx, 250, 420, 140, 80, conditionColor, '年份 % 400 == 0?');
    ctx.fillText('Yes', 180, 435);
    drawArrow(ctx, 210, 420, 150, 420);
    drawRect(ctx, 70, 400, 120, 40, processColor, '是閏年');
    drawArrow(ctx, 130, 440, 130, 600);
    
    ctx.fillText('No', 260, 465);
    drawArrow(ctx, 250, 460, 250, 520);
    drawRect(ctx, 190, 520, 120, 40, processColor, '不是閏年');
    drawArrow(ctx, 250, 560, 250, 600);
    
    // Inner condition 1 - No branch
    ctx.fillText('No', 360, 325);
    drawArrow(ctx, 350, 320, 350, 380);
    drawRect(ctx, 290, 380, 120, 40, processColor, '是閏年');
    drawArrow(ctx, 350, 420, 350, 600);
    
    // Outer condition - No branch
    ctx.fillText('No', 520, 175);
    drawArrow(ctx, 490, 160, 600, 160);
    drawArrow(ctx, 600, 160, 600, 380);
    drawRect(ctx, 540, 380, 120, 40, processColor, '不是閏年');
    drawArrow(ctx, 600, 420, 600, 600);
    
    // Merge all paths
    drawArrow(ctx, 130, 600, 450, 600);
    drawArrow(ctx, 250, 600, 450, 600);
    drawArrow(ctx, 350, 600, 450, 600);
    drawArrow(ctx, 600, 600, 450, 600);
    drawArrow(ctx, 450, 600, 450, 640);
    
    // Draw End
    drawEllipse(ctx, 450, 660, 80, 40, endColor, '結束');
}

// Helper drawing functions
function drawRect(ctx, x, y, width, height, color, text) {
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
}

function drawEllipse(ctx, x, y, width, height, color, text) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

function drawDiamond(ctx, x, y, width, height, color, text) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.beginPath();
    ctx.moveTo(x, y - height / 2);
    ctx.lineTo(x + width / 2, y);
    ctx.lineTo(x, y + height / 2);
    ctx.lineTo(x - width / 2, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

function drawArrow(ctx, x1, y1, x2, y2) {
    const headLength = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

// Example Execution Functions
function runIfExample() {
    const input = document.getElementById('if-input').value;
    const number = parseInt(input);
    const output = document.getElementById('if-output');
    const tracker = document.getElementById('if-tracker');
    
    // Clear previous output
    output.textContent = '';
    tracker.innerHTML = '';
    
    // Show variable
    tracker.innerHTML = `<div class="variable-item"><span class="variable-name">number</span><span class="variable-value">${number}</span></div>`;
    
    // Execute logic
    if (number > 0) {
        output.textContent = `${number} 是正數`;
    } else {
        output.textContent = '(條件為假，不執行 if 區塊)';
    }
}

function runIfElseExample() {
    const input = document.getElementById('if-else-input').value;
    const number = parseInt(input);
    const output = document.getElementById('if-else-output');
    const tracker = document.getElementById('if-else-tracker');
    
    output.textContent = '';
    tracker.innerHTML = '';
    
    tracker.innerHTML = `<div class="variable-item"><span class="variable-name">number</span><span class="variable-value">${number}</span></div>`;
    
    if (number % 2 === 0) {
        output.textContent = `${number} 是偶數`;
    } else {
        output.textContent = `${number} 是奇數`;
    }
}

function runElseIfExample() {
    const input = document.getElementById('else-if-input').value;
    const score = parseInt(input);
    const output = document.getElementById('else-if-output');
    const tracker = document.getElementById('else-if-tracker');
    
    output.textContent = '';
    tracker.innerHTML = '';
    
    tracker.innerHTML = `<div class="variable-item"><span class="variable-name">score</span><span class="variable-value">${score}</span></div>`;
    
    let result = '';
    if (score >= 90) {
        result = '等級：A (優秀)';
    } else if (score >= 80) {
        result = '等級：B (良好)';
    } else if (score >= 70) {
        result = '等級：C (普通)';
    } else if (score >= 60) {
        result = '等級：D (及格)';
    } else {
        result = '等級：F (不及格)';
    }
    
    output.textContent = result;
}

function runSwitchExample() {
    const input = document.getElementById('switch-input').value;
    const day = parseInt(input);
    const output = document.getElementById('switch-output');
    const tracker = document.getElementById('switch-tracker');
    
    output.textContent = '';
    tracker.innerHTML = '';
    
    tracker.innerHTML = `<div class="variable-item"><span class="variable-name">day</span><span class="variable-value">${day}</span></div>`;
    
    let result = '';
    switch (day) {
        case 1:
            result = '星期一';
            break;
        case 2:
            result = '星期二';
            break;
        case 3:
            result = '星期三';
            break;
        case 4:
            result = '星期四';
            break;
        case 5:
            result = '星期五';
            break;
        case 6:
            result = '星期六';
            break;
        case 7:
            result = '星期日';
            break;
        default:
            result = '無效的日期';
            break;
    }
    
    output.textContent = result;
}

function runNestedExample() {
    const input = document.getElementById('nested-input').value;
    const year = parseInt(input);
    const output = document.getElementById('nested-output');
    const tracker = document.getElementById('nested-tracker');
    
    output.textContent = '';
    tracker.innerHTML = '';
    
    let isLeapYear = false;
    let steps = [];
    
    steps.push(`檢查 ${year} % 4 == 0: ${year % 4 === 0}`);
    
    if (year % 4 === 0) {
        steps.push(`檢查 ${year} % 100 == 0: ${year % 100 === 0}`);
        if (year % 100 === 0) {
            steps.push(`檢查 ${year} % 400 == 0: ${year % 400 === 0}`);
            if (year % 400 === 0) {
                isLeapYear = true;
            } else {
                isLeapYear = false;
            }
        } else {
            isLeapYear = true;
        }
    } else {
        isLeapYear = false;
    }
    
    tracker.innerHTML = `
        <div class="variable-item"><span class="variable-name">year</span><span class="variable-value">${year}</span></div>
        <div class="variable-item"><span class="variable-name">isLeapYear</span><span class="variable-value">${isLeapYear}</span></div>
    `;
    
    let result = steps.join('\n') + '\n\n';
    if (isLeapYear) {
        result += `${year} 是閏年`;
    } else {
        result += `${year} 不是閏年`;
    }
    
    output.textContent = result;
}

function runCalculator() {
    const num1 = parseFloat(document.getElementById('calc-num1').value);
    const num2 = parseFloat(document.getElementById('calc-num2').value);
    const op = document.getElementById('calc-op').value;
    const output = document.getElementById('calc-output');
    
    output.textContent = '';
    
    let result = '';
    switch (op) {
        case '+':
            result = `結果: ${num1 + num2}`;
            break;
        case '-':
            result = `結果: ${num1 - num2}`;
            break;
        case '*':
            result = `結果: ${num1 * num2}`;
            break;
        case '/':
            if (num2 !== 0) {
                result = `結果: ${num1 / num2}`;
            } else {
                result = '錯誤: 除數不能為0';
            }
            break;
        default:
            result = '錯誤: 無效的運算子';
            break;
    }
    
    output.textContent = result;
}

function runMenu() {
    const choice = parseInt(document.getElementById('menu-choice').value);
    const output = document.getElementById('menu-output');
    
    output.textContent = '=== 主選單 ===\n';
    output.textContent += '1. 新增資料\n';
    output.textContent += '2. 查詢資料\n';
    output.textContent += '3. 修改資料\n';
    output.textContent += '4. 刪除資料\n';
    output.textContent += '5. 離開系統\n';
    output.textContent += `請選擇功能 (1-5): ${choice}\n\n`;
    
    let result = '';
    switch (choice) {
        case 1:
            result = '執行：新增資料功能';
            break;
        case 2:
            result = '執行：查詢資料功能';
            break;
        case 3:
            result = '執行：修改資料功能';
            break;
        case 4:
            result = '執行：刪除資料功能';
            break;
        case 5:
            result = '感謝使用，再見！';
            break;
        default:
            result = '錯誤：無效的選項';
            break;
    }
    
    output.textContent += result;
}

function runEligibility() {
    const age = parseInt(document.getElementById('elig-age').value);
    const hasLicense = parseInt(document.getElementById('elig-license').value) === 1;
    const drivingYears = parseInt(document.getElementById('elig-years').value);
    const output = document.getElementById('elig-output');
    
    output.textContent = `輸入年齡: ${age}\n`;
    output.textContent += `是否有駕照: ${hasLicense ? '是' : '否'}\n`;
    
    let result = '';
    if (age < 18) {
        result = '不符合資格：未滿18歲';
    } else if (!hasLicense) {
        result = '不符合資格：沒有駕照';
    } else {
        output.textContent += `輸入駕駛年資: ${drivingYears}\n\n`;
        
        if (drivingYears < 1) {
            result = '資格：新手駕駛';
        } else if (drivingYears < 3) {
            result = '資格：一般駕駛';
        } else if (drivingYears < 10) {
            result = '資格：經驗駕駛';
        } else {
            result = '資格：資深駕駛';
        }
    }
    
    output.textContent += result;
}
