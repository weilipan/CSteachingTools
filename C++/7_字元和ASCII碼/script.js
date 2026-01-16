document.addEventListener('DOMContentLoaded', () => {
    const charInput = document.getElementById('charInput');
    const asciiInput = document.getElementById('asciiInput');
    const bitsContainer = document.getElementById('bitsContainer');
    const hexValue = document.getElementById('hexValue');
    const asciiGrid = document.getElementById('asciiGrid');

    // Code preview elements
    const codeChar = document.getElementById('codeChar');
    const outputChar = document.getElementById('outputChar');
    const outputAscii = document.getElementById('outputAscii');
    const mathChar = document.getElementById('mathChar');
    const mathResult = document.getElementById('mathResult');
    const mathResultChar = document.getElementById('mathResultChar');

    // Case Conversion elements
    const caseOriginalChar = document.getElementById('caseOriginalChar');
    const caseOriginalAscii = document.getElementById('caseOriginalAscii');
    const caseLowerChar = document.getElementById('caseLowerChar');
    const caseLowerAscii = document.getElementById('caseLowerAscii');
    const caseUpperChar = document.getElementById('caseUpperChar');
    const caseUpperAscii = document.getElementById('caseUpperAscii');
    const codeCaseChar = document.getElementById('codeCaseChar');
    const codeLowerResult = document.getElementById('codeLowerResult');
    const codeUpperResult = document.getElementById('codeUpperResult');

    // Initialize state
    let currentValue = 65; // 'A'

    // Generate Binary Bits UI
    function generateBitsUI() {
        bitsContainer.innerHTML = '';
        for (let i = 7; i >= 0; i--) {
            const bit = document.createElement('div');
            bit.className = 'bit';
            bit.id = `bit-${i}`;

            const val = document.createElement('span');
            val.className = 'bit-val';
            val.textContent = '0';

            const index = document.createElement('span');
            index.className = 'bit-index';
            index.textContent = i; // 2^i

            bit.appendChild(val);
            bit.appendChild(index);
            bitsContainer.appendChild(bit);
        }
    }

    // Generate ASCII Table
    function generateAsciiTable() {
        asciiGrid.innerHTML = '';
        // Printable ASCII range: 32 to 126
        for (let i = 32; i <= 126; i++) {
            const item = document.createElement('div');
            item.className = 'ascii-item';
            item.dataset.val = i;

            const charSpan = document.createElement('span');
            charSpan.className = 'ascii-char';
            charSpan.textContent = String.fromCharCode(i);

            const codeSpan = document.createElement('span');
            codeSpan.className = 'ascii-code';
            codeSpan.textContent = i;

            item.appendChild(charSpan);
            item.appendChild(codeSpan);

            item.addEventListener('click', () => {
                updateFromAscii(i);
            });

            asciiGrid.appendChild(item);
        }
    }

    function updateUI(val) {
        // Clamp value to 0-255 (unsigned char range)
        val = Math.max(0, Math.min(255, val));
        currentValue = val;
        const char = String.fromCharCode(val);

        // Update Inputs
        if (document.activeElement !== charInput) {
            charInput.value = char;
        }
        if (document.activeElement !== asciiInput) {
            asciiInput.value = val;
        }

        // Update Binary Display
        for (let i = 7; i >= 0; i--) {
            const bitEl = document.getElementById(`bit-${i}`);
            const bitVal = (val >> i) & 1;
            bitEl.querySelector('.bit-val').textContent = bitVal;
            if (bitVal) {
                bitEl.classList.add('on');
            } else {
                bitEl.classList.remove('on');
            }
        }

        // Update Hex
        hexValue.textContent = '0x' + val.toString(16).toUpperCase().padStart(2, '0');

        // Update Code Preview
        // Escape special chars for display
        let displayChar = char;
        if (val === 32) displayChar = ' '; // Space

        codeChar.textContent = displayChar;
        outputChar.textContent = displayChar;
        outputAscii.textContent = val;

        mathChar.textContent = displayChar;
        mathResult.textContent = val + 1;
        mathResult.textContent = val + 1;
        mathResultChar.textContent = String.fromCharCode(val + 1);

        // Update Case Conversion
        const charStr = String.fromCharCode(val);
        const lowerStr = charStr.toLowerCase();
        const upperStr = charStr.toUpperCase();
        const lowerVal = lowerStr.charCodeAt(0);
        const upperVal = upperStr.charCodeAt(0);

        caseOriginalChar.textContent = displayChar;
        caseOriginalAscii.textContent = val;

        caseLowerChar.textContent = lowerStr;
        caseLowerAscii.textContent = lowerVal;

        caseUpperChar.textContent = upperStr;
        caseUpperAscii.textContent = upperVal;

        codeCaseChar.textContent = displayChar;
        codeLowerResult.textContent = `'${lowerStr}'`;
        codeUpperResult.textContent = `'${upperStr}'`;

        // Highlight in Table
        document.querySelectorAll('.ascii-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.val) === val) {
                item.classList.add('active');
                // Scroll into view if needed (optional, maybe too jumpy)
            }
        });
    }

    function updateFromChar(charStr) {
        if (charStr.length > 0) {
            const val = charStr.charCodeAt(0);
            updateUI(val);
        } else {
            // Handle empty input
            updateUI(0);
        }
    }

    function updateFromAscii(val) {
        updateUI(parseInt(val) || 0);
    }

    // Event Listeners
    charInput.addEventListener('input', (e) => {
        updateFromChar(e.target.value);
    });

    asciiInput.addEventListener('input', (e) => {
        updateFromAscii(e.target.value);
    });

    // Initial Setup
    generateBitsUI();
    generateAsciiTable();
    updateUI(65); // Start with 'A'
});
