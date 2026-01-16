document.addEventListener('DOMContentLoaded', () => {
    // === Navigation Logic ===
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Hide all sections
            sections.forEach(s => s.classList.remove('active'));
            // Show target section
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Trigger resize to fix plotly rendering when unhidden
            window.dispatchEvent(new Event('resize'));
        });
    });

    // === Chart Rendering Logic ===
    // We use Plotly.js to simulate the output of Python's plotly.express

    renderBarChart();
    renderHistogram();
    renderLineChart();
    renderStackedChart();
    renderPieChart();
});

// 1. Bar Chart
function renderBarChart() {
    const x = ["台北", "台中", "高雄", "台南"];
    const y = [250, 280, 270, 180];
    
    // In PX, color='City' assigns different colors. We simulate this manually or let Plotly handle it.
    const trace = {
        x: x,
        y: y,
        type: 'bar',
        marker: {
            color: ['#636efa', '#EF553B', '#00cc96', '#ab63fa'] // Plotly default colors
        },
        text: y, // Display value
        textposition: 'auto'
    };

    const layout = {
        title: '台灣主要城市人口數',
        xaxis: { title: 'City' },
        yaxis: { title: 'Population' },
        margin: { t: 40, b: 40, l: 40, r: 20 },
        font: { family: 'Outfit, sans-serif' }
    };

    Plotly.newPlot('plot-bar', [trace], layout, {responsive: true});
}

// 2. Histogram
function renderHistogram() {
    // Generate random data: Normal distribution (mean=70, std=10, count=200)
    // Simple Box-Muller transform for randomness
    const data = [];
    for(let i=0; i<200; i++) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); 
        while(v === 0) v = Math.random();
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num * 10 + 70; // Mean 70, Std 10
        if(num > 100) num = 100;
        if(num < 0) num = 0;
        data.push(num);
    }

    const trace = {
        x: data,
        type: 'histogram',
        marker: {
            color: '#ff7f0e',
        },
        xbins: { 
            size: 5 // Bin size
        } 
    };

    const layout = {
        title: '學生成績分布直方圖',
        xaxis: { title: '分數' },
        yaxis: { title: '人數' },
        margin: { t: 40, b: 40, l: 40, r: 20 },
        bargap: 0.05,
        font: { family: 'Outfit, sans-serif' }
    };

    Plotly.newPlot('plot-histogram', [trace], layout, {responsive: true});
}

// 3. Line Chart
function renderLineChart() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const sales = [100, 120, 150, 170, 160, 200];
    const profit = [20, 30, 40, 50, 45, 70];

    const trace1 = {
        x: months,
        y: sales,
        mode: 'lines+markers',
        name: 'Sales',
        line: { shape: 'linear', width: 3 },
        marker: { size: 8 }
    };

    const trace2 = {
        x: months,
        y: profit,
        mode: 'lines+markers',
        name: 'Profit',
        line: { shape: 'linear', width: 3 },
        marker: { size: 8 }
    };

    const layout = {
        title: '上半年營收與利潤趨勢',
        xaxis: { title: 'Month' },
        yaxis: { title: 'Value' },
        margin: { t: 40, b: 40, l: 40, r: 20 },
        font: { family: 'Outfit, sans-serif' },
        hovermode: 'x unified'
    };

    Plotly.newPlot('plot-line', [trace1, trace2], layout, {responsive: true});
}

// 4. Stacked Bar Chart
function renderStackedChart() {
    const years = ["2023", "2024"];
    
    // Grouped by Product
    const phone = {
        x: years,
        y: [500, 600],
        name: 'Phone',
        type: 'bar'
    };
    
    const laptop = {
        x: years,
        y: [300, 350],
        name: 'Laptop',
        type: 'bar'
    };
    
    const tablet = {
        x: years,
        y: [150, 200],
        name: 'Tablet',
        type: 'bar'
    };

    const layout = {
        title: '年度產品營收結構',
        xaxis: { title: 'Year' },
        yaxis: { title: 'Revenue' },
        barmode: 'stack',
        margin: { t: 40, b: 40, l: 40, r: 20 },
        font: { family: 'Outfit, sans-serif' }
    };

    Plotly.newPlot('plot-stacked', [phone, laptop, tablet], layout, {responsive: true});
}

// 5. Pie Chart
function renderPieChart() {
    const values = [65, 15, 10, 8, 2];
    const labels = ["Chrome", "Edge", "Firefox", "Safari", "Others"];

    const trace = {
        values: values,
        labels: labels,
        type: 'pie',
        hole: 0.4, // Donut
        textinfo: 'label+percent',
        insidetextorientation: 'radial'
    };

    const layout = {
        title: '瀏覽器市佔率',
        margin: { t: 40, b: 40, l: 40, r: 20 },
        font: { family: 'Outfit, sans-serif' }
    };

    Plotly.newPlot('plot-pie', [trace], layout, {responsive: true});
}
