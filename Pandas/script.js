// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Basic interaction for Run buttons
    const runButtons = document.querySelectorAll('.run-btn');

    runButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const cellId = this.dataset.target;
            const outputDiv = document.getElementById(cellId);
            const spinner = this.querySelector('.loading-spinner');
            const playIcon = this.querySelector('.play-icon');

            // Animation state
            this.disabled = true;
            spinner.style.display = 'block';
            playIcon.style.display = 'none';
            document.querySelector(`.gutter[data-for="${cellId}"]`).innerHTML = `[*]:`;

            // Clear previous output
            outputDiv.classList.remove('visible');

            // Simulate processing time
            const delay = Math.random() * 500 + 400; // 400-900ms random delay

            setTimeout(() => {
                // Populate content based on cellId
                const executeCount = Math.floor(Math.random() * 100) + 1;
                document.querySelector(`.gutter[data-for="${cellId}"]`).innerHTML = `[${executeCount}]:`;

                renderOutput(cellId, outputDiv);

                outputDiv.classList.add('visible');

                // Reset button
                this.disabled = false;
                spinner.style.display = 'none';
                playIcon.style.display = 'inline-block';
            }, delay);
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.cell, h2').forEach(el => observer.observe(el));
});

function renderOutput(id, container) {
    let content = '';

    switch (id) {
        case 'out-1': // DataFrame Creation
            content = generateTable(
                ['Name', 'Age', 'City', 'Score'],
                [
                    ['Alice', 25, 'New York', 85],
                    ['Bob', 30, 'Los Angeles', 92],
                    ['Charlie', 35, 'Chicago', 78],
                    ['David', 28, 'Houston', 95]
                ]
            );
            break;

        case 'out-2': // Inspection .head(2)
            content = generateTable(
                ['Name', 'Age', 'City', 'Score'],
                [
                    ['Alice', 25, 'New York', 85],
                    ['Bob', 30, 'Los Angeles', 92]
                ]
            );
            break;

        case 'out-3': // Selection .loc (Select Age > 28)
            content = generateTable(
                ['Name', 'Age', 'City', 'Score'],
                [
                    ['Bob', 30, 'Los Angeles', 92],
                    ['Charlie', 35, 'Chicago', 78]
                ],
                [1, 2] // Custom indices
            );
            break;

        case 'out-3-1': // Multiple Conditions (Age > 25 & Score >= 90)
            // Bob (30, 92), David (28, 95)
            content = generateTable(
                ['Name', 'Age', 'City', 'Score'],
                [
                    ['Bob', 30, 'Los Angeles', 92],
                    ['David', 28, 'Houston', 95]
                ],
                [1, 3]
            );
            break;

        case 'out-3-2': // Column Selection ['Name', 'Score']
            content = generateTable(
                ['Name', 'Score'],
                [
                    ['Alice', 85],
                    ['Bob', 92],
                    ['Charlie', 78],
                    ['David', 95]
                ]
            );
            break;

        case 'out-3-3': // iloc[1:3, 0:2] -> Rows 1,2 (Bob, Charlie); Cols 0,1 (Name, Age)
            content = generateTable(
                ['Name', 'Age'],
                [
                    ['Bob', 30],
                    ['Charlie', 35]
                ],
                [1, 2]
            );
            break;

        case 'out-4': // Info()
            content = `<div style="white-space: pre-wrap; color: var(--text-primary);">
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 4 entries, 0 to 3
Data columns (total 4 columns):
 #   Column  Non-Null Count  Dtype 
---  ------  --------------  ----- 
 0   Name    4 non-null      object
 1   Age     4 non-null      int64 
 2   City    4 non-null      object
 3   Score   4 non-null      int64 
dtypes: int64(2), object(2)
memory usage: 256.0+ bytes
</div>`;
            break;

        case 'out-5': // GroupBy
            content = generateTable(
                ['City', 'Score (mean)'],
                [
                    ['Chicago', 78.0],
                    ['Houston', 95.0],
                    ['Los Angeles', 92.0],
                    ['New York', 85.0]
                ],
                null,
                false // Index is now City usually, but for simple viz we keep standard table
            );
            // Make column 1 index-like execution
            content = `
             <table class="dataframe">
                <thead>
                    <tr>
                        <th style="text-align: left">City</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><th>Chicago</th><td>78.0</td></tr>
                    <tr><th>Houston</th><td>95.0</td></tr>
                    <tr><th>Los Angeles</th><td>92.0</td></tr>
                    <tr><th>New York</th><td>85.0</td></tr>
                </tbody>
             </table>
             `;
            break;

        case 'out-6': // Describe
            content = generateTable(
                ['', 'Age', 'Score'],
                [
                    ['count', '4.000000', '4.000000'],
                    ['mean', '29.500000', '87.500000'],
                    ['std', '4.203173', '7.724420'],
                    ['min', '25.000000', '78.000000'],
                    ['25%', '27.250000', '83.250000'],
                    ['50%', '29.000000', '88.500000'],
                    ['75%', '31.250000', '92.750000'],
                    ['max', '35.000000', '95.000000']
                ],
                null,
                true
            );
            break;

        default:
            content = '<span style="color: #ff7b72;">Error: Output not defined for this cell.</span>';
    }

    container.innerHTML = content;
}

function generateTable(headers, rows, indices = null, firstColIsIndex = false) {
    let html = '<table class="dataframe">';

    // Header
    html += '<thead><tr>';
    if (!firstColIsIndex) {
        html += '<th class="index-col"></th>'; // Empty top-left corner
    }
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead>';

    // Body
    html += '<tbody>';
    rows.forEach((row, i) => {
        html += '<tr>';

        if (!firstColIsIndex) {
            // Index Number
            const idx = indices ? indices[i] : i;
            html += `<td class="index-col">${idx}</td>`;
        } else {
            // For describe(), the first column contains the labels (count, mean, etc) acting as index
        }

        row.forEach((cell, cellIdx) => {
            if (firstColIsIndex && cellIdx === 0) {
                html += `<td class="index-col" style="text-align: left;">${cell}</td>`;
            } else {
                html += `<td>${cell}</td>`;
            }
        });
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';

    return html;
}
