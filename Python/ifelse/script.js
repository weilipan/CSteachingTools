document.addEventListener('DOMContentLoaded', () => {
    // === Section 1: Simple If ===
    const inputScore1 = document.getElementById('input-score-1');
    const displayScore1 = document.getElementById('display-score-1');
    const viz1Cond = document.getElementById('cond-1');
    const viz1Action = document.getElementById('action-1');
    const viz1TrueBranch = document.querySelector('#viz-1 .true-branch .arrow-label'); // Improve selection
    const viz1TrueBranchArrow = document.querySelector('#viz-1 .true-branch .arrow');
    const viz1FalseBranch = document.querySelector('#viz-1 .false-branch .arrow-label');
    const result1 = document.getElementById('result-1');

    function updateViz1() {
        const score = parseInt(inputScore1.value) || 0;
        displayScore1.textContent = score;

        // Reset visual states
        document.querySelectorAll('#viz-1 .flow-step').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#viz-1 .branch').forEach(el => el.classList.remove('active'));

        // Always highlight start and condition
        document.querySelector('#viz-1 .start').classList.add('active');
        viz1Cond.classList.add('active');

        if (score >= 60) {
            // True Path
            setTimeout(() => document.querySelector('#viz-1 .true-branch').classList.add('active'), 200);
            setTimeout(() => viz1Action.classList.add('active'), 400);
            setTimeout(() => document.querySelector('#viz-1 .end').classList.add('active'), 600);
            
            result1.className = 'result-box success';
            result1.textContent = '>>> Result: 及格！';
        } else {
            // False Path
            setTimeout(() => document.querySelector('#viz-1 .false-branch').classList.add('active'), 200);
            setTimeout(() => document.querySelector('#viz-1 .end').classList.add('active'), 400);
            
            result1.className = 'result-box neutral';
            result1.textContent = '>>> (條件不成立，什麼都不做)';
        }
    }

    inputScore1.addEventListener('input', updateViz1);
    updateViz1(); // Initial call

    // === Section 2: If-Else ===
    const inputPwd = document.getElementById('input-pwd');
    const displayPwd = document.getElementById('display-pwd');
    const cond2 = document.getElementById('cond-2');
    const path2True = document.getElementById('path-2-true');
    const path2False = document.getElementById('path-2-false');
    const result2 = document.getElementById('result-2');

    function updateViz2() {
        const pwd = inputPwd.value;
        displayPwd.textContent = pwd;

        cond2.classList.add('active');
        path2True.classList.remove('active');
        path2False.classList.remove('active');

        if (pwd === "1234") {
            path2True.classList.add('active');
            result2.className = 'result-box success';
            result2.textContent = '>>> Result: 登入成功';
        } else {
            path2False.classList.add('active');
            result2.className = 'result-box error';
            result2.textContent = '>>> Result: 密碼錯誤';
        }
    }

    inputPwd.addEventListener('input', updateViz2);
    updateViz2();

    // === Section 3: If-Elif-Else ===
    const inputAge = document.getElementById('input-age');
    const rangeAge = document.getElementById('range-age');
    const displayAge = document.getElementById('display-age');
    const result3 = document.getElementById('result-3');
    const step3_1 = document.getElementById('step-3-1');
    const step3_2 = document.getElementById('step-3-2');
    const step3_3 = document.getElementById('step-3-3');

    function updateViz3(e) {
        // Sync inputs
        let age = parseInt(e ? e.target.value : inputAge.value);
        if (e && e.target === rangeAge) inputAge.value = age;
        if (e && e.target === inputAge) rangeAge.value = age;

        displayAge.textContent = age;

        // Reset
        step3_1.classList.remove('active');
        step3_2.classList.remove('active');
        step3_3.classList.remove('active');

        if (age < 12) {
            step3_1.classList.add('active');
            result3.className = 'result-box success';
            result3.textContent = '>>> Result: 兒童票';
        } else if (age < 65) {
            // Visualize flow: passing step 1 then entering step 2
            step3_1.classList.add('active'); // Still highlighted to show it was checked
            setTimeout(() => step3_2.classList.add('active'), 100);
            result3.className = 'result-box neutral';
            result3.textContent = '>>> Result: 全票';
        } else {
            // Visualize flow: passing 1 and 2 then 3
            step3_1.classList.add('active');
            setTimeout(() => step3_2.classList.add('active'), 100);
            setTimeout(() => step3_3.classList.add('active'), 200);
            result3.className = 'result-box success'; // Using success color for valid output
            result3.textContent = '>>> Result: 敬老票';
        }
    }

    inputAge.addEventListener('input', updateViz3);
    rangeAge.addEventListener('input', updateViz3);
    updateViz3();

    // === Section 4: Nested If ===
    const inputTicket = document.getElementById('input-ticket');
    const inputVip = document.getElementById('input-vip');
    const displayTicket = document.getElementById('display-ticket');
    const displayVip = document.getElementById('display-vip');
    
    const outerBox = document.getElementById('outer-box');
    const innerBox = document.getElementById('inner-box');
    const outcomeVip = document.getElementById('outcome-vip');
    const outcomeNormal = document.getElementById('outcome-normal');
    const outcomeNoTicket = document.getElementById('outcome-no-ticket');
    const result4 = document.getElementById('result-4');

    function updateViz4() {
        const hasTicket = inputTicket.checked;
        const isVip = inputVip.checked;

        displayTicket.textContent = hasTicket ? 'True' : 'False';
        displayVip.textContent = isVip ? 'True' : 'False';

        // Reset
        outerBox.classList.remove('active');
        innerBox.classList.remove('active');
        outcomeVip.classList.remove('active');
        outcomeNormal.classList.remove('active');
        outcomeNoTicket.classList.remove('active');
        
        outerBox.classList.add('active'); // Always enter outer if check

        if (hasTicket) {
            innerBox.classList.add('active');
            if (isVip) {
                outcomeVip.classList.add('active');
                result4.className = 'result-box success';
                result4.textContent = '>>> Result: VIP 通道';
            } else {
                outcomeNormal.classList.add('active');
                result4.className = 'result-box neutral';
                result4.textContent = '>>> Result: 一般通道';
            }
        } else {
            outcomeNoTicket.classList.add('active');
            result4.className = 'result-box error';
            result4.textContent = '>>> Result: 請先購票';
        }
    }

    inputTicket.addEventListener('change', updateViz4);
    inputVip.addEventListener('change', updateViz4);
    updateViz4();
});
