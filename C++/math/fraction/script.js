// Visual Fraction Explorer Logic

document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initExpansion();
    initSimplification();
    initCommonDenominator();
    initOperations();
});

// --- Utility Functions ---

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

// Create SVG Element
function createSVG(width, height) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    return svg;
}

// Draw Pie Chart
function drawPie(numerator, denominator, size = 200, color = "#6366f1") {
    const svg = createSVG(size, size);
    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) - 5;

    // Draw background circle (empty)
    const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bgCircle.setAttribute("cx", cx);
    bgCircle.setAttribute("cy", cy);
    bgCircle.setAttribute("r", r);
    bgCircle.setAttribute("fill", "rgba(255,255,255,0.1)");
    bgCircle.setAttribute("stroke", "var(--text)");
    bgCircle.setAttribute("stroke-width", "2");
    svg.appendChild(bgCircle);

    if (denominator === 0) return svg;

    // Draw slices
    const anglePerSlice = 360 / denominator;
    
    // Draw filled slices (Numerator)
    for (let i = 0; i < numerator; i++) {
        const startAngle = i * anglePerSlice - 90; // Start from top
        const endAngle = (i + 1) * anglePerSlice - 90;
        
        // Calculate coordinates
        const x1 = cx + r * Math.cos(startAngle * Math.PI / 180);
        const y1 = cy + r * Math.sin(startAngle * Math.PI / 180);
        const x2 = cx + r * Math.cos(endAngle * Math.PI / 180);
        const y2 = cy + r * Math.sin(endAngle * Math.PI / 180);

        const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

        const pathData = [
            `M ${cx} ${cy}`,
            `L ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
        ].join(" ");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", color);
        path.setAttribute("stroke", "var(--bg)");
        path.setAttribute("stroke-width", "2");
        path.classList.add("slice");
        svg.appendChild(path);
    }

    // Draw grid lines for denominator
    for (let i = 0; i < denominator; i++) {
        const angle = i * anglePerSlice - 90;
        const x2 = cx + r * Math.cos(angle * Math.PI / 180);
        const y2 = cy + r * Math.sin(angle * Math.PI / 180);
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", cx);
        line.setAttribute("y1", cy);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "var(--bg)");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }

    return svg;
}

// Draw Rectangular Bar
function drawBar(numerator, denominator, width = 300, height = 60, color = "#ec4899") {
    const svg = createSVG(width, height);
    
    // Background
    const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bgRect.setAttribute("width", width);
    bgRect.setAttribute("height", height);
    bgRect.setAttribute("fill", "rgba(255,255,255,0.1)");
    bgRect.setAttribute("stroke", "var(--text)");
    bgRect.setAttribute("stroke-width", "2");
    bgRect.setAttribute("rx", "8");
    svg.appendChild(bgRect);

    if (denominator === 0) return svg;

    const unitWidth = width / denominator;

    // Filled Rects
    for (let i = 0; i < numerator; i++) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", i * unitWidth);
        rect.setAttribute("y", 0);
        rect.setAttribute("width", unitWidth);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", color);
        rect.setAttribute("stroke", "var(--bg)");
        rect.setAttribute("stroke-width", "2");
        if (i === 0) rect.setAttribute("rx", "8"); // Rounded corners fix roughly
        // Note: Proper rounded corners for inner segments is complex, keeping simple for now
        svg.appendChild(rect);
    }

    // Grid Lines
    for (let i = 1; i < denominator; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", i * unitWidth);
        line.setAttribute("y1", 0);
        line.setAttribute("x2", i * unitWidth);
        line.setAttribute("y2", height);
        line.setAttribute("stroke", "var(--bg)");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }

    return svg;
}

// --- Module 1: Intro ---
function initIntro() {
    const numInput = document.getElementById('intro-num');
    const denInput = document.getElementById('intro-den');
    const numVal = document.getElementById('intro-num-val');
    const denVal = document.getElementById('intro-den-val');
    const container = document.getElementById('intro-vis');

    function update() {
        let n = parseInt(numInput.value);
        let d = parseInt(denInput.value);
        
        // Constraint: n <= d usually for basic intro, but improper is fine too.
        // Let's allow improper but maybe warn or just show it.
        // For pie chart, improper fractions loop around? Or just limit for now.
        // Let's limit n <= d for the intro pie chart to keep it simple.
        if (n > d) {
            // n = d;
            // numInput.value = n;
        }

        numVal.textContent = n;
        denVal.textContent = d;

        container.innerHTML = '';
        // If n > d, pie chart is confusing. Let's switch to bars if n > d or just show multiple pies?
        // For simplicity in intro, let's stick to n <= d or show bar if n > d.
        if (n > d) {
            container.appendChild(drawBar(n, d));
        } else {
            container.appendChild(drawPie(n, d));
        }
    }

    numInput.addEventListener('input', update);
    denInput.addEventListener('input', update);
    update();
}

// --- Module 2: Expansion ---
function initExpansion() {
    const mulInput = document.getElementById('exp-mul');
    const mulLabel = document.getElementById('exp-mul-label');
    const mulValDisplay = document.getElementById('exp-mul-val');
    
    const resNum = document.getElementById('exp-res-num');
    const resDen = document.getElementById('exp-res-den');
    
    const visOrig = document.getElementById('exp-vis-orig');
    const visRes = document.getElementById('exp-vis-res');

    const baseN = 1;
    const baseD = 2;

    function update() {
        const m = parseInt(mulInput.value);
        mulLabel.textContent = m;
        mulValDisplay.textContent = m;

        const newN = baseN * m;
        const newD = baseD * m;

        resNum.textContent = newN;
        resDen.textContent = newD;

        visOrig.innerHTML = '';
        visOrig.appendChild(drawPie(baseN, baseD, 150));

        visRes.innerHTML = '';
        visRes.appendChild(drawPie(newN, newD, 150));
    }

    mulInput.addEventListener('input', update);
    update();
}

// --- Module 3: Simplification ---
function initSimplification() {
    const btn = document.getElementById('btn-gen-simplify');
    const display = document.getElementById('simp-fraction-display');
    const vis = document.getElementById('simp-vis');
    const steps = document.getElementById('simp-steps');

    btn.addEventListener('click', generate);

    function generate() {
        // Generate a fraction that CAN be simplified
        let n, d, common;
        do {
            common = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
            let a = Math.floor(Math.random() * 3) + 1;
            let b = Math.floor(Math.random() * 3) + a + 1; // b > a
            n = a * common;
            d = b * common;
        } while (gcd(n, d) === 1);

        render(n, d);
    }

    function render(n, d) {
        const g = gcd(n, d);
        const simpleN = n / g;
        const simpleD = d / g;

        display.innerHTML = `
            <div class="fraction">
                <span>${n}</span>
                <span class="bar"></span>
                <span>${d}</span>
            </div>
            <span class="operator">÷</span>
            <div class="multiplier"><span>${g}</span></div>
            <span class="operator">=</span>
            <div class="fraction">
                <span style="color: var(--secondary)">${simpleN}</span>
                <span class="bar"></span>
                <span style="color: var(--secondary)">${simpleD}</span>
            </div>
        `;

        vis.innerHTML = '';
        // Show the original, maybe animate to simplified?
        // For now, show side by side or just original with overlay?
        // Let's show original, and overlay the simplified grid in a different color or thickness?
        // Actually, side by side is clearest.
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '2rem';
        
        container.appendChild(drawPie(n, d, 150, "#8b5cf6"));
        
        const arrow = document.createElement('div');
        arrow.textContent = '➜';
        arrow.style.alignSelf = 'center';
        arrow.style.fontSize = '1.5rem';
        container.appendChild(arrow);

        container.appendChild(drawPie(simpleN, simpleD, 150, "#ec4899"));
        
        vis.appendChild(container);

        steps.innerHTML = `<p>最大公因數 (GCD) 是 ${g}。分子分母同時除以 ${g}。</p>`;
    }

    generate();
}

// --- Module 4: Common Denominator ---
function initCommonDenominator() {
    const n1In = document.getElementById('cd-n1');
    const d1In = document.getElementById('cd-d1');
    const n2In = document.getElementById('cd-n2');
    const d2In = document.getElementById('cd-d2');
    const btn = document.getElementById('btn-find-cd');
    const visArea = document.getElementById('cd-vis-area');

    btn.addEventListener('click', () => {
        const n1 = parseInt(n1In.value);
        const d1 = parseInt(d1In.value);
        const n2 = parseInt(n2In.value);
        const d2 = parseInt(d2In.value);

        const commonD = lcm(d1, d2);
        const m1 = commonD / d1;
        const m2 = commonD / d2;

        const newN1 = n1 * m1;
        const newN2 = n2 * m2;

        visArea.innerHTML = '';

        // Row 1: Originals
        const row1 = document.createElement('div');
        row1.className = 'vis-container';
        row1.innerHTML = `<h3>原始分數</h3><div style="display:flex; gap:1rem;"></div>`;
        const r1c = row1.querySelector('div');
        r1c.appendChild(drawBar(n1, d1, 200, 50, '#6366f1'));
        r1c.appendChild(drawBar(n2, d2, 200, 50, '#ec4899'));
        visArea.appendChild(row1);

        // Arrow
        const arrow = document.createElement('div');
        arrow.innerHTML = '⬇ 通分 (公分母: ' + commonD + ')';
        arrow.style.width = '100%';
        arrow.style.textAlign = 'center';
        arrow.style.margin = '1rem 0';
        visArea.appendChild(arrow);

        // Row 2: Common Denominator
        const row2 = document.createElement('div');
        row2.className = 'vis-container';
        row2.innerHTML = `<h3>通分後</h3><div style="display:flex; gap:1rem;"></div>`;
        const r2c = row2.querySelector('div');
        r2c.appendChild(drawBar(newN1, commonD, 200, 50, '#6366f1'));
        r2c.appendChild(drawBar(newN2, commonD, 200, 50, '#ec4899'));
        visArea.appendChild(row2);
    });
}

// --- Module 5: Operations ---
function initOperations() {
    const tabs = document.querySelectorAll('.tab-btn');
    let currentOp = 'add';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentOp = tab.dataset.op;
            document.getElementById('op-symbol').textContent = getOpSymbol(currentOp);
            updateOp();
        });
    });

    const inputs = ['op-n1', 'op-d1', 'op-n2', 'op-d2'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateOp);
    });

    function getOpSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'sub': return '-';
            case 'mul': return '×';
            case 'div': return '÷';
        }
    }

    function updateOp() {
        const n1 = parseInt(document.getElementById('op-n1').value);
        const d1 = parseInt(document.getElementById('op-d1').value);
        const n2 = parseInt(document.getElementById('op-n2').value);
        const d2 = parseInt(document.getElementById('op-d2').value);
        const resDiv = document.getElementById('op-result');
        const visDiv = document.getElementById('op-vis');

        visDiv.innerHTML = '';

        let resN, resD;

        if (currentOp === 'add' || currentOp === 'sub') {
            const commonD = lcm(d1, d2);
            const m1 = commonD / d1;
            const m2 = commonD / d2;
            const newN1 = n1 * m1;
            const newN2 = n2 * m2;
            
            if (currentOp === 'add') resN = newN1 + newN2;
            else resN = newN1 - newN2;
            
            resD = commonD;

            // Visual: Show bars aligning
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '1rem';
            
            // Show step 1: Common Denominator
            const step1 = document.createElement('div');
            step1.innerHTML = `<p>1. 通分 (分母變 ${commonD})</p>`;
            step1.appendChild(drawBar(newN1, commonD, 300, 40, '#6366f1'));
            step1.appendChild(document.createTextNode(currentOp === 'add' ? ' + ' : ' - '));
            step1.appendChild(drawBar(newN2, commonD, 300, 40, '#ec4899'));
            container.appendChild(step1);

            // Show step 2: Result
            const step2 = document.createElement('div');
            step2.innerHTML = `<p>2. 結果</p>`;
            step2.appendChild(drawBar(resN, resD, 300, 40, '#8b5cf6'));
            container.appendChild(step2);
            
            visDiv.appendChild(container);

        } else if (currentOp === 'mul') {
            resN = n1 * n2;
            resD = d1 * d2;

            // Visual: Area model
            // Draw a square. Split vertically by d1, shade n1.
            // Split horizontally by d2, shade n2.
            // Intersection is result.
            
            const size = 200;
            const svg = createSVG(size, size);
            
            // Background
            const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bg.setAttribute("width", size);
            bg.setAttribute("height", size);
            bg.setAttribute("fill", "none");
            bg.setAttribute("stroke", "var(--text)");
            svg.appendChild(bg);

            // Vertical slices (Fraction 1)
            const w = size / d1;
            for(let i=0; i<n1; i++) {
                const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                r.setAttribute("x", i*w);
                r.setAttribute("y", 0);
                r.setAttribute("width", w);
                r.setAttribute("height", size);
                r.setAttribute("fill", "rgba(99, 102, 241, 0.3)"); // Primary low opacity
                svg.appendChild(r);
            }

            // Horizontal slices (Fraction 2)
            const h = size / d2;
            for(let i=0; i<n2; i++) {
                const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                r.setAttribute("x", 0);
                r.setAttribute("y", i*h);
                r.setAttribute("width", size);
                r.setAttribute("height", h);
                r.setAttribute("fill", "rgba(236, 72, 153, 0.3)"); // Secondary low opacity
                svg.appendChild(r);
            }

            // Intersection (Result)
            for(let i=0; i<n1; i++) {
                for(let j=0; j<n2; j++) {
                    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    r.setAttribute("x", i*w);
                    r.setAttribute("y", j*h);
                    r.setAttribute("width", w);
                    r.setAttribute("height", h);
                    r.setAttribute("fill", "#8b5cf6"); // Intersection color
                    svg.appendChild(r);
                }
            }
            
            // Grid lines
            for(let i=1; i<d1; i++) {
                const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
                l.setAttribute("x1", i*w); l.setAttribute("y1", 0);
                l.setAttribute("x2", i*w); l.setAttribute("y2", size);
                l.setAttribute("stroke", "rgba(255,255,255,0.2)");
                svg.appendChild(l);
            }
            for(let i=1; i<d2; i++) {
                const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
                l.setAttribute("x1", 0); l.setAttribute("y1", i*h);
                l.setAttribute("x2", size); l.setAttribute("y2", i*h);
                l.setAttribute("stroke", "rgba(255,255,255,0.2)");
                svg.appendChild(l);
            }

            visDiv.appendChild(svg);

        } else if (currentOp === 'div') {
            // Division is hard to visualize simply without complex animation (keep-change-flip).
            // Let's show the reciprocal method textually + result bar.
            resN = n1 * d2;
            resD = d1 * n2;
            
            visDiv.innerHTML = `
                <div style="text-align:center">
                    <p>除以一個分數等於乘以它的倒數</p>
                    <p>${n1}/${d1} ÷ ${n2}/${d2} = ${n1}/${d1} × ${d2}/${n2} = ${resN}/${resD}</p>
                </div>
            `;
            visDiv.appendChild(drawBar(resN, resD, 300, 40, '#8b5cf6'));
        }

        // Simplify result for display
        const g = gcd(resN, resD);
        const sN = resN / g;
        const sD = resD / g;

        resDiv.innerHTML = `
            <span>${resN}</span>
            <span class="bar"></span>
            <span>${resD}</span>
            ${g > 1 ? ` = 
            <span>${sN}</span>
            <span class="bar"></span>
            <span>${sD}</span>` : ''}
        `;
    }
    
    updateOp();
}
