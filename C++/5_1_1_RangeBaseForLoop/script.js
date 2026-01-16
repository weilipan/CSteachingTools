// Animation state
let isAnimating = false;
let currentIndex = 0;
const arrayElements = document.querySelectorAll('#arrayContainer .array-element');
const totalElements = arrayElements.length;

// Get DOM elements
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const currentValue = document.getElementById('currentValue');
const outputContent = document.getElementById('outputContent');
const statusDisplay = document.getElementById('statusDisplay');

// Main visualization animation
async function startVisualization() {
    if (isAnimating) return;

    isAnimating = true;
    startBtn.disabled = true;
    resetBtn.disabled = false;
    currentIndex = 0;
    outputContent.textContent = '';

    statusDisplay.textContent = '開始執行 Range-Based For Loop...';

    await sleep(800);

    for (let i = 0; i < totalElements; i++) {
        currentIndex = i;
        const element = arrayElements[i];
        const value = element.querySelector('.element-value').textContent;

        // Highlight current element
        element.classList.add('active');
        currentValue.textContent = value;
        statusDisplay.textContent = `正在處理索引 ${i}，值為 ${value}`;

        await sleep(1200);

        // Add to output
        outputContent.textContent += value + ' ';

        await sleep(600);

        // Mark as processed
        element.classList.remove('active');
        element.classList.add('processed');

        await sleep(400);
    }

    statusDisplay.textContent = '✅ 迴圈執行完成！所有元素已遍歷。';
    currentValue.textContent = '-';
    isAnimating = false;
    startBtn.disabled = false;
}

function resetVisualization() {
    isAnimating = false;
    currentIndex = 0;
    currentValue.textContent = '-';
    outputContent.textContent = '';
    statusDisplay.textContent = '點擊「開始執行」來觀察迴圈運作';

    arrayElements.forEach(element => {
        element.classList.remove('active', 'processed');
    });

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners for main visualization
startBtn.addEventListener('click', startVisualization);
resetBtn.addEventListener('click', resetVisualization);

// Reference type demonstration
const useReferenceCheckbox = document.getElementById('useReference');
const refOperation = document.getElementById('refOperation');
const refArrayBefore = document.getElementById('refArrayBefore');
const refArrayAfter = document.getElementById('refArrayAfter');
const executeRefBtn = document.getElementById('executeRefBtn');

let originalValues = [1, 2, 3, 4];
let isRefAnimating = false;

function updateReferenceCode() {
    const useRef = useReferenceCheckbox.checked;
    if (useRef) {
        refOperation.textContent = 'for (int& num : arr) { num *= 2; }';
    } else {
        refOperation.textContent = 'for (int num : arr) { num *= 2; }';
    }
}

async function executeReferenceOperation() {
    if (isRefAnimating) return;

    isRefAnimating = true;
    executeRefBtn.disabled = true;

    const useRef = useReferenceCheckbox.checked;
    const beforeElements = refArrayBefore.querySelectorAll('.array-element');
    const afterElements = refArrayAfter.querySelectorAll('.array-element');

    // Reset after array to original values
    originalValues.forEach((val, idx) => {
        afterElements[idx].querySelector('.element-value').textContent = val;
        afterElements[idx].classList.remove('active', 'processed');
    });

    await sleep(300);

    // Animate through each element
    for (let i = 0; i < originalValues.length; i++) {
        // Highlight current element in before array
        beforeElements[i].classList.add('active');
        afterElements[i].classList.add('active');

        await sleep(800);

        // Update after array based on reference type
        const newValue = useRef ? originalValues[i] * 2 : originalValues[i];
        afterElements[i].querySelector('.element-value').textContent = newValue;

        await sleep(600);

        // Mark as processed
        beforeElements[i].classList.remove('active');
        beforeElements[i].classList.add('processed');
        afterElements[i].classList.remove('active');
        afterElements[i].classList.add('processed');

        await sleep(400);
    }

    // Update original values if using reference
    if (useRef) {
        originalValues = originalValues.map(v => v * 2);
        // Update before array to show the change
        await sleep(500);
        originalValues.forEach((val, idx) => {
            beforeElements[idx].querySelector('.element-value').textContent = val;
        });
    }

    // Reset processed state
    await sleep(1000);
    beforeElements.forEach(el => el.classList.remove('processed'));
    afterElements.forEach(el => el.classList.remove('processed'));

    isRefAnimating = false;
    executeRefBtn.disabled = false;
}

function resetReferenceDemo() {
    originalValues = [1, 2, 3, 4];
    const beforeElements = refArrayBefore.querySelectorAll('.array-element');
    const afterElements = refArrayAfter.querySelectorAll('.array-element');

    originalValues.forEach((val, idx) => {
        beforeElements[idx].querySelector('.element-value').textContent = val;
        afterElements[idx].querySelector('.element-value').textContent = val;
        beforeElements[idx].classList.remove('active', 'processed');
        afterElements[idx].classList.remove('active', 'processed');
    });
}

// Event listeners for reference demonstration
useReferenceCheckbox.addEventListener('change', () => {
    updateReferenceCode();
    resetReferenceDemo();
});

executeRefBtn.addEventListener('click', executeReferenceOperation);

// Initialize
updateReferenceCode();

// Add smooth scroll behavior for anchor links
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

// Add intersection observer for card animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';

            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// Code blocks are styled via CSS - no JavaScript highlighting needed

// Add hover effect to array elements
arrayElements.forEach(element => {
    element.addEventListener('mouseenter', function () {
        if (!isAnimating && !this.classList.contains('active')) {
            this.style.transform = 'scale(1.05)';
        }
    });

    element.addEventListener('mouseleave', function () {
        if (!this.classList.contains('active')) {
            this.style.transform = 'scale(1)';
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space or Enter to start/reset
    if (e.code === 'Space' || e.code === 'Enter') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            if (!isAnimating) {
                startVisualization();
            }
        }
    }

    // R to reset
    if (e.code === 'KeyR' && !isAnimating) {
        if (e.target.tagName !== 'INPUT') {
            resetVisualization();
        }
    }
});

// Add performance monitoring
let lastScrollTime = Date.now();
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollTime = Date.now();

    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Update any scroll-dependent animations here
            ticking = false;
        });
        ticking = true;
    }
});

// Log initialization
console.log('%c🚀 C++ Range-Based For Loop 視覺化教學已載入',
    'color: #a78bfa; font-size: 16px; font-weight: bold;');
console.log('%c按下空白鍵或 Enter 開始動畫，按 R 重置',
    'color: #60a5fa; font-size: 12px;');
