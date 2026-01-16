document.addEventListener('DOMContentLoaded', () => {
    const numberInput = document.getElementById('numberInput');
    const precisionInput = document.getElementById('precisionInput');
    const precisionValue = document.getElementById('precisionValue');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const consoleOutput = document.getElementById('consoleOutput');
    const cppCode = document.getElementById('cppCode');
    
    // Explanation Cards
    const cards = {
        default: document.getElementById('defaultCard'),
        fixed: document.getElementById('fixedCard'),
        scientific: document.getElementById('scientificCard')
    };

    let state = {
        number: 123.456789,
        mode: 'default', // default, fixed, scientific
        precision: 6
    };

    function updateUI() {
        // Update Precision Display
        precisionValue.textContent = state.precision;

        // Update Toggle Buttons
        toggleBtns.forEach(btn => {
            if (btn.dataset.mode === state.mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Explanation Cards
        Object.keys(cards).forEach(key => {
            if (key === state.mode) {
                cards[key].classList.remove('hidden');
            } else {
                cards[key].classList.add('hidden');
            }
        });

        // Calculate Output
        let output = '';
        const num = parseFloat(state.number);

        if (isNaN(num)) {
            output = 'nan';
        } else {
            if (state.mode === 'default') {
                // C++ default behavior: precision is max significant digits
                // JS toPrecision is close, but handles integers slightly differently than cout default
                // Standard C++ default precision is 6.
                // If the number can be represented in fixed point with <= precision digits, it uses fixed.
                // Otherwise scientific.
                // Trailing zeros are removed.
                
                // Using toPrecision to simulate significant digits
                let temp = num.toPrecision(state.precision);
                
                // Convert back to number to remove trailing zeros (standard C++ behavior for default)
                // However, C++ switches to scientific if the exponent is >= precision or <= -5 (roughly)
                // Let's stick to a simpler approximation using JS native behavior which is close enough for visualization
                // or implement the logic more strictly.
                
                // Strict C++ simulation:
                // 1. Calculate log10 to estimate digits
                const absNum = Math.abs(num);
                let exponent = 0;
                if (absNum !== 0) {
                    exponent = Math.floor(Math.log10(absNum));
                }

                // C++ rules: use fixed if -4 <= exponent < precision
                // else use scientific
                // precision here means "max significant digits"
                
                if (exponent >= -4 && exponent < state.precision) {
                    // Fixed notation, but we need to count significant digits
                    // We can use toPrecision, then trim trailing zeros if no decimal point, or if decimal point exists
                    // Actually, standard JS parseFloat(num.toPrecision(p)) does a good job of removing trailing zeros
                    output = parseFloat(num.toPrecision(state.precision)).toString();
                } else {
                    // Scientific
                    // toExponential(p) uses p as digits AFTER decimal.
                    // We need total significant digits = state.precision
                    // So digits after decimal = state.precision - 1
                    let p = state.precision - 1;
                    if (p < 0) p = 0;
                    output = num.toExponential(p);
                    
                    // C++ scientific usually formats as 1.23e+02 (2 digits exponent)
                    // JS uses 1.23e+2. Let's fix the exponent part if we want to be fancy, but JS standard is fine for now.
                    // Let's try to match C++ 'e+02' style
                    output = output.replace(/e([+-])(\d)$/, 'e$10$2');
                }

            } else if (state.mode === 'fixed') {
                // Fixed: precision is digits AFTER decimal
                output = num.toFixed(state.precision);
            } else if (state.mode === 'scientific') {
                // Scientific: precision is digits AFTER decimal
                output = num.toExponential(state.precision);
                // Fix exponent style
                output = output.replace(/e([+-])(\d)$/, 'e$10$2');
            }
        }

        consoleOutput.textContent = output;

        // Update Code Snippet
        let code = `#include <iostream>
#include <iomanip>

int main() {
    double num = ${state.number};
    std::cout`;

        if (state.mode === 'fixed') {
            code += ` << std::fixed`;
        } else if (state.mode === 'scientific') {
            code += ` << std::scientific`;
        }

        code += ` << std::setprecision(${state.precision}) << num;
    return 0;
}`;
        
        // Escape HTML for safety (though we are setting textContent usually, but here we might use innerHTML for highlighting later if needed)
        // For now, simple text replacement
        cppCode.textContent = code;
        
        // Simple syntax highlighting (re-apply if needed)
        // Since we are just replacing text, we lose the spans. 
        // Let's do a very basic highlight
        highlightCode();
    }

    function highlightCode() {
        let html = cppCode.textContent;
        html = html.replace(/#include <(.*?)>/g, '<span style="color: #c678dd;">#include &lt;$1&gt;</span>');
        html = html.replace(/\b(int|double|return)\b/g, '<span style="color: #c678dd;">$1</span>');
        html = html.replace(/\b(std::cout|std::fixed|std::scientific|std::setprecision)\b/g, '<span style="color: #61afef;">$1</span>');
        html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span style="color: #d19a66;">$1</span>');
        cppCode.innerHTML = html;
    }

    // Event Listeners
    numberInput.addEventListener('input', (e) => {
        state.number = e.target.value;
        updateUI();
    });

    precisionInput.addEventListener('input', (e) => {
        state.precision = parseInt(e.target.value);
        updateUI();
    });

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            state.mode = btn.dataset.mode;
            updateUI();
        });
    });

    // Initial Render
    updateUI();
});
