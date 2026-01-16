// ===== Tab Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});

// ===== Interactive Regex Tester =====
function testRegex() {
    const regexInput = document.getElementById('regex-input').value;
    const testInput = document.getElementById('test-input').value;
    const resultsDiv = document.getElementById('test-results');
    const resultsContent = document.getElementById('results-content');
    const cppCodeDiv = document.getElementById('cpp-code');
    const cppCodeContent = document.getElementById('cpp-code-content');
    
    // Get flags
    let flags = '';
    if (document.getElementById('flag-g').checked) flags += 'g';
    if (document.getElementById('flag-i').checked) flags += 'i';
    if (document.getElementById('flag-m').checked) flags += 'm';
    
    try {
        // Create regex object
        const regex = new RegExp(regexInput, flags);
        
        // Find all matches
        const matches = [...testInput.matchAll(regex)];
        
        // Display results
        resultsDiv.classList.remove('hidden');
        
        if (matches.length > 0) {
            let html = `<p style="color: var(--success); font-weight: 600;">✓ 找到 ${matches.length} 個匹配</p>`;
            
            // Highlight matches in original text
            let highlightedText = testInput;
            let offset = 0;
            
            matches.forEach((match, index) => {
                const matchStart = match.index + offset;
                const matchEnd = matchStart + match[0].length;
                const before = highlightedText.substring(0, matchStart);
                const matched = highlightedText.substring(matchStart, matchEnd);
                const after = highlightedText.substring(matchEnd);
                
                highlightedText = before + `<span class="match-highlight">${matched}</span>` + after;
                offset += '<span class="match-highlight"></span>'.length;
            });
            
            html += `<div style="background: var(--bg-code); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; line-height: 1.8;">
                ${highlightedText}
            </div>`;
            
            // Display match details
            html += '<div class="match-info">';
            matches.forEach((match, index) => {
                html += `<div class="match-item">`;
                html += `<strong>匹配 ${index + 1}:</strong> "${match[0]}"`;
                
                // Show capture groups if any
                if (match.length > 1) {
                    html += '<br><span style="color: var(--text-muted); font-size: 0.9rem;">捕獲群組:</span>';
                    for (let i = 1; i < match.length; i++) {
                        html += `<br>&nbsp;&nbsp;群組 ${i}: "${match[i]}"`;
                    }
                }
                
                html += `<br><span style="color: var(--text-muted); font-size: 0.85rem;">位置: ${match.index}</span>`;
                html += `</div>`;
            });
            html += '</div>';
            
            resultsContent.innerHTML = html;
        } else {
            resultsContent.innerHTML = '<p class="no-match">✗ 沒有找到匹配的結果</p>';
        }
        
        // Generate C++ code
        generateCppCode(regexInput, testInput, flags);
        cppCodeDiv.classList.remove('hidden');
        
    } catch (error) {
        resultsDiv.classList.remove('hidden');
        resultsContent.innerHTML = `<p style="color: var(--error); font-weight: 600;">✗ 錯誤: ${error.message}</p>
            <p class="text-muted" style="font-size: 0.9rem;">請檢查你的正規表達式語法</p>`;
        cppCodeDiv.classList.add('hidden');
    }
}

// ===== Generate C++ Code =====
function generateCppCode(pattern, testString, flags) {
    const cppCodeContent = document.getElementById('cpp-code-content');
    
    // Escape backslashes for C++
    const cppPattern = pattern.replace(/\\/g, '\\\\');
    
    // Determine regex flags
    let flagsCode = '';
    if (flags.includes('i')) {
        flagsCode = ', regex::icase';
    }
    
    const code = `<span class="keyword">#include</span> <span class="string">&lt;iostream&gt;</span>
<span class="keyword">#include</span> <span class="string">&lt;regex&gt;</span>
<span class="keyword">#include</span> <span class="string">&lt;string&gt;</span>
<span class="keyword">using namespace</span> std;

<span class="keyword">int</span> <span class="function">main</span>() {
    <span class="comment">// 定義測試字串</span>
    string text = <span class="string">"${escapeString(testString)}"</span>;
    
    <span class="comment">// 定義正規表達式模式</span>
    regex pattern(<span class="string">"${cppPattern}"</span>${flagsCode});
    
    <span class="comment">// 使用 sregex_iterator 找出所有匹配</span>
    sregex_iterator iter(text.begin(), text.end(), pattern);
    sregex_iterator end;
    
    <span class="keyword">int</span> count = <span class="number">0</span>;
    <span class="keyword">while</span> (iter != end) {
        smatch match = *iter;
        cout <span class="operator">&lt;&lt;</span> <span class="string">"匹配 "</span> <span class="operator">&lt;&lt;</span> ++count <span class="operator">&lt;&lt;</span> <span class="string">": "</span> 
             <span class="operator">&lt;&lt;</span> match.str() <span class="operator">&lt;&lt;</span> endl;
        
        <span class="comment">// 顯示捕獲群組</span>
        <span class="keyword">for</span> (size_t i = <span class="number">1</span>; i <span class="operator">&lt;</span> match.size(); ++i) {
            cout <span class="operator">&lt;&lt;</span> <span class="string">"  群組 "</span> <span class="operator">&lt;&lt;</span> i <span class="operator">&lt;&lt;</span> <span class="string">": "</span> 
                 <span class="operator">&lt;&lt;</span> match[i].str() <span class="operator">&lt;&lt;</span> endl;
        }
        
        ++iter;
    }
    
    <span class="keyword">if</span> (count == <span class="number">0</span>) {
        cout <span class="operator">&lt;&lt;</span> <span class="string">"沒有找到匹配"</span> <span class="operator">&lt;&lt;</span> endl;
    }
    
    <span class="keyword">return</span> <span class="number">0</span>;
}`;
    
    cppCodeContent.innerHTML = code;
}

// Helper function to escape strings for C++
function escapeString(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

// ===== Example Loader =====
function loadExample(exampleType) {
    const examples = {
        email: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            test: 'user@example.com\ntest.email@domain.co.uk\ninvalid@\n@example.com\nuser@domain',
            flags: { g: true, i: false, m: true }
        },
        phone: {
            pattern: '^09\\d{8}$',
            test: '0912345678\n0987654321\n0812345678\n09123456789',
            flags: { g: true, i: false, m: true }
        },
        date: {
            pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
            test: '2024-12-29\n2024-13-01\n2024-12-32\n2024-01-15',
            flags: { g: true, i: false, m: true }
        },
        url: {
            pattern: '^https?://[^\\s/$.?#].[^\\s]*$',
            test: 'https://www.example.com\nhttp://example.com/path\nftp://example.com\nwww.example.com',
            flags: { g: true, i: false, m: true }
        },
        password: {
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
            test: 'Password123!\npassword123\nPASSWORD123\nPass123\nMyP@ssw0rd',
            flags: { g: true, i: false, m: true }
        },
        ipv4: {
            pattern: '^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)$',
            test: '192.168.1.1\n255.255.255.255\n256.1.1.1\n192.168.1.256\n10.0.0.1',
            flags: { g: true, i: false, m: true }
        },
        hex: {
            pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
            test: '#FF5733\n#F57\n#GGGGGG\n#12345\n#ABC',
            flags: { g: true, i: false, m: true }
        },
        username: {
            pattern: '^[a-zA-Z0-9_]{3,16}$',
            test: 'user123\nvalid_user\nab\nthis_is_too_long_username\nuser-name',
            flags: { g: true, i: false, m: true }
        }
    };
    
    const example = examples[exampleType];
    if (example) {
        // Switch to tester tab
        const testerTab = document.querySelector('[data-tab="tester"]');
        if (testerTab) {
            testerTab.click();
        }
        
        // Load example data
        document.getElementById('regex-input').value = example.pattern;
        document.getElementById('test-input').value = example.test;
        
        // Set flags
        document.getElementById('flag-g').checked = example.flags.g;
        document.getElementById('flag-i').checked = example.flags.i;
        document.getElementById('flag-m').checked = example.flags.m;
        
        // Auto-test
        setTimeout(() => {
            testRegex();
            // Scroll to results
            document.getElementById('test-results').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 300);
    }
}

// ===== Auto-test on input change =====
document.addEventListener('DOMContentLoaded', function() {
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    const flagCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    if (regexInput && testInput) {
        // Add event listeners for real-time testing
        let debounceTimer;
        const autoTest = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (regexInput.value && testInput.value) {
                    testRegex();
                }
            }, 500);
        };
        
        regexInput.addEventListener('input', autoTest);
        testInput.addEventListener('input', autoTest);
        
        flagCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (regexInput.value && testInput.value) {
                    testRegex();
                }
            });
        });
        
        // Initial test with default values
        if (regexInput.value && testInput.value) {
            testRegex();
        }
    }
});

// ===== Smooth Scroll for Cards =====
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
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
    
    cards.forEach(card => {
        observer.observe(card);
    });
});

// ===== Add keyboard shortcuts =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to test regex
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const testerTab = document.querySelector('[data-tab="tester"]');
        if (testerTab && testerTab.classList.contains('active')) {
            e.preventDefault();
            testRegex();
        }
    }
    
    // Ctrl/Cmd + 1-6 to switch tabs
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const tabButtons = document.querySelectorAll('.tab-btn');
        const index = parseInt(e.key) - 1;
        if (tabButtons[index]) {
            tabButtons[index].click();
        }
    }
});

// ===== Add tooltip for keyboard shortcuts =====
document.addEventListener('DOMContentLoaded', function() {
    const testerTab = document.querySelector('[data-tab="tester"]');
    if (testerTab) {
        testerTab.title = '快捷鍵: Ctrl+5';
    }
    
    const testButton = document.querySelector('.tester-container .btn');
    if (testButton) {
        testButton.title = '快捷鍵: Ctrl+Enter';
    }
});

console.log('🎉 C++ 正規表達式教學已載入！');
console.log('💡 提示：使用 Ctrl+1-6 快速切換分頁，Ctrl+Enter 執行測試');
